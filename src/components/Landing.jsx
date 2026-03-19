import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getTokenBalance } from '../lib/tokens'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  .landing-wrap { background: #1C0F2E; font-family: 'DM Sans', sans-serif; min-height: 100vh; position: relative; overflow-x: hidden; }

  /* STARS */
  .landing-stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

  /* NAV */
  .landing-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; border-bottom: 1px solid rgba(212,165,90,0.15); position: relative; z-index: 10; }
  .landing-logo { display: flex; align-items: baseline; gap: 4px; cursor: pointer; text-decoration: none; }
  .landing-logo-ask { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(212,165,90,0.6); }
  .landing-logo-sela { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-style: italic; color: #F5E6C8; line-height: 1; }
  .landing-nav-btn { background: none; border: 1px solid rgba(212,165,90,0.4); color: #D4A55A; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 9px 20px; cursor: pointer; border-radius: 2px; transition: all 0.2s; }
  .landing-nav-btn:hover { background: rgba(212,165,90,0.08); border-color: #D4A55A; }

  /* HERO */
  .landing-hero { display: flex; align-items: center; justify-content: space-between; max-width: 1100px; margin: 0 auto; padding: 40px 48px 20px; position: relative; z-index: 10; gap: 24px; }
  .landing-hero-left { flex: 1; max-width: 500px; }
  .landing-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: #D4A55A; margin-bottom: 20px; }
  .landing-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(38px, 4.5vw, 60px); font-weight: 300; line-height: 1.1; color: #F5E6C8; margin-bottom: 6px; }
  .landing-headline em { font-style: italic; color: #D4A55A; }
  .landing-headline-2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 3.2vw, 46px); font-weight: 300; font-style: italic; color: rgba(245,230,200,0.3); margin-bottom: 28px; line-height: 1.2; }
  .landing-sub { font-size: 15px; font-weight: 300; color: rgba(245,230,200,0.55); line-height: 1.85; margin-bottom: 36px; max-width: 420px; }
  .landing-cta-primary { background: #D4A55A; color: #1C0F2E; border: none; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 16px 40px; cursor: pointer; border-radius: 2px; display: inline-block; margin-bottom: 14px; transition: all 0.2s; }
  .landing-cta-primary:hover { background: #E8C07A; transform: translateY(-1px); }
  .landing-cta-hint { font-size: 12px; color: rgba(245,230,200,0.28); letter-spacing: 0.04em; display: block; }

  /* SELA CHARACTER */
  .landing-sela { flex-shrink: 0; width: 320px; }
  @keyframes sela-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes sela-blink { 0%,90%,100%{transform:scaleY(1)} 94%{transform:scaleY(0.05)} }
  @keyframes sela-sparkle { 0%,100%{opacity:0} 50%{opacity:1} }
  .sela-float { animation: sela-float 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .sela-blink-l { animation: sela-blink 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  .sela-blink-r { animation: sela-blink 4s ease-in-out infinite 0.1s; transform-box: fill-box; transform-origin: center; }
  .sela-sp1 { animation: sela-sparkle 2.2s ease-in-out infinite; }
  .sela-sp2 { animation: sela-sparkle 2.2s ease-in-out infinite 0.7s; }
  .sela-sp3 { animation: sela-sparkle 2.2s ease-in-out infinite 1.4s; }

  /* FEATURES */
  .landing-features { display: flex; gap: 12px; max-width: 1100px; margin: 0 auto; padding: 20px 48px 48px; position: relative; z-index: 10; }
  .landing-feat { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(212,165,90,0.15); border-radius: 4px; padding: 24px 20px; transition: border-color 0.2s; }
  .landing-feat:hover { border-color: rgba(212,165,90,0.35); }
  .landing-feat-num { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: rgba(212,165,90,0.5); margin-bottom: 10px; letter-spacing: 0.1em; font-style: italic; }
  .landing-feat-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #F5E6C8; margin-bottom: 8px; font-weight: 500; }
  .landing-feat-text { font-size: 13px; font-weight: 300; color: rgba(245,230,200,0.45); line-height: 1.75; }

  /* DIVIDER */
  .landing-divider { width: 60px; height: 1px; background: rgba(212,165,90,0.25); margin: 0 auto 40px; }

  /* ADVISORS */
  .landing-advisors { max-width: 1100px; margin: 0 auto; padding: 0 48px 80px; position: relative; z-index: 10; }
  .landing-advisors-label { font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(212,165,90,0.4); text-align: center; margin-bottom: 20px; }
  .landing-adv-row { display: flex; gap: 10px; }
  .landing-adv { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(212,165,90,0.12); border-radius: 4px; padding: 20px 12px; text-align: center; transition: border-color 0.2s; }
  .landing-adv:hover { border-color: rgba(212,165,90,0.3); }
  .landing-adv-glyph { font-size: 22px; color: #D4A55A; margin-bottom: 8px; line-height: 1; }
  .landing-adv-name { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 500; color: #F5E6C8; margin-bottom: 2px; }
  .landing-adv-role { font-size: 11px; color: rgba(245,230,200,0.35); margin-bottom: 10px; }
  .landing-adv-badge { display: inline-block; font-size: 9px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(212,165,90,0.55); border: 1px solid rgba(212,165,90,0.2); padding: 3px 8px; border-radius: 2px; }

  /* FOOTER */
  .landing-footer { border-top: 1px solid rgba(212,165,90,0.1); padding: 24px 48px; text-align: center; position: relative; z-index: 10; }
  .landing-footer-text { font-size: 12px; color: rgba(245,230,200,0.2); letter-spacing: 0.05em; }

  /* RESPONSIVE */
  .landing-category { font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(212,165,90,0.5); margin-bottom: 10px; display: block; }

  @media (max-width: 768px) {
    .landing-nav { padding: 16px 24px; }
    .landing-hero { flex-direction: column; padding: 24px 24px 0; gap: 0; }
    .landing-hero-left { max-width: 100%; }
    .landing-sela { width: 180px; margin: 0 auto; }
    .landing-features { flex-direction: column; padding: 16px 24px 40px; }
    .landing-adv-row { flex-wrap: wrap; }
    .landing-adv { min-width: calc(50% - 5px); }
    .landing-advisors { padding: 0 24px 60px; }
    .landing-footer { padding: 20px 24px; }
  }
`

export default function Landing() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getTokenBalance(session.user.id).then(bal => setTokenBalance(bal))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getTokenBalance(session.user.id).then(bal => setTokenBalance(bal))
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = styles
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  return (
    <div className="landing-wrap">

      {/* Stars background */}
      <svg className="landing-stars" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
        <circle cx="80"   cy="60"  r="1"   fill="#D4A55A" opacity="0.5"/>
        <circle cx="280"  cy="35"  r="1.5" fill="#F5E6C8" opacity="0.35"/>
        <circle cx="520"  cy="80"  r="1"   fill="#D4A55A" opacity="0.45"/>
        <circle cx="780"  cy="45"  r="1"   fill="#F5E6C8" opacity="0.5"/>
        <circle cx="1020" cy="70"  r="1.5" fill="#D4A55A" opacity="0.3"/>
        <circle cx="150"  cy="160" r="1"   fill="#F5E6C8" opacity="0.4"/>
        <circle cx="420"  cy="140" r="1.5" fill="#D4A55A" opacity="0.4"/>
        <circle cx="660"  cy="120" r="1"   fill="#F5E6C8" opacity="0.3"/>
        <circle cx="900"  cy="130" r="1"   fill="#D4A55A" opacity="0.5"/>
        <circle cx="1100" cy="180" r="1"   fill="#F5E6C8" opacity="0.35"/>
        <circle cx="60"   cy="300" r="1"   fill="#D4A55A" opacity="0.3"/>
        <circle cx="1150" cy="320" r="1.5" fill="#F5E6C8" opacity="0.4"/>
        <circle cx="350"  cy="500" r="1"   fill="#D4A55A" opacity="0.25"/>
        <circle cx="750"  cy="460" r="1"   fill="#F5E6C8" opacity="0.2"/>
        <circle cx="950"  cy="480" r="1"   fill="#F5E6C8" opacity="0.3"/>
        <circle cx="200"  cy="600" r="1"   fill="#D4A55A" opacity="0.2"/>
        <circle cx="1050" cy="580" r="1"   fill="#F5E6C8" opacity="0.25"/>
      </svg>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo" onClick={() => navigate('/')}>
          <span className="landing-logo-ask">Ask </span>
          <span className="landing-logo-sela">Sela</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(p => !p)}
                  style={{
                    background: 'rgba(212,165,90,0.1)',
                    border: '1px solid rgba(212,165,90,0.3)',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    color: '#D4A55A',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                  🪙 {tokenBalance ?? '—'} tokens ▾
                </button>
                {showUserMenu && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0,
                    background: '#2A1545',
                    border: '1px solid rgba(212,165,90,0.25)',
                    borderRadius: '8px',
                    padding: '8px',
                    minWidth: '160px',
                    zIndex: 200,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: 'rgba(245,230,200,0.45)',
                      borderBottom: '1px solid rgba(212,165,90,0.15)',
                      marginBottom: '4px'
                    }}>
                      {tokenBalance ?? 0} tokens remaining
                    </div>
                    <button
                      onClick={() => { supabase.auth.signOut(); setShowUserMenu(false) }}
                      style={{
                        width: '100%', textAlign: 'left',
                        background: 'none', border: 'none',
                        padding: '8px 12px',
                        color: '#F5E6C8', fontSize: '13px',
                        cursor: 'pointer', borderRadius: '4px'
                      }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="landing-nav-btn" onClick={() => supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.href }
            })}>
              Sign in →
            </button>
          )}
          <button className="landing-nav-btn" onClick={() => navigate('/assess')}>
            Begin your reading →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="landing-hero">
        <div className="landing-hero-left">
          <span className="landing-category">AI business advisor</span>
          <div className="landing-eyebrow">Your idea. Her verdict.</div>
          <h1 className="landing-headline">
            She already knows<br /><em>what you don't.</em>
          </h1>
          <div className="landing-headline-2">Will it work?</div>
          <p className="landing-sub">
            Sela is an AI advisor trained to get your idea right — before you spend a dollar on it. Playful about the process. Ruthless about the truth.
          </p>
          <button className="landing-cta-primary" onClick={() => navigate('/assess')}>
            Ask Sela about your idea →
          </button>
          <span className="landing-cta-hint">First reading is free. No credit card.</span>
        </div>

        {/* Sela character */}
        <div className="landing-sela">
          <svg width="100%" viewBox="0 0 320 460">
            <g className="sela-float">
              {/* Robe */}
              <path d="M100 300 Q80 320 75 380 Q80 420 160 425 Q240 420 245 380 Q240 320 220 300 Q200 290 160 288 Q120 290 100 300Z" fill="#C4622D" stroke="#1A0A30" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M140 310 Q135 360 138 420" fill="none" stroke="#A04820" strokeWidth="2" strokeLinecap="round"/>
              <path d="M180 310 Q185 360 182 420" fill="none" stroke="#A04820" strokeWidth="2" strokeLinecap="round"/>
              <path d="M135 300 Q160 308 185 300" fill="none" stroke="#1A0A30" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Sleeves */}
              <path d="M100 300 Q60 310 45 350 Q50 370 70 360 Q90 330 110 320Z" fill="#C4622D" stroke="#1A0A30" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M220 300 Q260 310 275 350 Q270 370 250 360 Q230 330 210 320Z" fill="#C4622D" stroke="#1A0A30" strokeWidth="3" strokeLinejoin="round"/>
              {/* Sleeve dots */}
              <circle cx="72"  cy="338" r="4" fill="#D4A55A" stroke="#1A0A30" strokeWidth="1.5"/>
              <circle cx="84"  cy="326" r="3" fill="#F5E6C8" stroke="#1A0A30" strokeWidth="1.5"/>
              <circle cx="248" cy="338" r="4" fill="#D4A55A" stroke="#1A0A30" strokeWidth="1.5"/>
              <circle cx="236" cy="326" r="3" fill="#F5E6C8" stroke="#1A0A30" strokeWidth="1.5"/>
              {/* Peace sign */}
              <circle cx="160" cy="358" r="20" fill="none" stroke="#D4A55A" strokeWidth="2.5"/>
              <line x1="160" y1="338" x2="160" y2="378" stroke="#D4A55A" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="160" y1="358" x2="146" y2="372" stroke="#D4A55A" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="160" y1="358" x2="174" y2="372" stroke="#D4A55A" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Neck */}
              <rect x="148" y="272" width="24" height="30" rx="12" fill="#E8C8A0" stroke="#1A0A30" strokeWidth="2.5"/>
              {/* Head */}
              <ellipse cx="160" cy="230" rx="58" ry="62" fill="#E8C8A0" stroke="#1A0A30" strokeWidth="3.5"/>
              {/* Hair */}
              <path d="M102 210 Q88 240 90 290 Q98 310 108 300 Q104 265 108 230Z" fill="#3D2010" stroke="#1A0A30" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M218 210 Q232 240 230 290 Q222 310 212 300 Q216 265 212 230Z" fill="#3D2010" stroke="#1A0A30" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M102 190 Q95 170 105 155 Q120 140 160 138 Q200 140 215 155 Q225 170 218 190" fill="#3D2010" stroke="#1A0A30" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M118 165 Q112 155 116 148" fill="none" stroke="#3D2010" strokeWidth="2" strokeLinecap="round"/>
              <path d="M202 165 Q208 155 204 148" fill="none" stroke="#3D2010" strokeWidth="2" strokeLinecap="round"/>
              {/* Flower */}
              <ellipse cx="108" cy="175" rx="5" ry="7" fill="#E87B5A" stroke="#1A0A30" strokeWidth="2"/>
              <ellipse cx="118" cy="185" rx="7" ry="5" fill="#E87B5A" stroke="#1A0A30" strokeWidth="2"/>
              <ellipse cx="108" cy="195" rx="5" ry="7" fill="#E87B5A" stroke="#1A0A30" strokeWidth="2"/>
              <ellipse cx="98"  cy="185" rx="7" ry="5" fill="#E87B5A" stroke="#1A0A30" strokeWidth="2"/>
              <circle cx="108" cy="185" r="5" fill="#FADA5E" stroke="#1A0A30" strokeWidth="1.5"/>
              {/* Glasses */}
              <circle cx="142" cy="230" r="18" fill="rgba(100,180,255,0.12)" stroke="#1A0A30" strokeWidth="2.5"/>
              <circle cx="178" cy="230" r="18" fill="rgba(100,180,255,0.12)" stroke="#1A0A30" strokeWidth="2.5"/>
              <path d="M160 228 L160 232" stroke="#1A0A30" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M124 228 Q118 224 112 228" fill="none" stroke="#1A0A30" strokeWidth="2" strokeLinecap="round"/>
              <path d="M196 228 Q202 224 208 228" fill="none" stroke="#1A0A30" strokeWidth="2" strokeLinecap="round"/>
              {/* Eyes */}
              <ellipse cx="142" cy="230" rx="10" ry="7" fill="#3D2010" className="sela-blink-l"/>
              <circle  cx="146" cy="228" r="2.5"          fill="white"   className="sela-blink-l"/>
              <ellipse cx="178" cy="230" rx="10" ry="7" fill="#3D2010" className="sela-blink-r"/>
              <circle  cx="182" cy="228" r="2.5"          fill="white"   className="sela-blink-r"/>
              {/* Eyebrows */}
              <path d="M128 214 Q142 208 156 213" fill="none" stroke="#3D2010" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M164 213 Q178 208 192 214" fill="none" stroke="#3D2010" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Nose */}
              <path d="M157 242 Q160 248 163 242" fill="none" stroke="#C8A080" strokeWidth="2" strokeLinecap="round"/>
              {/* Smile */}
              <path d="M145 258 Q160 268 175 258" fill="none" stroke="#1A0A30" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Blush */}
              <ellipse cx="120" cy="248" rx="12" ry="7" fill="#E87B5A" opacity="0.3"/>
              <ellipse cx="200" cy="248" rx="12" ry="7" fill="#E87B5A" opacity="0.3"/>
              {/* Headband */}
              <path d="M103 200 Q115 188 160 185 Q205 188 217 200" fill="none" stroke="#D4A55A" strokeWidth="5" strokeLinecap="round"/>
              <circle cx="160" cy="184" r="6" fill="#D4A55A" stroke="#1A0A30" strokeWidth="2"/>
              {/* Orb */}
              <circle cx="160" cy="430" r="30" fill="#6B3FA0" stroke="#1A0A30" strokeWidth="3"/>
              <circle cx="160" cy="430" r="30" fill="none" stroke="#D4A55A" strokeWidth="1.5" strokeDasharray="5 4"/>
              <circle cx="150" cy="421" r="9"  fill="#9B6FD4" opacity="0.6"/>
              <text x="160" y="436" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fill="#F5E6C8">✦</text>
            </g>
            {/* Sparkles */}
            <g className="sela-sp1"><text x="40"  y="140" fontSize="14" fill="#D4A55A" textAnchor="middle">✦</text></g>
            <g className="sela-sp2"><text x="295" y="180" fontSize="11" fill="#E87B5A" textAnchor="middle">✦</text></g>
            <g className="sela-sp3"><text x="310" y="100" fontSize="9"  fill="#F5E6C8" textAnchor="middle">✦</text></g>
            <g className="sela-sp2"><text x="25"  y="280" fontSize="9"  fill="#D4A55A" textAnchor="middle">✦</text></g>
            <g className="sela-sp1"><text x="300" y="360" fontSize="8"  fill="#E87B5A" textAnchor="middle">✦</text></g>
          </svg>
        </div>
      </div>

      {/* Feature cards */}
      <div className="landing-features">
        <div className="landing-feat">
          <div className="landing-feat-num">I</div>
          <div className="landing-feat-title">The Idea Reading</div>
          <div className="landing-feat-text">8 dimensions scored. Market, timing, capital, fit. No filter, no flattery.</div>
        </div>
        <div className="landing-feat">
          <div className="landing-feat-num">II</div>
          <div className="landing-feat-title">The Council</div>
          <div className="landing-feat-text">Five AI advisors — financial, operational, brand, skeptic, coach. Ask them anything.</div>
        </div>
        <div className="landing-feat">
          <div className="landing-feat-num">III</div>
          <div className="landing-feat-title">The Verdict</div>
          <div className="landing-feat-text">Go. Adjust. Pause. The only three answers that matter — with exactly what to do next.</div>
        </div>
      </div>

      <div className="landing-divider" />

      {/* Advisors */}
      <div className="landing-advisors">
        <div className="landing-advisors-label">The Council — five AI advisors, each trained on a distinct perspective</div>
        <div className="landing-adv-row">
          {[
            { glyph: '♄', name: 'Maya',   role: 'Financial',        badge: 'AI · Numbers'   },
            { glyph: '♂', name: 'Rex',    role: 'Operations',       badge: 'AI · Execution' },
            { glyph: '♀', name: 'Stella', role: 'Brand & Market',   badge: 'AI · Market'    },
            { glyph: '☿', name: 'Dario',  role: "Devil's Advocate", badge: 'AI · Skeptic'   },
            { glyph: '☽', name: 'Jordan', role: "Founder's Coach",  badge: 'AI · Coach'     },
          ].map(a => (
            <div className="landing-adv" key={a.name}>
              <div className="landing-adv-glyph">{a.glyph}</div>
              <div className="landing-adv-name">{a.name}</div>
              <div className="landing-adv-role">{a.role}</div>
              <div className="landing-adv-badge">{a.badge}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="landing-footer-text">Ask Sela · Honest advice before you commit.</span>
      </footer>

    </div>
  )
}
