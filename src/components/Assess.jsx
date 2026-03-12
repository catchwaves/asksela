import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = ['Idea', 'Scorecard', 'Financials', 'Advisors', 'Founder Fit', 'Verdict']

const styles = `
  .assess-wrap { min-height: 100vh; background: var(--paper); padding-top: 0; }

  /* ASSESS NAV */
  .assess-nav { position: sticky; top: 0; z-index: 100; background: rgba(247,242,234,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 16px 48px; display: flex; align-items: center; justify-content: space-between; }
  .assess-logo { display: flex; align-items: baseline; gap: 4px; cursor: pointer; text-decoration: none; }
  .assess-logo-ask { font-family: var(--font-body); font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .assess-logo-sela { font-family: var(--font-display); font-size: 22px; font-weight: 500; font-style: italic; color: var(--ink); line-height: 1; }
  .assess-steps { display: flex; align-items: center; gap: 0; }
  .assess-step-item { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 400; color: var(--muted); letter-spacing: 0.05em; padding: 0 16px; }
  .assess-step-item.active { color: var(--ink); font-weight: 500; }
  .assess-step-item.done { color: var(--sage); }
  .assess-step-num { width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
  .assess-step-item.active .assess-step-num { background: var(--ink); border-color: var(--ink); color: var(--paper); }
  .assess-step-item.done .assess-step-num { background: var(--sage); border-color: var(--sage); color: var(--paper); }
  .assess-step-sep { width: 20px; height: 1px; background: var(--border); flex-shrink: 0; }

  /* CONTENT */
  .assess-content { max-width: 760px; margin: 0 auto; padding: 60px 24px 120px; }
  .assess-heading { font-family: var(--font-display); font-size: clamp(32px,4vw,48px); font-weight: 300; line-height: 1.15; color: var(--ink); margin-bottom: 12px; }
  .assess-heading em { font-style: italic; color: var(--clay); }
  .assess-sub { font-size: 15px; font-weight: 300; color: var(--ink-soft); margin-bottom: 40px; line-height: 1.7; }

  /* FORM ELEMENTS */
  .field { margin-bottom: 28px; }
  .field label { display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 10px; }
  .field textarea, .field input { width: 100%; background: white; border: 1px solid var(--border); border-radius: 2px; padding: 16px; font-family: var(--font-body); font-size: 14px; font-weight: 300; color: var(--ink); line-height: 1.6; resize: vertical; outline: none; transition: border-color 0.2s; }
  .field textarea:focus, .field input:focus { border-color: var(--clay); }
  .field textarea::placeholder, .field input::placeholder { color: var(--muted); }
  .field-hint { font-size: 12px; color: var(--muted); margin-top: 8px; }

  .fin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }

  /* BUTTONS */
  .assess-actions { display: flex; align-items: center; gap: 16px; margin-top: 40px; }
  .btn-assess-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--ink); color: var(--paper); border: none; padding: 16px 32px; font-family: var(--font-body); font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 2px; cursor: pointer; transition: background 0.2s, transform 0.2s; }
  .btn-assess-primary:hover:not(:disabled) { background: var(--clay); transform: translateY(-1px); }
  .btn-assess-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-assess-back { background: none; border: 1px solid var(--border); padding: 16px 24px; font-family: var(--font-body); font-size: 13px; color: var(--muted); border-radius: 2px; cursor: pointer; transition: all 0.2s; }
  .btn-assess-back:hover { border-color: var(--ink); color: var(--ink); }

  /* LOADING */
  .loading-wrap { text-align: center; padding: 80px 0; }
  .spinner { width: 36px; height: 36px; border: 2px solid var(--border); border-top-color: var(--clay); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 24px; }
  .loading-label { font-family: var(--font-display); font-size: 22px; font-style: italic; color: var(--ink-soft); margin-bottom: 8px; }
  .loading-sub { font-size: 13px; color: var(--muted); }

  /* SCORECARD */
  .scorecard-overall { background: var(--ink); color: var(--paper); border-radius: 4px; padding: 32px; margin-bottom: 32px; display: flex; align-items: center; gap: 40px; }
  .overall-num { font-family: var(--font-display); font-size: 72px; font-weight: 300; color: var(--clay); line-height: 1; flex-shrink: 0; }
  .overall-label { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(247,242,234,0.5); margin-bottom: 10px; }
  .overall-verdict { font-family: var(--font-display); font-size: 22px; font-style: italic; color: var(--paper); margin-bottom: 8px; line-height: 1.3; }
  .score-dimension-row { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
  .score-dimension-label { font-size: 13px; color: var(--ink-soft); width: 180px; flex-shrink: 0; }
  .score-dimension-bar-wrap { flex: 1; height: 6px; background: var(--paper-deep); border-radius: 3px; overflow: hidden; }
  .score-dimension-bar { height: 100%; border-radius: 3px; transition: width 0.8s ease; }
  .score-dimension-num { font-size: 13px; font-weight: 500; color: var(--ink); width: 32px; text-align: right; }
  .scorecard-highlights { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
  .highlight-card { padding: 20px; border-radius: 2px; }
  .highlight-card.strength { background: rgba(92,122,98,0.1); border-left: 3px solid var(--sage); }
  .highlight-card.risk { background: rgba(200,132,90,0.1); border-left: 3px solid var(--clay); }
  .highlight-label { font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px; }
  .highlight-card.strength .highlight-label { color: var(--sage); }
  .highlight-card.risk .highlight-label { color: var(--clay); }
  .highlight-text { font-size: 14px; font-weight: 300; color: var(--ink-soft); line-height: 1.6; }

  /* FINANCIAL */
  .fin-result-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-bottom: 28px; }
  .fin-card { background: white; border: 1px solid var(--border); border-radius: 4px; padding: 24px; }
  .fin-card-label { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .fin-card-value { font-family: var(--font-display); font-size: 32px; font-weight: 300; color: var(--ink); margin-bottom: 6px; }
  .fin-card-note { font-size: 12px; color: var(--muted); }
  .fin-truth { background: var(--ink); color: var(--paper); border-radius: 4px; padding: 28px; margin-top: 8px; }
  .fin-truth-label { font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--clay); margin-bottom: 12px; }
  .fin-truth-text { font-family: var(--font-display); font-size: 20px; font-style: italic; line-height: 1.5; color: rgba(247,242,234,0.9); }

  /* ADVISORS */
  .advisor-response-card { background: white; border: 1px solid var(--border); border-radius: 4px; margin-bottom: 16px; overflow: hidden; }
  .advisor-response-header { display: flex; align-items: center; gap: 16px; padding: 20px 24px; cursor: pointer; transition: background 0.2s; }
  .advisor-response-header:hover { background: var(--paper); }
  .advisor-badge { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 20px; color: var(--paper); flex-shrink: 0; }
  .advisor-response-name { font-family: var(--font-display); font-size: 18px; font-weight: 500; color: var(--ink); }
  .advisor-response-role { font-size: 11px; color: var(--muted); letter-spacing: 0.08em; }
  .advisor-stance { margin-left: auto; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 12px; border-radius: 2px; flex-shrink: 0; }
  .stance-support { background: rgba(92,122,98,0.12); color: var(--sage); }
  .stance-caution { background: rgba(200,132,90,0.12); color: var(--clay); }
  .stance-stop { background: rgba(180,80,70,0.12); color: #C4544A; }
  .advisor-response-body { padding: 0 24px 24px; border-top: 1px solid var(--border); display: none; }
  .advisor-response-body.open { display: block; padding-top: 20px; }
  .advisor-response-section { margin-bottom: 16px; }
  .advisor-response-section-label { font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .advisor-response-section-text { font-size: 14px; font-weight: 300; color: var(--ink-soft); line-height: 1.7; }
  .advisor-toggle { color: var(--muted); font-size: 12px; transition: transform 0.2s; }
  .advisor-toggle.open { transform: rotate(180deg); }

  /* FOUNDER FIT */
  .fit-score-wrap { background: var(--ink); border-radius: 4px; padding: 32px; margin-bottom: 28px; display: flex; align-items: center; gap: 40px; }
  .fit-score-num { font-family: var(--font-display); font-size: 72px; font-weight: 300; color: var(--clay); line-height: 1; flex-shrink: 0; }
  .fit-score-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,242,234,0.5); margin-bottom: 8px; }
  .fit-score-text { font-family: var(--font-display); font-size: 20px; font-style: italic; color: rgba(247,242,234,0.9); line-height: 1.4; }
  .fit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .fit-card { background: white; border: 1px solid var(--border); border-radius: 4px; padding: 20px; }
  .fit-card-label { font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .fit-card-text { font-size: 14px; font-weight: 300; color: var(--ink-soft); line-height: 1.65; }
  .fit-question { background: var(--paper-deep); border: 1px solid var(--border); border-radius: 4px; padding: 24px; border-left: 3px solid var(--clay); }
  .fit-question-label { font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--clay); margin-bottom: 10px; }
  .fit-question-text { font-family: var(--font-display); font-size: 20px; font-style: italic; color: var(--ink); line-height: 1.4; }

  /* VERDICT */
  .verdict-banner { border-radius: 4px; padding: 36px; margin-bottom: 28px; text-align: center; }
  .verdict-banner.go { background: var(--sage); }
  .verdict-banner.adjust { background: var(--clay); }
  .verdict-banner.pause { background: var(--ink); }
  .verdict-word { font-family: var(--font-display); font-size: 64px; font-weight: 300; color: white; line-height: 1; margin-bottom: 16px; letter-spacing: -0.02em; }
  .verdict-reasoning { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.85); line-height: 1.7; max-width: 560px; margin: 0 auto; }
  .verdict-section { margin-bottom: 28px; }
  .verdict-section-title { font-family: var(--font-display); font-size: 22px; font-weight: 500; color: var(--ink); margin-bottom: 16px; }
  .obstacle-item { background: white; border: 1px solid var(--border); border-radius: 4px; padding: 20px 24px; margin-bottom: 12px; }
  .obstacle-num { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .obstacle-text { font-size: 14px; font-weight: 400; color: var(--ink); margin-bottom: 6px; line-height: 1.5; }
  .obstacle-mitigation { font-size: 13px; font-weight: 300; color: var(--ink-soft); line-height: 1.6; }
  .next-step-item { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
  .next-step-num { font-family: var(--font-display); font-size: 28px; font-weight: 300; color: var(--clay); line-height: 1; flex-shrink: 0; width: 32px; }
  .next-step-text { font-size: 14px; font-weight: 300; color: var(--ink-soft); line-height: 1.65; padding-top: 6px; }
  .restart-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--paper-deep); border: 1px solid var(--border); padding: 14px 28px; font-family: var(--font-body); font-size: 13px; color: var(--ink-soft); border-radius: 2px; cursor: pointer; transition: all 0.2s; margin-top: 40px; }
  .restart-btn:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }

  /* ERROR */
  .error-box { background: rgba(180,80,70,0.08); border: 1px solid rgba(180,80,70,0.25); border-radius: 4px; padding: 20px 24px; margin-bottom: 24px; font-size: 14px; color: #8B3A34; line-height: 1.6; }
`

const ADVISOR_COLORS = {
  Maya:   'var(--sage)',
  Rex:    'var(--clay)',
  Stella: '#9B7DB6',
  Dario:  '#7A8FA6',
  Jordan: '#A0845C',
}

const ADVISOR_ROLES = {
  Maya:   'Financial Advisor',
  Rex:    'Operator',
  Stella: 'Brand & Market',
  Dario:  "Devil's Advocate",
  Jordan: "Founder's Coach",
}

async function callClaude(systemPrompt, userMessage) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.content[0].text
}

function parseJSON(text) {
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return null
  }
}

export default function Assess() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Step 1 inputs
  const [idea, setIdea]           = useState('')
  const [founderContext, setFounderContext] = useState('')

  // Step 2 — scorecard
  const [scorecard, setScorecard] = useState(null)

  // Step 3 — financial inputs + results
  const [finInputs, setFinInputs] = useState({ price: '', customers: '', startup: '', expenses: '' })
  const [financials, setFinancials] = useState(null)

  // Step 4 — advisors
  const [advisors, setAdvisors]   = useState(null)
  const [openAdvisor, setOpenAdvisor] = useState(null)

  // Step 5 — fit inputs + results
  const [fitInputs, setFitInputs] = useState({ background: '', time: '', capital: '', motivation: '', weakness: '' })
  const [fit, setFit]             = useState(null)

  // Step 6 — verdict
  const [verdict, setVerdict]     = useState(null)

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = styles
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  // ── Step handlers ──────────────────────────────────────────────

  async function generateScorecard() {
    setLoading(true); setError(null)
    try {
      const raw = await callClaude(
        `You are Sela, an honest business advisor. Evaluate ideas rigorously. Return ONLY valid JSON, no markdown.`,
        `Evaluate this business idea and return a JSON object with exactly this shape:
{
  "dimensions": [
    {"name": "Market Opportunity", "score": 1-10, "note": "one sentence"},
    {"name": "Competitive Advantage", "score": 1-10, "note": "one sentence"},
    {"name": "Founder-Market Fit", "score": 1-10, "note": "one sentence"},
    {"name": "Capital Requirements", "score": 1-10, "note": "one sentence (10=low capital needed)"},
    {"name": "Time to Revenue", "score": 1-10, "note": "one sentence (10=fast)"},
    {"name": "Execution Complexity", "score": 1-10, "note": "one sentence (10=simple)"},
    {"name": "Revenue Model Clarity", "score": 1-10, "note": "one sentence"},
    {"name": "Exit Potential", "score": 1-10, "note": "one sentence"}
  ],
  "overall": 1-100,
  "overallVerdict": "one honest sentence summarizing the idea",
  "strongestPoint": "the single strongest aspect in one sentence",
  "biggestRisk": "the single biggest risk in one sentence"
}

Business idea: ${idea}
Founder context: ${founderContext || 'Not provided'}`
      )
      const parsed = parseJSON(raw)
      if (!parsed) throw new Error('Could not parse response. Please try again.')
      setScorecard(parsed)
      setStep(1)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function generateFinancials() {
    setLoading(true); setError(null)
    try {
      const raw = await callClaude(
        `You are Sela, an honest financial advisor. Be realistic — not pessimistic, not optimistic. Return ONLY valid JSON.`,
        `Generate financial projections for this business. Return JSON with exactly this shape:
{
  "year1Revenue": "$XXX,XXX",
  "year3Revenue": "$X,XXX,XXX",
  "breakEvenMonth": "Month X",
  "startupCapital": "$XXX,XXX",
  "year1Profit": "$XX,XXX (or loss)",
  "year3Profit": "$XXX,XXX",
  "financialTruth": "The single most important financial reality this founder needs to hear. Be direct. 2-3 sentences."
}

Business idea: ${idea}
Typical price point: $${finInputs.price}/month or per unit
Expected first-year customers: ${finInputs.customers}
Estimated startup capital available: $${finInputs.startup}
Estimated monthly expenses: $${finInputs.expenses}`
      )
      const parsed = parseJSON(raw)
      if (!parsed) throw new Error('Could not parse response. Please try again.')
      setFinancials(parsed)
      setStep(2)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function generateAdvisors() {
    setLoading(true); setError(null)
    try {
      const raw = await callClaude(
        `You are running a 5-person advisory board for a startup founder. Each advisor has a distinct, honest voice. Return ONLY valid JSON.`,
        `Generate responses from each of 5 advisors for this business idea. Be genuinely honest — not all positive. Return JSON with this shape:
{
  "advisors": [
    {
      "name": "Maya",
      "stance": "SUPPORT" or "CAUTION" or "STOP",
      "excitedAbout": "one specific thing Maya is genuinely excited about",
      "concernedAbout": "one specific concern Maya has",
      "advice": "Maya's direct advice in 2-3 sentences"
    },
    { "name": "Rex", ... },
    { "name": "Stella", ... },
    { "name": "Dario", ... },
    { "name": "Jordan", ... }
  ],
  "boardVerdict": "PROCEED" or "ADJUST" or "PAUSE"
}

Business idea: ${idea}
Founder context: ${founderContext}
Scorecard overall: ${scorecard?.overall}/100
Biggest risk identified: ${scorecard?.biggestRisk}`
      )
      const parsed = parseJSON(raw)
      if (!parsed) throw new Error('Could not parse response. Please try again.')
      setAdvisors(parsed)
      setStep(3)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function generateFit() {
    setLoading(true); setError(null)
    try {
      const raw = await callClaude(
        `You are Sela, an honest founder coach. Assess fit honestly — not harshly, not gently. Return ONLY valid JSON.`,
        `Assess the founder's fit for this business. Return JSON with exactly this shape:
{
  "fitScore": 1-10,
  "fitSummary": "honest 1-sentence summary of fit",
  "strengths": "2-3 sentences about genuine strengths",
  "gaps": "2-3 sentences about real gaps",
  "helpNeeded": "what type of help they'll most need: financial/operational/knowledge/network — be specific",
  "mostImportantQuestion": "The single most important question this founder needs to answer before committing. Make it specific and probing."
}

Business idea: ${idea}
Background: ${fitInputs.background}
Time available: ${fitInputs.time}
Capital available: ${fitInputs.capital}
Motivation: ${fitInputs.motivation}
Self-identified weakness: ${fitInputs.weakness}`
      )
      const parsed = parseJSON(raw)
      if (!parsed) throw new Error('Could not parse response. Please try again.')
      setFit(parsed)
      setStep(4)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function generateVerdict() {
    setLoading(true); setError(null)
    try {
      const raw = await callClaude(
        `You are Sela. Give a final, honest verdict. Be direct. Don't hedge. Return ONLY valid JSON.`,
        `Give the final verdict for this founder and idea. Return JSON with exactly this shape:
{
  "verdict": "GO" or "ADJUST" or "PAUSE",
  "reasoning": "2-3 sentences explaining the verdict honestly",
  "obstacles": [
    {"obstacle": "specific obstacle 1", "mitigation": "concrete mitigation"},
    {"obstacle": "specific obstacle 2", "mitigation": "concrete mitigation"},
    {"obstacle": "specific obstacle 3", "mitigation": "concrete mitigation"}
  ],
  "nextSteps": [
    "Specific numbered action 1",
    "Specific numbered action 2",
    "Specific numbered action 3",
    "Specific numbered action 4"
  ],
  "adjustments": "If ADJUST or PAUSE: what specifically needs to change. If GO: what would make this stronger."
}

Business idea: ${idea}
Scorecard: ${scorecard?.overall}/100 — ${scorecard?.overallVerdict}
Biggest risk: ${scorecard?.biggestRisk}
Board verdict: ${advisors?.boardVerdict}
Founder fit: ${fit?.fitScore}/10 — ${fit?.fitSummary}
Most important question: ${fit?.mostImportantQuestion}`
      )
      const parsed = parseJSON(raw)
      if (!parsed) throw new Error('Could not parse response. Please try again.')
      setVerdict(parsed)
      setStep(5)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function reset() {
    setStep(0); setIdea(''); setFounderContext(''); setScorecard(null)
    setFinInputs({ price:'', customers:'', startup:'', expenses:'' }); setFinancials(null)
    setAdvisors(null); setOpenAdvisor(null)
    setFitInputs({ background:'', time:'', capital:'', motivation:'', weakness:'' }); setFit(null)
    setVerdict(null); setError(null)
  }

  // ── Render helpers ─────────────────────────────────────────────

  function scoreColor(s) {
    if (s >= 7.5) return 'var(--sage)'
    if (s >= 5)   return 'var(--clay-light)'
    return '#C4544A'
  }

  function verdictClass(v) {
    if (!v) return 'pause'
    const w = v.toUpperCase()
    if (w === 'GO') return 'go'
    if (w === 'ADJUST') return 'adjust'
    return 'pause'
  }

  // ── Steps ──────────────────────────────────────────────────────

  return (
    <div className="assess-wrap">
      {/* NAV */}
      <nav className="assess-nav">
        <div className="assess-logo" onClick={() => navigate('/')}>
          <span className="assess-logo-ask">Ask</span>
          <span className="assess-logo-sela">Sela</span>
        </div>
        <div className="assess-steps">
          {STEPS.map((s, i) => (
            <>
              <div key={s} className={`assess-step-item ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                <div className="assess-step-num">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div key={`sep${i}`} className="assess-step-sep" />}
            </>
          ))}
        </div>
      </nav>

      <div className="assess-content">

        {error && <div className="error-box">⚠ {error}</div>}

        {/* ── STEP 0: IDEA INPUT ── */}
        {step === 0 && (
          <>
            <h1 className="assess-heading">Tell Sela about<br /><em>your idea.</em></h1>
            <p className="assess-sub">No pitch deck needed. Plain language is fine. The more honest you are, the more useful Sela's assessment will be.</p>
            <div className="field">
              <label>Describe your business idea *</label>
              <textarea rows={5} value={idea} onChange={e => setIdea(e.target.value)} placeholder="What is the business? Who is it for? What problem does it solve? How do you make money?" />
            </div>
            <div className="field">
              <label>Tell Sela about yourself (optional but helpful)</label>
              <textarea rows={3} value={founderContext} onChange={e => setFounderContext(e.target.value)} placeholder="Your background, relevant experience, why you're the right person for this idea..." />
              <p className="field-hint">The more context you give, the more accurate the founder-market fit assessment will be.</p>
            </div>
            <div className="assess-actions">
              {loading
                ? <LoadingState label="Scoring your idea..." sub="Evaluating 8 dimensions of viability" />
                : <button className="btn-assess-primary" disabled={idea.trim().length < 20} onClick={generateScorecard}>
                    Get my scorecard <span>→</span>
                  </button>
              }
            </div>
          </>
        )}

        {/* ── STEP 1: SCORECARD ── */}
        {step === 1 && scorecard && (
          <>
            <h1 className="assess-heading">Your idea<br /><em>scorecard.</em></h1>
            <p className="assess-sub">Eight dimensions, honest scores. Your strongest point and biggest risk — named plainly.</p>

            <div className="scorecard-overall">
              <div className="overall-num">{scorecard.overall}</div>
              <div>
                <div className="overall-label">Overall viability score</div>
                <div className="overall-verdict">"{scorecard.overallVerdict}"</div>
              </div>
            </div>

            {scorecard.dimensions.map(d => (
              <div className="score-dimension-row" key={d.name}>
                <span className="score-dimension-label">{d.name}</span>
                <div className="score-dimension-bar-wrap">
                  <div className="score-dimension-bar" style={{ width: `${d.score * 10}%`, background: scoreColor(d.score) }} />
                </div>
                <span className="score-dimension-num">{d.score.toFixed(1)}</span>
              </div>
            ))}

            <div className="scorecard-highlights">
              <div className="highlight-card strength">
                <div className="highlight-label">Strongest point</div>
                <div className="highlight-text">{scorecard.strongestPoint}</div>
              </div>
              <div className="highlight-card risk">
                <div className="highlight-label">Biggest risk</div>
                <div className="highlight-text">{scorecard.biggestRisk}</div>
              </div>
            </div>

            <div className="assess-actions">
              <button className="btn-assess-back" onClick={() => setStep(0)}>← Back</button>
              {loading
                ? <LoadingState label="Analysing the financials..." sub="Building Year 1 and Year 3 projections" />
                : <button className="btn-assess-primary" onClick={() => setStep(1.5)}>
                    Continue to financials →
                  </button>
              }
            </div>
          </>
        )}

        {/* ── STEP 1.5: FINANCIAL INPUTS ── */}
        {step === 1.5 && (
          <>
            <h1 className="assess-heading">Financial<br /><em>reality check.</em></h1>
            <p className="assess-sub">Four quick questions. Sela will build Year 1 and Year 3 projections and tell you the financial truth most advisors won't say out loud.</p>
            <div className="fin-grid">
              <div className="field">
                <label>Price per customer ($/month or per sale) *</label>
                <input type="number" value={finInputs.price} onChange={e => setFinInputs(p => ({...p, price: e.target.value}))} placeholder="e.g. 250" />
              </div>
              <div className="field">
                <label>Target customers in Year 1 *</label>
                <input type="number" value={finInputs.customers} onChange={e => setFinInputs(p => ({...p, customers: e.target.value}))} placeholder="e.g. 100" />
              </div>
              <div className="field">
                <label>Startup capital available ($) *</label>
                <input type="number" value={finInputs.startup} onChange={e => setFinInputs(p => ({...p, startup: e.target.value}))} placeholder="e.g. 150000" />
              </div>
              <div className="field">
                <label>Estimated monthly expenses ($) *</label>
                <input type="number" value={finInputs.expenses} onChange={e => setFinInputs(p => ({...p, expenses: e.target.value}))} placeholder="e.g. 15000" />
              </div>
            </div>
            <div className="assess-actions">
              <button className="btn-assess-back" onClick={() => setStep(1)}>← Back</button>
              {loading
                ? <LoadingState label="Building your projections..." sub="Year 1, Year 3, break-even analysis" />
                : <button className="btn-assess-primary"
                    disabled={!finInputs.price || !finInputs.customers || !finInputs.startup || !finInputs.expenses}
                    onClick={generateFinancials}>
                    Show me the numbers →
                  </button>
              }
            </div>
          </>
        )}

        {/* ── STEP 2: FINANCIALS ── */}
        {step === 2 && financials && (
          <>
            <h1 className="assess-heading">The financial<br /><em>picture.</em></h1>
            <p className="assess-sub">Realistic projections based on your numbers. Not optimistic, not pessimistic.</p>

            <div className="fin-result-grid">
              {[
                { label: 'Year 1 Revenue',  value: financials.year1Revenue,   note: 'projected' },
                { label: 'Year 3 Revenue',  value: financials.year3Revenue,   note: 'projected' },
                { label: 'Break-even',      value: financials.breakEvenMonth, note: 'expected' },
                { label: 'Startup Capital', value: financials.startupCapital, note: 'needed' },
                { label: 'Year 1 Profit',   value: financials.year1Profit,    note: 'net' },
                { label: 'Year 3 Profit',   value: financials.year3Profit,    note: 'net' },
              ].map(f => (
                <div className="fin-card" key={f.label}>
                  <div className="fin-card-label">{f.label}</div>
                  <div className="fin-card-value">{f.value}</div>
                  <div className="fin-card-note">{f.note}</div>
                </div>
              ))}
            </div>

            <div className="fin-truth">
              <div className="fin-truth-label">The financial truth</div>
              <div className="fin-truth-text">"{financials.financialTruth}"</div>
            </div>

            <div className="assess-actions">
              <button className="btn-assess-back" onClick={() => setStep(1.5)}>← Back</button>
              {loading
                ? <LoadingState label="Assembling your advisory board..." sub="5 advisors reviewing your idea" />
                : <button className="btn-assess-primary" onClick={generateAdvisors}>
                    Meet your advisors →
                  </button>
              }
            </div>
          </>
        )}

        {/* ── STEP 3: ADVISORS ── */}
        {step === 3 && advisors && (
          <>
            <h1 className="assess-heading">Your advisory<br /><em>board.</em></h1>
            <p className="assess-sub">Five perspectives. Click each advisor to read their full take. The board's verdict: <strong>{advisors.boardVerdict}</strong>.</p>

            {advisors.advisors.map(a => (
              <div className="advisor-response-card" key={a.name}>
                <div className="advisor-response-header" onClick={() => setOpenAdvisor(openAdvisor === a.name ? null : a.name)}>
                  <div className="advisor-badge" style={{ background: ADVISOR_COLORS[a.name] }}>{a.name[0]}</div>
                  <div>
                    <div className="advisor-response-name">{a.name}</div>
                    <div className="advisor-response-role">{ADVISOR_ROLES[a.name]}</div>
                  </div>
                  <div className={`advisor-stance stance-${a.stance.toLowerCase()}`}>{a.stance}</div>
                  <div className={`advisor-toggle ${openAdvisor === a.name ? 'open' : ''}`}>▾</div>
                </div>
                <div className={`advisor-response-body ${openAdvisor === a.name ? 'open' : ''}`}>
                  <div className="advisor-response-section">
                    <div className="advisor-response-section-label">Excited about</div>
                    <div className="advisor-response-section-text">{a.excitedAbout}</div>
                  </div>
                  <div className="advisor-response-section">
                    <div className="advisor-response-section-label">Concerned about</div>
                    <div className="advisor-response-section-text">{a.concernedAbout}</div>
                  </div>
                  <div className="advisor-response-section">
                    <div className="advisor-response-section-label">Advice</div>
                    <div className="advisor-response-section-text">{a.advice}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="assess-actions">
              <button className="btn-assess-back" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-assess-primary" onClick={() => setStep(3.5)}>
                Assess my fit →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3.5: FIT INPUTS ── */}
        {step === 3.5 && (
          <>
            <h1 className="assess-heading">Are you the right<br /><em>person for this?</em></h1>
            <p className="assess-sub">Five honest questions about you — not the idea. Sela's founder fit assessment is the most direct thing she'll tell you.</p>
            {[
              { key: 'background',  label: 'Your relevant background and experience *',    placeholder: 'What have you done that relates to this business?' },
              { key: 'time',        label: 'Time you can commit *',                         placeholder: 'Full-time, part-time, evenings only? How many hours/week?' },
              { key: 'capital',     label: 'Capital you can personally commit *',           placeholder: 'How much of your own money are you willing to put in?' },
              { key: 'motivation',  label: 'Why this idea, why now? *',                     placeholder: 'What is driving you toward this specific idea?' },
              { key: 'weakness',    label: 'Your biggest weakness as a founder *',          placeholder: 'Be honest — what do you know you\'re not good at?' },
            ].map(f => (
              <div className="field" key={f.key}>
                <label>{f.label}</label>
                <textarea rows={2} value={fitInputs[f.key]} onChange={e => setFitInputs(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} />
              </div>
            ))}
            <div className="assess-actions">
              <button className="btn-assess-back" onClick={() => setStep(3)}>← Back</button>
              {loading
                ? <LoadingState label="Assessing founder fit..." sub="Mapping your strengths and gaps" />
                : <button className="btn-assess-primary"
                    disabled={Object.values(fitInputs).some(v => v.trim().length < 3)}
                    onClick={generateFit}>
                    Show my fit →
                  </button>
              }
            </div>
          </>
        )}

        {/* ── STEP 4: FIT RESULTS ── */}
        {step === 4 && fit && (
          <>
            <h1 className="assess-heading">Your founder<br /><em>fit.</em></h1>
            <p className="assess-sub">Honest assessment of whether you're the right person for this idea — right now.</p>

            <div className="fit-score-wrap">
              <div className="fit-score-num">{fit.fitScore}</div>
              <div>
                <div className="fit-score-label">Founder fit score / 10</div>
                <div className="fit-score-text">"{fit.fitSummary}"</div>
              </div>
            </div>

            <div className="fit-grid">
              <div className="fit-card">
                <div className="fit-card-label">Your strengths</div>
                <div className="fit-card-text">{fit.strengths}</div>
              </div>
              <div className="fit-card">
                <div className="fit-card-label">Your gaps</div>
                <div className="fit-card-text">{fit.gaps}</div>
              </div>
              <div className="fit-card" style={{ gridColumn: '1/-1' }}>
                <div className="fit-card-label">Help you'll need</div>
                <div className="fit-card-text">{fit.helpNeeded}</div>
              </div>
            </div>

            <div className="fit-question">
              <div className="fit-question-label">The question you need to answer</div>
              <div className="fit-question-text">"{fit.mostImportantQuestion}"</div>
            </div>

            <div className="assess-actions">
              <button className="btn-assess-back" onClick={() => setStep(3.5)}>← Back</button>
              {loading
                ? <LoadingState label="Building your verdict..." sub="Synthesizing everything Sela knows" />
                : <button className="btn-assess-primary" onClick={generateVerdict}>
                    Get my verdict →
                  </button>
              }
            </div>
          </>
        )}

        {/* ── STEP 5: VERDICT ── */}
        {step === 5 && verdict && (
          <>
            <h1 className="assess-heading">Sela's<br /><em>verdict.</em></h1>
            <p className="assess-sub">The honest answer — with reasoning, obstacles, and your next steps.</p>

            <div className={`verdict-banner ${verdictClass(verdict.verdict)}`}>
              <div className="verdict-word">{verdict.verdict}</div>
              <div className="verdict-reasoning">{verdict.reasoning}</div>
            </div>

            {verdict.adjustments && (
              <div className="fin-truth" style={{ marginBottom: 28 }}>
                <div className="fin-truth-label">{verdict.verdict === 'GO' ? 'What would make this stronger' : 'What needs to change'}</div>
                <div className="fin-truth-text">"{verdict.adjustments}"</div>
              </div>
            )}

            <div className="verdict-section">
              <div className="verdict-section-title">The three obstacles ahead</div>
              {verdict.obstacles.map((o, i) => (
                <div className="obstacle-item" key={i}>
                  <div className="obstacle-num">Obstacle {i + 1}</div>
                  <div className="obstacle-text">{o.obstacle}</div>
                  <div className="obstacle-mitigation">↳ {o.mitigation}</div>
                </div>
              ))}
            </div>

            <div className="verdict-section">
              <div className="verdict-section-title">Your next steps</div>
              {verdict.nextSteps.map((s, i) => (
                <div className="next-step-item" key={i}>
                  <div className="next-step-num">{i + 1}</div>
                  <div className="next-step-text">{s}</div>
                </div>
              ))}
            </div>

            <button className="restart-btn" onClick={reset}>← Assess another idea</button>
          </>
        )}

      </div>
    </div>
  )
}

function LoadingState({ label, sub }) {
  return (
    <div className="loading-wrap" style={{ padding: '40px 0', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="spinner" style={{ margin: 0 }} />
        <div>
          <div className="loading-label">{label}</div>
          <div className="loading-sub">{sub}</div>
        </div>
      </div>
    </div>
  )
}
