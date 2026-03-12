import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const styles = `
  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: rgba(247,242,234,0.92);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s;
  }
  .nav.scrolled { border-bottom-color: var(--border); }
  .nav-logo { display: flex; align-items: baseline; gap: 4px; text-decoration: none; cursor: pointer; }
  .nav-logo-ask { font-family: var(--font-body); font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .nav-logo-sela { font-family: var(--font-display); font-size: 26px; font-weight: 500; font-style: italic; color: var(--ink); line-height: 1; }
  .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
  .nav-links a { font-size: 13px; font-weight: 400; letter-spacing: 0.04em; color: var(--ink-soft); text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: var(--clay); }
  .nav-cta { background: var(--ink) !important; color: var(--paper) !important; padding: 10px 22px; border-radius: 2px; font-size: 12px !important; font-weight: 500 !important; letter-spacing: 0.08em; text-transform: uppercase; transition: background 0.2s !important; cursor: pointer; border: none; }
  .nav-cta:hover { background: var(--clay) !important; }

  /* HERO */
  .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding-top: 80px; }
  .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 80px 64px 80px 80px; }
  .hero-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--clay); margin-bottom: 28px; opacity: 0; animation: fadeUp 0.7s ease 0.1s forwards; }
  .hero-headline { font-family: var(--font-display); font-size: clamp(52px,6vw,80px); font-weight: 300; line-height: 1.05; letter-spacing: -0.01em; color: var(--ink); margin-bottom: 32px; opacity: 0; animation: fadeUp 0.8s ease 0.2s forwards; }
  .hero-headline em { font-style: italic; color: var(--clay); }
  .hero-sub { font-size: 16px; font-weight: 300; line-height: 1.75; color: var(--ink-soft); max-width: 420px; margin-bottom: 48px; opacity: 0; animation: fadeUp 0.8s ease 0.35s forwards; }
  .hero-actions { display: flex; align-items: center; gap: 24px; opacity: 0; animation: fadeUp 0.8s ease 0.5s forwards; }
  .btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--ink); color: var(--paper); text-decoration: none; padding: 16px 32px; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 2px; transition: background 0.2s, transform 0.2s; border: none; cursor: pointer; font-family: var(--font-body); }
  .btn-primary:hover { background: var(--clay); transform: translateY(-1px); }
  .btn-arrow { transition: transform 0.2s; display: inline-block; }
  .btn-primary:hover .btn-arrow { transform: translateX(4px); }
  .btn-link { font-size: 13px; font-weight: 400; color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--border); padding-bottom: 2px; transition: color 0.2s, border-color 0.2s; background: none; cursor: pointer; font-family: var(--font-body); }
  .btn-link:hover { color: var(--ink); border-color: var(--ink); }

  /* HERO RIGHT CARD */
  .hero-right { display: flex; align-items: center; justify-content: center; padding: 80px 80px 80px 40px; opacity: 0; animation: fadeIn 1s ease 0.6s forwards; }
  .hero-card { background: white; border: 1px solid var(--border); border-radius: 4px; padding: 36px; width: 100%; max-width: 380px; box-shadow: 0 8px 40px rgba(26,22,18,0.08), 0 2px 8px rgba(26,22,18,0.04); position: relative; }
  .hero-card::before { content: 'Idea Assessment'; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 20px; }
  .card-title { font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--ink); margin-bottom: 6px; }
  .card-category { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
  .score-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .score-label { font-size: 12px; color: var(--ink-soft); width: 130px; flex-shrink: 0; }
  .score-bar-wrap { flex: 1; height: 4px; background: var(--paper-deep); border-radius: 2px; overflow: hidden; }
  .score-bar { height: 100%; border-radius: 2px; }
  .score-num { font-size: 12px; font-weight: 500; color: var(--ink); width: 28px; text-align: right; }
  .card-verdict { margin-top: 24px; padding: 16px; background: var(--paper); border-radius: 2px; border-left: 3px solid var(--sage); }
  .card-verdict-label { font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--sage); margin-bottom: 6px; }
  .card-verdict-text { font-family: var(--font-display); font-size: 16px; font-style: italic; color: var(--ink-soft); line-height: 1.5; }
  .hero-note { position: absolute; bottom: -20px; right: -24px; background: var(--paper-deep); border: 1px solid var(--border); border-radius: 2px; padding: 14px 18px; font-size: 12px; color: var(--ink-soft); width: 200px; box-shadow: 0 4px 16px rgba(26,22,18,0.08); }
  .hero-note strong { display: block; font-family: var(--font-display); font-size: 16px; font-weight: 500; color: var(--clay); margin-bottom: 4px; }

  /* TRUTH BAR */
  .truth-bar { background: var(--ink); color: var(--paper); padding: 28px 80px; display: flex; align-items: center; justify-content: space-between; gap: 40px; }
  .truth-stat { text-align: center; flex: 1; }
  .truth-stat-num { font-family: var(--font-display); font-size: 48px; font-weight: 300; color: var(--clay); line-height: 1; display: block; }
  .truth-stat-label { font-size: 12px; font-weight: 300; color: rgba(247,242,234,0.6); margin-top: 8px; letter-spacing: 0.05em; }
  .truth-divider { width: 1px; height: 60px; background: rgba(247,242,234,0.15); }

  /* SECTIONS */
  .section { padding: 100px 80px; }
  .section-label { font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--clay); margin-bottom: 16px; }
  .section-heading { font-family: var(--font-display); font-size: clamp(36px,4vw,52px); font-weight: 300; line-height: 1.15; color: var(--ink); margin-bottom: 20px; }
  .section-heading em { font-style: italic; color: var(--clay); }
  .section-sub { font-size: 15px; font-weight: 300; line-height: 1.75; color: var(--ink-soft); max-width: 560px; margin-bottom: 64px; }
  .section-divider { display: flex; align-items: center; gap: 24px; padding: 0 80px; margin: 24px 0; }
  .section-divider::before, .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .section-divider span { font-family: var(--font-display); font-size: 15px; font-style: italic; color: var(--muted); white-space: nowrap; }

  /* STEPS */
  .steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
  .step { background: var(--paper); padding: 40px 36px; transition: background 0.2s; }
  .step:hover { background: white; }
  .step-num { font-family: var(--font-display); font-size: 48px; font-weight: 300; color: var(--border); line-height: 1; display: block; margin-bottom: 20px; }
  .step-title { font-family: var(--font-display); font-size: 22px; font-weight: 500; color: var(--ink); margin-bottom: 12px; }
  .step-text { font-size: 14px; font-weight: 300; line-height: 1.7; color: var(--ink-soft); }
  .step-tag { display: inline-block; margin-top: 16px; font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--border); padding: 4px 10px; border-radius: 2px; }

  /* HONEST SECTION */
  .honest-section { background: var(--ink); padding: 100px 80px; color: var(--paper); }
  .honest-section .section-label { color: var(--clay); }
  .honest-section .section-heading { color: var(--paper); }
  .honest-section .section-sub { color: rgba(247,242,234,0.65); }
  .honest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .honest-card { background: rgba(255,255,255,0.04); padding: 40px; border: 1px solid rgba(255,255,255,0.08); transition: background 0.2s; }
  .honest-card:hover { background: rgba(255,255,255,0.07); }
  .honest-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 16px; }
  .honest-icon.go { background: rgba(92,122,98,0.3); color: var(--sage-light); }
  .honest-icon.caution { background: rgba(200,132,90,0.25); color: var(--clay-light); }
  .honest-icon.pause { background: rgba(247,242,234,0.1); color: rgba(247,242,234,0.5); }
  .honest-icon.stop { background: rgba(180,80,70,0.25); color: #D4796E; }
  .honest-card-title { font-family: var(--font-display); font-size: 22px; font-weight: 500; color: var(--paper); margin-bottom: 12px; }
  .honest-card-text { font-size: 14px; font-weight: 300; line-height: 1.75; color: rgba(247,242,234,0.6); }
  .honest-card-quote { margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.06); border-left: 2px solid var(--clay); font-family: var(--font-display); font-size: 17px; font-style: italic; color: rgba(247,242,234,0.8); line-height: 1.5; }

  /* ADVISORS */
  .advisors-section { padding: 100px 80px; background: var(--paper-deep); }
  .advisors-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 16px; margin-top: 48px; }
  .advisor-card { background: var(--paper); border: 1px solid var(--border); border-radius: 4px; padding: 28px 24px; text-align: center; transition: transform 0.2s, box-shadow 0.2s; }
  .advisor-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,22,18,0.08); }
  .advisor-initial { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 24px; font-weight: 400; color: var(--paper); margin: 0 auto 16px; }
  .advisor-name { font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--ink); margin-bottom: 4px; }
  .advisor-role { font-size: 11px; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .advisor-desc { font-size: 13px; font-weight: 300; line-height: 1.6; color: var(--ink-soft); }

  /* PULL QUOTE */
  .pull-quote-section { padding: 80px; display: flex; align-items: center; gap: 80px; }
  .pull-quote-line { width: 3px; background: var(--clay); height: 140px; flex-shrink: 0; }
  .pull-quote-text { font-family: var(--font-display); font-size: clamp(28px,3.5vw,44px); font-weight: 300; line-height: 1.3; color: var(--ink); font-style: italic; }
  .pull-quote-text strong { font-style: normal; font-weight: 500; color: var(--clay); }

  /* CTA SECTION */
  .cta-section { background: var(--paper-deep); border-top: 1px solid var(--border); padding: 100px 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .cta-heading { font-family: var(--font-display); font-size: clamp(40px,4.5vw,60px); font-weight: 300; line-height: 1.1; color: var(--ink); margin-bottom: 24px; }
  .cta-heading em { font-style: italic; color: var(--clay); }
  .cta-text { font-size: 15px; font-weight: 300; line-height: 1.75; color: var(--ink-soft); margin-bottom: 40px; }
  .cta-right { padding-left: 40px; border-left: 1px solid var(--border); }
  .free-tag { display: inline-block; background: var(--sage); color: var(--paper); font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; padding: 6px 14px; border-radius: 2px; margin-bottom: 24px; }
  .free-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .free-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; font-weight: 300; color: var(--ink-soft); line-height: 1.5; }
  .free-list li::before { content: '→'; color: var(--clay); flex-shrink: 0; margin-top: 1px; }

  /* FOOTER */
  footer { background: var(--ink); color: rgba(247,242,234,0.5); padding: 48px 80px; display: flex; align-items: center; justify-content: space-between; }
  .footer-logo { display: flex; align-items: baseline; gap: 4px; }
  .footer-logo-ask { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(247,242,234,0.35); }
  .footer-logo-sela { font-family: var(--font-display); font-size: 22px; font-weight: 400; font-style: italic; color: rgba(247,242,234,0.7); }
  .footer-tagline { font-family: var(--font-display); font-size: 16px; font-style: italic; color: rgba(247,242,234,0.4); }
  .footer-links { display: flex; gap: 28px; list-style: none; }
  .footer-links a { font-size: 12px; color: rgba(247,242,234,0.4); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--clay); }

  /* REVEAL */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 900px) {
    .nav { padding: 16px 24px; }
    .nav-links { display: none; }
    .hero { grid-template-columns: 1fr; }
    .hero-right { display: none; }
    .hero-left { padding: 60px 24px; }
    .section { padding: 64px 24px; }
    .truth-bar { padding: 40px 24px; flex-wrap: wrap; gap: 24px; }
    .truth-divider { display: none; }
    .steps { grid-template-columns: 1fr; }
    .honest-section { padding: 64px 24px; }
    .honest-grid { grid-template-columns: 1fr; }
    .advisors-section { padding: 64px 24px; }
    .advisors-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .pull-quote-section { padding: 64px 24px; gap: 28px; }
    .cta-section { grid-template-columns: 1fr; padding: 64px 24px; gap: 48px; }
    .cta-right { padding-left: 0; border-left: none; border-top: 1px solid var(--border); padding-top: 40px; }
    footer { padding: 40px 24px; flex-direction: column; gap: 20px; text-align: center; }
    .section-divider { padding: 0 24px; }
  }
`

export default function Landing() {
  const navRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.textContent = styles
    document.head.appendChild(styleEl)
    return () => document.head.removeChild(styleEl)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), 80)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    reveals.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const goAssess = () => navigate('/assess')

  return (
    <>
      {/* NAV */}
      <nav ref={navRef} className="nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <span className="nav-logo-ask">Ask</span>
          <span className="nav-logo-sela">Sela</span>
        </div>
        <ul className="nav-links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#advisors">The board</a></li>
          <li><button className="nav-cta" onClick={goAssess}>Try free</button></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow">Honest advice before you commit</p>
          <h1 className="hero-headline">
            Make the right decision.<br />
            Not just the one <em>you want.</em>
          </h1>
          <p className="hero-sub">
            Sela is an AI advisor built for founders at the idea stage. She scores your idea honestly, stress-tests the finances, and tells you what five experienced advisors would actually say — before you spend a dollar.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={goAssess}>
              Assess my idea <span className="btn-arrow">→</span>
            </button>
            <a href="#how-it-works" className="btn-link">See how it works</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <div className="card-title">Premium Group Fitness Studio</div>
            <div className="card-category">Health &amp; Wellness · Santa Barbara, CA</div>
            {[
              { label: 'Market opportunity', val: 78, color: 'var(--sage)' },
              { label: 'Competitive edge',   val: 72, color: 'var(--sage)' },
              { label: 'Capital requirements',val: 55, color: 'var(--clay)' },
              { label: 'Founder-market fit', val: 85, color: 'var(--sage)' },
              { label: 'Time to revenue',    val: 60, color: 'var(--clay-light)' },
            ].map(s => (
              <div className="score-row" key={s.label}>
                <span className="score-label">{s.label}</span>
                <div className="score-bar-wrap">
                  <div className="score-bar" style={{ width: `${s.val}%`, background: s.color }} />
                </div>
                <span className="score-num">{(s.val/10).toFixed(1)}</span>
              </div>
            ))}
            <div className="card-verdict">
              <div className="card-verdict-label">Sela's read</div>
              <div className="card-verdict-text">"The positioning is real. The capital requirement is your biggest risk — not the idea itself."</div>
            </div>
            <div className="hero-note">
              <strong>67 / 72</strong>
              Overall viability score — proceed with eyes open.
            </div>
          </div>
        </div>
      </section>

      {/* TRUTH BAR */}
      <div className="truth-bar">
        {[
          { num: '90%',  label: 'of new businesses fail within 10 years' },
          { num: '$30K', label: 'average amount spent before validating an idea' },
          { num: '6 min',label: 'to get Sela\'s honest assessment' },
          { num: 'Free', label: 'no credit card, no commitment' },
        ].map((s, i) => (
          <>
            <div className="truth-stat" key={s.num}>
              <span className="truth-stat-num">{s.num}</span>
              <div className="truth-stat-label">{s.label}</div>
            </div>
            {i < 3 && <div className="truth-divider" key={`d${i}`} />}
          </>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <p className="section-label reveal">How it works</p>
        <h2 className="section-heading reveal">Six steps.<br />One honest answer.</h2>
        <p className="section-sub reveal">Sela doesn't tell you what you want to hear. She tells you what five experienced advisors would actually say — with the receipts to back it up.</p>
        <div className="steps reveal">
          {[
            { n:'01', title:'Describe your idea',         text:'Plain language. No pitch deck required. Tell Sela what you\'re building, who it\'s for, and why you\'re the one to do it.', tag:'2 minutes' },
            { n:'02', title:'Receive your scorecard',     text:'Eight dimensions. Honest scores. Your strongest point and your biggest risk — named plainly, not softened.', tag:'AI-scored' },
            { n:'03', title:'Financial reality check',    text:'Year 1 and Year 3 projections. Break-even month. Startup capital needed. The financial truth most advisors won\'t say out loud.', tag:'4 questions' },
            { n:'04', title:'The advisory board weighs in',text:'Five distinct advisors. Five perspectives. Financial, operational, brand, devil\'s advocate, founder\'s coach.', tag:'5 advisors' },
            { n:'05', title:'Founder fit assessment',     text:'Are you the right person for this idea right now? Sela maps your strengths, your gaps, and what kind of help you\'ll actually need.', tag:'Honest scoring' },
            { n:'06', title:'Your verdict',               text:'Go. Adjust. Or Pause. A clear verdict with reasoning, the top three obstacles ahead, and numbered next steps.', tag:'Clear decision' },
          ].map(s => (
            <div className="step" key={s.n}>
              <span className="step-num">{s.n}</span>
              <div className="step-title">{s.title}</div>
              <p className="step-text">{s.text}</p>
              <span className="step-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider reveal"><span>What Sela says when she means it</span></div>

      {/* HONEST SECTION */}
      <section className="honest-section">
        <p className="section-label reveal">Honest by design</p>
        <h2 className="section-heading reveal">She says what most people won't.</h2>
        <p className="section-sub reveal">Sela's value is equal whether she greenlights your idea or saves you from it. The goal is the right decision — not the positive one.</p>
        <div className="honest-grid reveal">
          {[
            { cls:'go',      icon:'✓', title:'When the answer is Go',              text:'Sela tells you why, names your strongest advantages, and maps what you\'ll need to execute well. No empty cheerleading. Just confidence that\'s earned.', quote:'"Your positioning is differentiated and your founder-market fit is strong. The market is real. Your biggest risk isn\'t the idea — it\'s pace."' },
            { cls:'caution', icon:'!', title:'When you need to adjust',             text:'Sela names what\'s strong enough to build on and what needs to change before you commit real money. Specific. Actionable. No vague "validate it first."', quote:'"The concept is viable. The revenue model needs work before launch — here\'s what to change and why it matters."' },
            { cls:'pause',   icon:'◷', title:'When you need more information',      text:'Sometimes the answer isn\'t no — it\'s "not yet, and here\'s what you need to find out." Sela tells you exactly what would change the verdict.', quote:'"Too many unknowns to assess confidently. Answer these three questions first — then come back."' },
            { cls:'stop',    icon:'✕', title:'When the answer is no',              text:'Rare, but real. If the fundamentals don\'t hold, Sela says so — with the reasoning. Saving you from a bad idea is as valuable as backing a good one.', quote:'"The unit economics don\'t work at any reasonable scale. This isn\'t a timing issue — it\'s structural."' },
          ].map(c => (
            <div className="honest-card" key={c.cls}>
              <div className={`honest-icon ${c.cls}`}>{c.icon}</div>
              <div className="honest-card-title">{c.title}</div>
              <p className="honest-card-text">{c.text}</p>
              <div className="honest-card-quote">{c.quote}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ADVISORS */}
      <section className="advisors-section" id="advisors">
        <p className="section-label reveal">The advisory board</p>
        <h2 className="section-heading reveal">Five perspectives.<br />One honest picture.</h2>
        <p className="section-sub reveal">Each advisor brings a different lens. Together they cover the angles most founders miss until it's too late.</p>
        <div className="advisors-grid reveal">
          {[
            { initial:'M', name:'Maya',   role:'Financial Advisor', color:'var(--sage)',    desc:'Finds the number behind the number. Catches optimistic assumptions before they become expensive mistakes.' },
            { initial:'R', name:'Rex',    role:'Operator',          color:'var(--clay)',    desc:'Has launched, scaled, and failed. Asks about the things that actually kill businesses — hiring, ops, supplier risk.' },
            { initial:'S', name:'Stella', role:'Brand & Market',    color:'#9B7DB6',        desc:'Sees how the market sees you. Cuts through founder blind spots about positioning, messaging, and differentiation.' },
            { initial:'D', name:'Dario',  role:"Devil's Advocate",  color:'#7A8FA6',        desc:"Argues the other side. Not to be negative — to find the assumptions you're not questioning." },
            { initial:'J', name:'Jordan', role:"Founder's Coach",   color:'#A0845C',        desc:'Focused on you, not the idea. Are you the right person for this? What will it cost you personally?' },
          ].map(a => (
            <div className="advisor-card" key={a.name}>
              <div className="advisor-initial" style={{ background: a.color }}>{a.initial}</div>
              <div className="advisor-name">{a.name}</div>
              <div className="advisor-role">{a.role}</div>
              <p className="advisor-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PULL QUOTE */}
      <div className="pull-quote-section reveal">
        <div className="pull-quote-line" />
        <p className="pull-quote-text">
          "Most advisors tell you what you want to hear. Most business tools validate your assumptions. Sela does <strong>neither</strong> — and that's the whole point."
        </p>
      </div>

      {/* CTA */}
      <section className="cta-section" id="start">
        <div>
          <h2 className="cta-heading reveal">Start with<br />your <em>real</em> idea.</h2>
          <p className="cta-text reveal">Get Sela's honest assessment in minutes. No pitch deck. No consultant fees. No cheerleading.</p>
          <button className="btn-primary reveal" onClick={goAssess} style={{ marginTop: 0 }}>
            Assess my idea <span className="btn-arrow">→</span>
          </button>
        </div>
        <div className="cta-right reveal">
          <span className="free-tag">Free to start</span>
          <ul className="free-list">
            {[
              'Full 6-step idea assessment — no limit',
              '8-dimension viability scorecard',
              'Year 1 & Year 3 financial projections',
              'All five advisor perspectives',
              'Founder fit analysis',
              'Clear Go / Adjust / Pause verdict',
            ].map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <span className="footer-logo-ask">Ask</span>
          <span className="footer-logo-sela">Sela</span>
        </div>
        <div className="footer-tagline">Honest advice before you commit.</div>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </footer>
    </>
  )
}
