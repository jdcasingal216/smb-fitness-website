'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: HTMLElement) => { destroy?: () => void };
    };
  }
}

const programs = [
  {
    name: 'Custom App Programs',
    pillar: 'Mind',
    image: '/assets/program-1.webp',
    copy: 'Structured workouts and guidance in a flexible format you can carry anywhere.',
  },
  {
    name: 'Private Coaching',
    pillar: 'Body',
    image: '/assets/program-2.webp',
    copy: 'Personal attention built around your goals, fitness level, and abilities.',
  },
  {
    name: 'Goal Setting & Tracking',
    pillar: 'Mind',
    image: '/assets/program-4.webp',
    copy: 'A clear route from where you are now to what you are working toward.',
  },
  {
    name: 'Nutrition Plans',
    pillar: 'Body',
    image: '/assets/program-3.webp',
    copy: 'Nutrition guidance designed to support the work you do in training.',
  },
  {
    name: 'Specialty Programs',
    pillar: 'Soul',
    image: '/assets/program-6.webp',
    copy: 'Focused programs for specific goals, seasons, and challenges.',
  },
];

const faqs = [
  {
    question: 'Is SMB Fitness a one-size-fits-all program?',
    answer:
      'No. SMB offers individual coaching, custom app programs, goal tracking, nutrition support, and specialty programs. Your consultation is where the right level of support becomes clear.',
  },
  {
    question: 'Can I train virtually?',
    answer:
      'Yes. Virtual training is one of the ways SMB gives clients flexibility to train with structure beyond the gym floor.',
  },
  {
    question: 'Do you help with nutrition?',
    answer:
      'Nutrition plans are part of the SMB service range. The team will help you understand what support fits your goals during your consultation.',
  },
  {
    question: 'What happens after I book a consultation?',
    answer:
      'The conversation starts with your goals, your current routine, and the kind of support you need. SMB can then outline the most relevant next step and confirm current availability.',
  },
  {
    question: 'How do I learn about membership options?',
    answer:
      'Membership guidance begins with a consultation so the recommendation can match the level of coaching and accountability you are looking for.',
  },
];

function mountSmbScroll(root: HTMLElement) {
  document.documentElement.classList.add('sc-ready');
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const acts = Array.from(root.querySelectorAll<HTMLElement>('[data-sc-act]')).map((element) => {
    const device = element.dataset.scAct || 'flow';
    const stage = element.querySelector<HTMLElement>('[data-sc-stage]');
    if (device !== 'flow') {
      element.classList.add('sc-act--pinned');
      element.style.height = `${Number(element.dataset.scSpan || 1.5) * 100}vh`;
      stage?.classList.add('sc-stage');
    }
    return {
      element,
      device,
      stage,
      rail: element.querySelector<HTMLElement>('[data-sc-pan]'),
      canvas: element.querySelector<HTMLCanvasElement>('canvas[data-sc-sequence]'),
      cues: Array.from(element.querySelectorAll<HTMLElement>('[data-sc-cue]')),
    };
  });

  const hero = acts.find((act) => act.canvas);
  const sequence = hero?.canvas;
  const frames: HTMLImageElement[] = [];
  let currentFrame = -1;
  if (sequence) {
    for (let index = 1; index <= 180; index += 1) {
      const frame = new Image();
      frame.decoding = 'async';
      frame.src = `/assets/frames/frame_${String(index).padStart(4, '0')}.webp`;
      frame.onload = () => {
        if (currentFrame < 0) drawFrame(0);
      };
      frames.push(frame);
    }
  }

  const drawFrame = (index: number) => {
    if (!sequence || !frames[index]?.complete || !frames[index]?.naturalWidth || index === currentFrame) return;
    const context = sequence.getContext('2d', { alpha: false });
    if (!context) return;
    const frame = frames[index];
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(sequence.clientWidth * ratio);
    const height = Math.round(sequence.clientHeight * ratio);
    if (sequence.width !== width || sequence.height !== height) {
      sequence.width = width;
      sequence.height = height;
    }
    const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight) * 0.88;
    const drawWidth = frame.naturalWidth * scale;
    const drawHeight = frame.naturalHeight * scale;
    context.fillStyle = '#090a0c';
    context.fillRect(0, 0, width, height);
    context.drawImage(frame, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    currentFrame = index;
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('sc-in');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  root.querySelectorAll('[data-sc-in]').forEach((element) => revealObserver.observe(element));

  let awardPlayed = false;
  const award = root.querySelector<HTMLElement>('[data-sc-count]');
  const awardObserver = award && !reduceMotion ? new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting || awardPlayed) return;
    awardPlayed = true;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = clamp((now - start) / 120);
      award.textContent = String(Math.round(2023 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, { threshold: 0.35 }) : null;
  if (award && awardObserver) {
    award.textContent = '0';
    awardObserver.observe(award);
  } else if (award) {
    award.textContent = '2023';
  }

  const read = () => {
    const viewport = window.innerHeight;
    acts.forEach((act) => {
      if (act.device === 'flow') return;
      const rect = act.element.getBoundingClientRect();
      const travel = Math.max(rect.height - viewport, 1);
      const progress = clamp(-rect.top / travel);

      if (act.canvas) drawFrame(Math.round(progress * (frames.length - 1)));
      if (act.rail) {
        const distance = Math.max(act.rail.scrollWidth - window.innerWidth + window.innerWidth * 0.08, 0);
        act.rail.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
      }
      act.cues.forEach((cue) => {
        const values = (cue.dataset.scCue || '0').split(/\s+/).map(Number);
        const from = Number.isFinite(values[0]) ? values[0] : 0;
        const to = Number.isFinite(values[1]) ? values[1] : 1;
        const readableProgress = act.element.id === 'home' && window.scrollY < 40
          ? Math.max(progress, 0.32)
          : (progress === 0 && rect.top <= 1 ? 0.16 : progress);
        const enter = clamp((readableProgress - from) / 0.12);
        const exit = to >= 0.98 ? 1 : clamp((to - readableProgress) / 0.14);
        const opacity = Math.min(enter, exit);
        cue.style.opacity = String(opacity);
        cue.style.transform = `translate3d(0, ${(1 - opacity) * 28}px, 0)`;
      });
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      read();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', read);
  read();

  return {
    destroy() {
      document.documentElement.classList.remove('sc-ready');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', read);
      revealObserver.disconnect();
      awardObserver?.disconnect();
    },
  };
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState('General consultation');
  const dialogRef = useRef<HTMLDivElement>(null);

  const openConsultation = (nextInterest = 'General consultation') => {
    setInterest(nextInterest);
    setSubmitted(false);
    setMenuOpen(false);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-active');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-active');
      previous?.focus();
    };
  }, [modalOpen]);

  useEffect(() => {
    document.documentElement.dataset.smbHydrated = 'true';

    let cancelled = false;
    let raf = 0;
    let scrollcraft: { destroy?: () => void } | undefined;
    let lenis: { raf: (time: number) => void; on: (event: string, cb: () => void) => void; destroy: () => void } | undefined;
    const cleanups: Array<() => void> = [];

    void (async () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const [{ default: Lenis }, gsapPackage, triggerPackage] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      const gsap = gsapPackage.gsap;
      const ScrollTrigger = triggerPackage.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!reduce) {
        lenis = new Lenis({ duration: 1.05, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => {
          lenis?.raf(time);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        const marqueeTween = gsap.to('.soul-marquee__track', {
          xPercent: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: '#difference',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
        cleanups.push(() => marqueeTween.kill());
      }

      scrollcraft = window.ScrollCraft?.mount(document.body) ?? mountSmbScroll(document.body);

      const updateSignature = () => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = window.scrollY / max;
        document.documentElement.style.setProperty('--site-progress', String(progress));
        document.querySelectorAll<HTMLElement>('.track-word').forEach((word, index) => {
          const thresholds = [0.11, 0.33, 0.57];
          word.classList.toggle('is-lit', progress >= thresholds[index]);
        });

        const hero = document.querySelector<HTMLElement>('#home');
        if (hero && !reduce) {
          const rect = hero.getBoundingClientRect();
          const local = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height - window.innerHeight, 1)));
          hero.style.setProperty('--hero-radius', `${20 + local * 78}%`);
        }
      };
      updateSignature();
      window.addEventListener('scroll', updateSignature, { passive: true });
      window.addEventListener('resize', updateSignature);
      cleanups.push(() => window.removeEventListener('scroll', updateSignature));
      cleanups.push(() => window.removeEventListener('resize', updateSignature));
    })();

    return () => {
      delete document.documentElement.dataset.smbHydrated;
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((cleanup) => cleanup());
      lenis?.destroy();
      scrollcraft?.destroy?.();
    };
  }, []);

  const submitConsultation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand-mark" href="#home" aria-label="SMB Fitness home">
          <img src="/assets/smb-logo.png" alt="SMB Fitness" decoding="async" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#difference">About Us</a>
          <a href="#programs">Programs</a>
          <a href="#resources">Free Resources</a>
          <a href="#membership">Membership</a>
          <a href="#faq">FAQs</a>
        </nav>
        <button className="nav-cta" type="button" onClick={() => openConsultation()}>
          Book your consultation
        </button>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>Menu</span>
          <span aria-hidden="true">{menuOpen ? '×' : '+'}</span>
        </button>
        {menuOpen && (
          <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
            <a href="#difference" onClick={() => setMenuOpen(false)}>About Us</a>
            <a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a>
            <a href="#resources" onClick={() => setMenuOpen(false)}>Free Resources</a>
            <a href="#membership" onClick={() => setMenuOpen(false)}>Membership</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQs</a>
            <button type="button" onClick={() => openConsultation()}>Book your consultation</button>
          </nav>
        )}
      </header>

      <aside className="strength-track" aria-hidden="true">
        <div className="strength-track__words">
          <span className="track-word">Soul</span>
          <span className="track-word">Mind</span>
          <span className="track-word">Body</span>
        </div>
        <span className="strength-track__bar"><span /></span>
      </aside>

      <main>
        <section id="home" className="hero-act" data-sc-act="scrub" data-sc-span="3" data-sc-dwell="0.34" data-sc-drift="#090a0c">
          <div className="hero-stage" data-sc-stage>
            <div className="hero-film" aria-hidden="true">
              <canvas data-sc-sequence="/assets/frames/frame_{iiii}.webp:180:1" role="img" aria-label="SMB Fitness members training together" />
              <img className="hero-poster" src="/assets/hero-poster.jpg" alt="" fetchPriority="high" />
            </div>
            <div className="hero-vignette" />
            <div className="hero-copy align-left">
              <p className="eyebrow" data-sc-cue="0 0.99 0.12 0.05">Strength that transforms your soul, mind, and body.</p>
              <h1 data-sc-cue="0.02 0.99 0.12 0.05" data-sc-kinetic="lines">
                Strong <span>mind.</span><br />
                Strong <span>body.</span><br />
                Strong <span>you.</span>
              </h1>
              <p className="hero-body" data-sc-cue="0.1 0.99 0.15 0.05">
                A premium fitness experience built around expert guidance, personal attention, and a supportive community.
              </p>
              <div className="hero-actions" data-sc-cue="0.16 0.99 0.14 0.05" data-sc-rise="0">
                <button className="button button--gold" type="button" data-sc-magnet="0.18" onClick={() => openConsultation()}>
                  Book your consultation
                </button>
                <a className="text-link" href="#programs">Explore programs <span aria-hidden="true">↘</span></a>
              </div>
            </div>
            <p className="hero-note" data-sc-cue="0.18 0.99">Forney, Texas • In-person and virtual training</p>
          </div>
        </section>

        <section id="difference" className="difference-section sc-section" data-sc-act="flow" data-sc-drift="#14213d">
          <div className="soul-marquee" aria-hidden="true"><div className="soul-marquee__track">SOUL • MIND • BODY • SOUL • MIND • BODY •</div></div>
          <div className="section-shell difference-intro" data-sc-in data-sc-stagger="90">
            <div><p className="eyebrow">The SMB difference</p><h2>Fitness should change more than a number.</h2></div>
            <p className="lede">SMB Fitness is built around the whole person. The work is physical, but the transformation reaches further.</p>
          </div>
          <div className="pillar-stack section-shell">
            <article data-sc-in><span>01</span><h3>Soul</h3><p>A community that sees the whole person and makes space for every starting point.</p></article>
            <article data-sc-in><span>02</span><h3>Mind</h3><p>Confidence grows through education, structure, accountability, and support.</p></article>
            <article data-sc-in><span>03</span><h3>Body</h3><p>Training adapts to your level, goals, and abilities so progress has a clear direction.</p></article>
          </div>
        </section>

        <section id="challenges" className="challenge-act" data-sc-act="pin" data-sc-span="1.3" data-sc-drift="#0d0f13">
          <div className="challenge-stage" data-sc-stage>
            <div className="challenge-copy align-right">
              <p className="eyebrow" data-sc-cue="0 0.98">When doing it alone stops working</p>
              <h2 data-sc-cue="0.04 0.98" data-sc-kinetic="lines">Starting again should not feel like starting alone.</h2>
              <p data-sc-cue="0.1 0.98">Maybe the plan keeps changing. Maybe you are working hard without knowing what to adjust. Maybe the gym has never felt built for you.</p>
              <p className="challenge-turn" data-sc-cue="0.22 0.98">SMB begins with understanding before intensity.</p>
            </div>
          </div>
        </section>

        <section id="programs" className="program-act" data-sc-act="pan" data-sc-span="4.4" data-sc-drift="#090a0c">
          <div className="program-stage" data-sc-stage>
            <div className="program-rail" data-sc-pan="0.08">
              <article className="program-lead">
                <p className="eyebrow">Programs & services</p>
                <h2>One system.<br /><span>Many ways in.</span></h2>
                <p>Move through the SMB training circuit. Every option connects back to Soul, Mind, and Body.</p>
                <span className="rail-direction">Follow the circuit <span aria-hidden="true">→</span></span>
              </article>
              {programs.map((program, index) => (
                <article className="program-panel" key={program.name}>
                  <figure data-sc-tilt="4"><img src={program.image} alt={`${program.name} at SMB Fitness`} loading="lazy" decoding="async" /></figure>
                  <div className="program-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{program.pillar}</span></div>
                  <h3>{program.name}</h3>
                  <p>{program.copy}</p>
                  <button className="program-link" type="button" onClick={() => openConsultation(program.name)}>Ask about this program <span aria-hidden="true">↗</span></button>
                </article>
              ))}
              <article className="program-exit">
                <p className="eyebrow">Not sure where to begin?</p>
                <h3>That is what the consultation is for.</h3>
                <button className="button button--gold" type="button" onClick={() => openConsultation('Program guidance')}>Find your starting point</button>
              </article>
            </div>
          </div>
        </section>

        <section id="process" className="process-section sc-section" data-sc-act="flow" data-sc-drift="#e5e5e5">
          <div className="section-shell process-shell">
            <div className="process-heading" data-sc-in><p className="eyebrow">How it works</p><h2>A clear way forward.</h2></div>
            <ol className="process-list">
              <li data-sc-in><span>01</span><div><h3>Book a consultation</h3><p>Start with your goals, your routine, and the support you are looking for.</p></div></li>
              <li data-sc-in><span>02</span><div><h3>Build the right plan</h3><p>Choose the service path that fits your needs, abilities, and schedule.</p></div></li>
              <li data-sc-in><span>03</span><div><h3>Train with support</h3><p>Move forward with coaching, accountability, and a community behind you.</p></div></li>
            </ol>
            <button className="button button--dark" type="button" onClick={() => openConsultation()} data-sc-magnet="0.14">Book your consultation</button>
          </div>
        </section>

        <section id="proof" className="proof-section sc-section" data-sc-act="flow" data-sc-drift="#14213d">
          <div className="proof-image" data-sc-reveal="left" data-sc-reveal-at="0.06 0.44"><img src="/assets/program-5.webp" alt="Private fitness coaching at SMB Fitness" data-sc-parallax="-0.12" loading="lazy" decoding="async" /></div>
          <div className="proof-copy" data-sc-in>
            <p className="eyebrow">A member’s words</p>
            <blockquote>“I have come such a long way since working with Stacia, both physically and mentally! I’m stronger than I’ve ever been and have more confidence than I’ve had in a long time. Her ability to help you achieve results and her supportive nature have built a dedicated community that will truly improve your soul, mind and body!”</blockquote>
            <p className="attribution">Allie Hausmann</p>
          </div>
          <div className="award-mark" data-sc-in><span data-sc-count="0 2023">2023</span><p>Best of Forney Award</p></div>
        </section>

        <section id="resources" className="resources-section sc-section" data-sc-act="flow" data-sc-drift="#f3f0ea">
          <div className="section-shell resources-shell">
            <div data-sc-in><p className="eyebrow">Free resources</p><h2>Build a better starting point.</h2></div>
            <div className="resource-note" data-sc-in>
              <p>Ask SMB Fitness about current free resources for training, nutrition, and getting started with more confidence.</p>
              <button className="text-link text-link--dark" type="button" onClick={() => openConsultation('Free resources')}>Ask about free resources <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </section>

        <section id="membership" className="membership-section sc-section" data-sc-act="flow" data-sc-drift="#090a0c">
          <div className="membership-photo" data-sc-reveal="right" data-sc-reveal-at="0.08 0.58"><img src="/assets/program-6.webp" alt="SMB Fitness specialty training" loading="lazy" decoding="async" /></div>
          <div className="membership-copy" data-sc-in>
            <p className="eyebrow">Membership</p>
            <h2>The right support starts with the right conversation.</h2>
            <p>SMB membership guidance is personal. Use the consultation to understand current options, availability, and which program best fits your goals.</p>
            <button className="button button--gold" type="button" onClick={() => openConsultation('Membership options')}>Explore membership</button>
          </div>
        </section>

        <section id="faq" className="faq-section sc-section" data-sc-act="flow" data-sc-drift="#e5e5e5">
          <div className="section-shell faq-shell">
            <div className="faq-heading" data-sc-in>
              <p className="eyebrow">FAQs</p><h2>Before you begin.</h2>
              <p>Still have a question? Call <a href="tel:+12142398505">214-239-8505</a> or email <a href="mailto:info@smb.fitness">info@smb.fitness</a>.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question} data-sc-in><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="close-act" data-sc-act="pin" data-sc-span="1.2" data-sc-drift="#090a0c">
          <div className="close-stage" data-sc-stage data-sc-spotlight>
            <div className="close-statement align-left">
              <p className="eyebrow" data-sc-cue="0 0.99">Your next chapter can start here.</p>
              <h2 data-sc-cue="0.04 0.99" data-sc-kinetic="lines">Ready to feel stronger in every part of your life?</h2>
              <p data-sc-cue="0.1 0.99">Let’s talk about your goals and the kind of support that will help you move forward.</p>
              <button className="button button--gold" type="button" data-sc-magnet="0.2" data-sc-cue="0.14 0.99" data-sc-rise="0" onClick={() => openConsultation()}>Book your consultation</button>
            </div>
            <footer className="site-footer">
              <span>SMB Fitness</span><a href="tel:+12142398505">214-239-8505</a><a href="mailto:info@smb.fitness">info@smb.fitness</a><span>Forney, Texas</span>
            </footer>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <div className="consultation-dialog" role="dialog" aria-modal="true" aria-labelledby="consultation-title" tabIndex={-1} ref={dialogRef}>
            <button className="dialog-close" type="button" aria-label="Close consultation form" onClick={() => setModalOpen(false)}>×</button>
            {!submitted ? (
              <>
                <p className="eyebrow">Start the conversation</p>
                <h2 id="consultation-title">Book your consultation</h2>
                <p className="dialog-intro">Tell SMB Fitness where you want to go. This prospect demo keeps your entry on this page until the live GoHighLevel form is connected.</p>
                <form onSubmit={submitConsultation}>
                  <div className="form-row">
                    <label>First name<input name="first_name" autoComplete="given-name" required /></label>
                    <label>Last name<input name="last_name" autoComplete="family-name" required /></label>
                  </div>
                  <div className="form-row">
                    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
                    <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
                  </div>
                  <label>Primary goal<textarea name="primary_goal" rows={3} required defaultValue={interest === 'General consultation' ? '' : `I’m interested in ${interest}.`} /></label>
                  <div className="form-row">
                    <label>Preferred contact<select name="preferred_contact" defaultValue="Email"><option>Email</option><option>Phone</option><option>Text</option></select></label>
                    <label>Area of interest<select name="interest" value={interest} onChange={(event) => setInterest(event.target.value)}><option>General consultation</option><option>Program guidance</option><option>Membership options</option><option>Free resources</option>{programs.map((program) => <option key={program.name}>{program.name}</option>)}</select></label>
                  </div>
                  <label className="consent"><input name="consent" type="checkbox" required /> I agree to be contacted by SMB Fitness about this request.</label>
                  <button className="button button--gold button--full" type="submit">Send consultation request</button>
                </form>
              </>
            ) : (
              <div className="thank-you" role="status">
                <p className="eyebrow">Demo thank-you state</p>
                <h2 id="consultation-title">Your request is ready for the live connection.</h2>
                <p>In the production version, this is where the GoHighLevel confirmation and follow-up instructions will appear.</p>
                <div className="thank-you__actions">
                  <a className="button button--gold" href="tel:+12142398505">Call 214-239-8505</a>
                  <button className="text-link text-link--dark" type="button" onClick={() => setModalOpen(false)}>Return to the site</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
