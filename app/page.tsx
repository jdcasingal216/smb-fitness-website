'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: HTMLElement) => { destroy?: () => void };
    };
  }
}

const programs = [
  {
    name: 'Virtual Training',
    pillar: 'Mind',
    image: '/assets/service-01.webp',
    alt: 'Two SMB Fitness members following a virtual workout from home',
    copy: 'Coach-led structure and accountability wherever you train.',
  },
  {
    name: 'Private Coaching',
    pillar: 'Body',
    image: '/assets/service-02.webp',
    alt: 'Personal trainer supporting a client through a suspension exercise',
    copy: 'Focused one-to-one attention built around your goals and abilities.',
  },
  {
    name: 'Goal Setting & Tracking',
    pillar: 'Mind',
    image: '/assets/service-03.webp',
    alt: 'Coach and member reviewing a written fitness plan together',
    copy: 'A clear route from where you are now to what you are working toward.',
  },
  {
    name: 'Nutrition Plans',
    pillar: 'Body',
    image: '/assets/service-04.webp',
    alt: 'Nutrition coaching session with a laptop, clipboard, and fresh produce',
    copy: 'Nutrition guidance designed to support the work you do in training.',
  },
  {
    name: 'Specialty Programs',
    pillar: 'Soul',
    image: '/assets/service-05.webp',
    alt: 'Mixed-age group taking part in a guided specialty fitness program',
    copy: 'Focused programs for specific goals, seasons, and challenges.',
  },
  {
    name: 'Individual Approach',
    pillar: 'Soul',
    image: '/assets/service-06.webp',
    alt: 'Trainer giving close personal guidance during a dumbbell exercise',
    copy: 'Training shaped around your starting point, schedule, and progress.',
  },
  {
    name: 'Real Results',
    pillar: 'Mind',
    image: '/assets/service-07.webp',
    alt: 'Mature gym member smiling while discussing progress with a coach',
    copy: 'Consistent coaching, useful feedback, and wins you can build on.',
  },
  {
    name: 'Educate',
    pillar: 'Body',
    image: '/assets/service-08.webp',
    alt: 'Trainer teaching a member correct cable-exercise posture and form',
    copy: 'Learn the form, habits, and reasoning that make progress sustainable.',
  },
];

const clientWins = [
  {
    id: '01',
    image: '/assets/client-win-01.webp',
    alt: 'Side-by-side progress photos from an SMB Fitness client journey',
  },
  {
    id: '02',
    image: '/assets/client-win-02.webp',
    alt: 'Side-profile progress photos from an SMB Fitness client journey',
  },
  {
    id: '04',
    image: '/assets/client-win-04.webp',
    alt: 'Front-view progress photos from an SMB Fitness client journey',
  },
  {
    id: '05',
    image: '/assets/client-win-05.webp',
    alt: 'Lifestyle progress photos from an SMB Fitness client journey',
  },
  {
    id: '06',
    image: '/assets/client-win-06.webp',
    alt: 'Athletic progress photos from an SMB Fitness client journey',
  },
  {
    id: '07',
    image: '/assets/client-win-07.webp',
    alt: 'Postpartum-to-active-lifestyle progress photos from an SMB Fitness client journey',
  },
];

type PrimaryCtaProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

function PrimaryCta({ label, onClick, className = '' }: PrimaryCtaProps) {
  return (
    <button
      className={`button button--gold cta-primary ${className}`.trim()}
      type="button"
      data-primary-cta
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function FooterIcon({ name }: { name: 'phone' | 'email' | 'location' | 'instagram' | 'facebook' | 'clock' }) {
  const paths: Record<typeof name, ReactNode> = {
    phone: <path d="M7.2 3.5 9 7.7 6.8 9a15 15 0 0 0 8.2 8.2l1.3-2.2 4.2 1.8v2.7a2 2 0 0 1-2 2C9.7 21.5 2.5 14.3 2.5 5.5a2 2 0 0 1 2-2h2.7Z" />,
    email: <><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m4 6 8 6 8-6" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>,
    facebook: <path d="M14.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.6 1.7-1.6H18V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H8v3h3v8h3.5Z" fill="currentColor" stroke="none" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

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
    const requestedDevice = element.dataset.scAct || 'flow';
    const device = element.dataset.scMobileFlow === 'true' && window.innerWidth <= 760 ? 'flow' : requestedDevice;
    const stage = element.querySelector<HTMLElement>('[data-sc-stage]');
    if (device !== 'flow' && !reduceMotion) {
      const desktopSpan = Number(element.dataset.scSpan || 1.5);
      const mobileSpan = Number(element.dataset.scMobileSpan || desktopSpan);
      element.classList.add('sc-act--pinned');
      element.style.height = `${(window.innerWidth <= 760 ? mobileSpan : desktopSpan) * 100}vh`;
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
  if (sequence && window.innerWidth > 1100) {
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
    const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight);
    const drawWidth = frame.naturalWidth * scale;
    const drawHeight = frame.naturalHeight * scale;
    const drawX = window.innerWidth <= 760 ? width - drawWidth : (width - drawWidth) / 2;
    context.fillStyle = '#090a0c';
    context.fillRect(0, 0, width, height);
    context.drawImage(frame, drawX, (height - drawHeight) / 2, drawWidth, drawHeight);
    currentFrame = index;
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('sc-in');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  root.querySelectorAll('[data-sc-in]').forEach((element) => revealObserver.observe(element));
  root.querySelectorAll('[data-primary-cta]').forEach((element) => revealObserver.observe(element));

  const trustArea = root.querySelector<HTMLElement>('[data-trust-trigger]');
  let trustVisible = false;
  let trustPlayed = false;
  const playTrustCounters = () => {
    if (!trustVisible || trustPlayed || window.scrollY < 24) return;
    trustPlayed = true;
    root.querySelectorAll<HTMLElement>('[data-count-target]').forEach((counter) => {
      const target = Number(counter.dataset.countTarget || 0);
      const decimals = Number(counter.dataset.countDecimals || 0);
      const suffix = counter.dataset.countSuffix || '';
      if (reduceMotion) {
        counter.textContent = `${target.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
        return;
      }
      const started = performance.now();
      const animate = (now: number) => {
        const progress = clamp((now - started) / 1250);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${(target * eased).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
    trustObserver.disconnect();
    window.removeEventListener('scroll', playTrustCounters);
  };
  const trustObserver = trustArea ? new IntersectionObserver((entries) => {
    trustVisible = Boolean(entries[0]?.isIntersecting);
    playTrustCounters();
  }, { threshold: 0.45, rootMargin: '0px 0px -8% 0px' }) : null;
  if (trustArea && trustObserver) trustObserver.observe(trustArea);
  window.addEventListener('scroll', playTrustCounters, { passive: true });

  const read = () => {
    const viewport = window.innerHeight;
    acts.forEach((act) => {
      if (act.device === 'flow') return;
      const rect = act.element.getBoundingClientRect();
      const travel = Math.max(rect.height - viewport, 1);
      const progress = clamp(-rect.top / travel);

      if (act.canvas) drawFrame(Math.round(progress * (frames.length - 1)));
      if (act.rail) {
        const viewportWidth = act.rail.parentElement?.clientWidth || window.innerWidth;
        const distance = Math.max(act.rail.scrollWidth - viewportWidth + viewportWidth * 0.08, 0);
        const reverse = act.rail.dataset.scDirection === 'reverse';
        act.rail.style.transform = `translate3d(${reverse ? -distance * (1 - progress) : -distance * progress}px, 0, 0)`;
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
      trustObserver?.disconnect();
      window.removeEventListener('scroll', playTrustCounters);
    },
  };
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState('General consultation');
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

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
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 1100) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [menuOpen]);

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
          hero.style.setProperty('--hero-scale', String(1 + local * 0.04));
        }

        const community = document.querySelector<HTMLElement>('#community');
        if (community && !reduce) {
          const rect = community.getBoundingClientRect();
          const local = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
          community.style.setProperty('--community-p', String(local));
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
      <header className="site-header" ref={headerRef}>
        <a className="brand-mark" href="#home" aria-label="SMB Fitness home">
          <img src="/assets/smb-logo-white.png" alt="SMB Fitness" decoding="async" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About Us</a>
          <a href="#community">Community</a>
          <a href="#programs">Programs</a>
          <a href="#resources">Free Resources</a>
          <a href="#membership">Membership</a>
          <a href="#client-wins">Client Wins</a>
          <a href="#faq">FAQs</a>
        </nav>
        <PrimaryCta className="nav-cta" label="Book your free consultation" onClick={() => openConsultation()} />
        <div className="header-contact" aria-label="Contact SMB Fitness">
          <a href="tel:+12142398505">+1 214-239-8505</a>
          <a href="mailto:info@smb.fitness">info@smb.fitness</a>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span className={`hamburger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true"><i /><i /><i /></span>
        </button>
        {menuOpen && (
          <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
            <a href="#about" onClick={() => setMenuOpen(false)}>About Us</a>
            <a href="#community" onClick={() => setMenuOpen(false)}>Community</a>
            <a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a>
            <a href="#resources" onClick={() => setMenuOpen(false)}>Free Resources</a>
            <a href="#membership" onClick={() => setMenuOpen(false)}>Membership</a>
            <a href="#client-wins" onClick={() => setMenuOpen(false)}>Client Wins</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQs</a>
            <a href="tel:+12142398505" onClick={() => setMenuOpen(false)}>+1 214-239-8505</a>
            <a href="mailto:info@smb.fitness" onClick={() => setMenuOpen(false)}>info@smb.fitness</a>
            <PrimaryCta className="mobile-cta" label="Book your free consultation" onClick={() => openConsultation()} />
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
        <section id="home" className="hero-act" data-sc-act="scrub" data-sc-span="2.8" data-sc-mobile-span="2.1" data-sc-dwell="0.34" data-sc-drift="#090a0c">
          <div className="hero-stage" data-sc-stage>
            <div className="hero-film" aria-hidden="true">
              <canvas data-sc-sequence="/assets/frames/frame_{iiii}.webp:180:1" role="img" aria-label="SMB Fitness members training together" />
              <video className="hero-poster" muted playsInline preload="metadata" poster="/assets/hero-poster.jpg">
                <source src="/assets/hero-smbf.mp4" type="video/mp4" />
              </video>
              <video className="hero-mobile-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/hero-poster.jpg">
                <source src="/assets/hero-smbf-mobile.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="hero-vignette" />
            <div className="hero-copy align-left">
              <p className="eyebrow" data-sc-cue="0 0.99 0.12 0.05">Soul. Mind. Body.</p>
              <h1 data-sc-cue="0.02 0.99 0.12 0.05" data-sc-kinetic="lines">
                Strong <span>mind.</span><br />
                Strong <span>body.</span><br />
                Strong <span>you.</span>
              </h1>
              <p className="hero-body" data-trust-trigger data-sc-cue="0.1 0.99 0.15 0.05">
                Real transformation begins when your mind believes what your body can become. Build lasting strength, confidence, and discipline with coaching designed to move your whole life forward.
              </p>
              <div className="hero-actions" data-sc-cue="0.16 0.99 0.14 0.05" data-sc-rise="0">
                <PrimaryCta label="Book your free consultation" onClick={() => openConsultation()} />
              </div>
              <div className="hero-trust" data-sc-cue="0.2 0.99 0.12 0.05">
                <div aria-label="4.9 out of 5 Star Rating">
                  <strong aria-hidden="true"><span data-count-target="4.9" data-count-decimals="1">0.0</span>/5</strong>
                  <span aria-hidden="true">Star Rating</span>
                </div>
                <div aria-label="2,050 Members Joined">
                  <strong aria-hidden="true" data-count-target="2050">0</strong>
                  <span aria-hidden="true">Members Joined</span>
                </div>
              </div>
            </div>
            <p className="hero-note" data-sc-cue="0.18 0.99">Forney, Texas • In-person and virtual training</p>
          </div>
        </section>

        <section id="community" className="community-section" data-sc-act="pan" data-sc-span="2.7" data-sc-mobile-span="2.2" data-sc-mobile-flow="true" data-sc-drift="#14213d">
          <div className="community-stage" data-sc-stage>
            <img className="community-watermark" src="/assets/smb-logo-white.png" alt="" aria-hidden="true" />
            <div className="community-copy" data-sc-in>
              <p className="eyebrow">The SMB Fitness community</p>
              <h2>Come for the workout.<br /><span>Stay for the people.</span></h2>
              <p>Good energy. Real encouragement. A community that celebrates every win and helps you keep showing up—one stronger day at a time.</p>
              <PrimaryCta label="Find your place at SMB" onClick={() => openConsultation('SMB Fitness community')} />
              <div id="about" className="about-us-panel">
                <p className="eyebrow">About us</p>
                <p><strong>SMB Fitness is a veteran owned personal training service business.</strong></p>
                <p>SMB Fitness is a brand that promotes transformation within the soul, mind, and body. We believe that your body can withstand almost anything. Once you convince your mind you are unstoppable! That&apos;s where the real transformation starts. We take pride and are passionate about getting you to your goals!</p>
                <p>Our programs will not only motivate you but build your self-confidence and increase discipline allowing you to unleash your fullest potential.</p>
              </div>
            </div>
            <div className="community-viewport" aria-label="SMB Fitness community photo story">
              <div className="community-montage" data-sc-pan="0.08" data-sc-direction="reverse">
                <figure className="community-card"><img src="/assets/community-01.webp" alt="Young SMB Fitness community members celebrating after an outdoor activity" loading="lazy" decoding="async" /></figure>
                <figure className="community-card"><img src="/assets/community-02.webp" alt="SMB Fitness members smiling together during a neighborhood strength workout" loading="lazy" decoding="async" /></figure>
                <figure className="community-card"><img src="/assets/community-03.webp" alt="SMB Fitness members gathered after an outdoor group training session" loading="lazy" decoding="async" /></figure>
                <figure className="community-card"><img src="/assets/community-04.webp" alt="SMB Fitness community taking part in an evening outdoor workout" loading="lazy" decoding="async" /></figure>
                <figure className="community-card"><img src="/assets/community-05.webp" alt="SMB Fitness challenge group celebrating together" loading="lazy" decoding="async" /></figure>
                <figure className="community-card"><img src="/assets/community-06.webp" alt="SMB Fitness members completing a poolside wellness challenge" loading="lazy" decoding="async" /></figure>
                <figure className="community-card"><img src="/assets/community-07.webp" alt="SMB Fitness community celebrating together at a pool gathering" loading="lazy" decoding="async" /></figure>
              </div>
            </div>
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

        <section id="programs" className="program-act" data-sc-act="pan" data-sc-span="5.4" data-sc-mobile-span="4.6" data-sc-drift="#090a0c">
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
                  <figure data-sc-tilt="4"><img src={program.image} alt={program.alt} loading="lazy" decoding="async" /></figure>
                  <div className="program-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{program.pillar}</span></div>
                  <h3>{program.name}</h3>
                  <p>{program.copy}</p>
                  <PrimaryCta className="program-cta" label="About this program" onClick={() => openConsultation(program.name)} />
                </article>
              ))}
              <article className="program-exit">
                <p className="eyebrow">Not sure where to begin?</p>
                <h3>That is what the consultation is for.</h3>
                <PrimaryCta label="Find your starting point" onClick={() => openConsultation('Program guidance')} />
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
            <PrimaryCta label="Book your free consultation" onClick={() => openConsultation()} />
          </div>
        </section>

        <section id="proof" className="proof-section sc-section" data-sc-act="flow" data-sc-drift="#14213d">
          <div className="proof-image" data-sc-reveal="left" data-sc-reveal-at="0.06 0.44"><img src="/assets/service-07.webp" alt="SMB Fitness member discussing real progress with a coach" data-sc-parallax="-0.12" loading="lazy" decoding="async" /></div>
          <div className="proof-copy" data-sc-in>
            <p className="eyebrow">A member’s words</p>
            <blockquote>“I have come such a long way since working with Stacia, both physically and mentally! I’m stronger than I’ve ever been and have more confidence than I’ve had in a long time. Her ability to help you achieve results and her supportive nature have built a dedicated community that will truly improve your soul, mind and body!”</blockquote>
            <p className="attribution">Allie Hausmann</p>
          </div>
        </section>

        <section id="award" className="award-section sc-section" data-sc-act="flow" data-sc-drift="#090a0c">
          <div className="section-shell award-shell">
            <figure className="award-photo" data-sc-in><img src="/assets/forney-award-2023.png" alt="SMB Fitness 2023 Best of Forney personal trainer award" loading="lazy" decoding="async" /></figure>
            <div className="award-copy" data-sc-in>
              <p className="eyebrow">Local recognition</p>
              <h2>2023 Best of Forney Award</h2>
              <p>Each year, in and around the Forney area, the Forney Award Program chooses only the best local businesses. We focus on companies that have demonstrated their ability to use various marketing methods to grow their business in spite of difficult economic times. The companies chosen exemplify the best of small business; often leading through customer service and community involvement. For most companies, this recognition is a result of your dedication and efforts as well as the work of others in your organization that have helped build your business.</p>
            </div>
          </div>
        </section>

        <section id="resources" className="resources-section sc-section" data-sc-act="flow" data-sc-drift="#f3f0ea">
          <div className="section-shell resources-shell">
            <div data-sc-in><p className="eyebrow">Free resources</p><h2>Build a better starting point.</h2></div>
            <div className="resource-note" data-sc-in>
              <p>Ask SMB Fitness about current free resources for training, nutrition, and getting started with more confidence.</p>
              <PrimaryCta label="Ask about free resources" onClick={() => openConsultation('Free resources')} />
            </div>
          </div>
        </section>

        <section id="membership" className="membership-section sc-section" data-sc-act="flow" data-sc-drift="#090a0c">
          <div className="membership-photo" data-sc-reveal="right" data-sc-reveal-at="0.08 0.58"><img src="/assets/service-05.webp" alt="SMB Fitness specialty group training program" loading="lazy" decoding="async" /></div>
          <div className="membership-copy" data-sc-in>
            <p className="eyebrow">Membership</p>
            <h2>The right support starts with the right conversation.</h2>
            <p>SMB membership guidance is personal. Use the consultation to understand current options, availability, and which program best fits your goals.</p>
            <PrimaryCta label="Explore membership" onClick={() => openConsultation('Membership options')} />
          </div>
        </section>

        <section id="client-wins" className="client-wins-section" data-sc-act="pan" data-sc-span="3.8" data-sc-mobile-span="3.2" data-sc-drift="#14213d">
          <div className="client-wins-stage" data-sc-stage>
            <div className="client-wins-gallery" data-sc-pan="0.08" aria-label="SMB Fitness client progress gallery">
              <article className="client-wins-intro">
                <p className="eyebrow">Real progress. Real people.</p>
                <h2>Client <span>wins.</span></h2>
                <p>Every transformation has its own pace, challenges, and victories. These are real SMB Fitness clients building strength, confidence, and consistency one decision at a time.</p>
                <PrimaryCta label="Start your own story" onClick={() => openConsultation('Client wins')} />
              </article>
              {clientWins.map((win) => (
                <figure className="client-win-card" key={win.id}>
                  <img src={win.image} alt={win.alt} loading="lazy" decoding="async" />
                  <figcaption><span>Client win</span><strong>{win.id}</strong></figcaption>
                </figure>
              ))}
            </div>
            <p className="client-wins-note">Individual results vary. Each image reflects one client’s personal journey.</p>
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
            <img className="close-logo-watermark" src="/assets/smb-logo-white.png" alt="" aria-hidden="true" />
            <div className="close-statement align-left">
              <p className="eyebrow" data-sc-cue="0 0.99">Your next chapter can start here.</p>
              <h2 data-sc-cue="0.04 0.99" data-sc-kinetic="lines">Ready to feel stronger in every part of your life?</h2>
              <p data-sc-cue="0.1 0.99">Let’s talk about your goals and the kind of support that will help you move forward.</p>
              <div data-sc-cue="0.14 0.99" data-sc-rise="0"><PrimaryCta label="Book your free consultation" onClick={() => openConsultation()} /></div>
            </div>
            <footer className="site-footer" aria-label="SMB Fitness footer">
              <a className="footer-brand" href="#home" aria-label="SMB Fitness home"><img src="/assets/smb-logo-white.png" alt="SMB Fitness" /></a>
              <div className="footer-contact">
                <a href="tel:+12142398505"><FooterIcon name="phone" /><span>+1 214-239-8505</span></a>
                <a href="mailto:info@smb.fitness"><FooterIcon name="email" /><span>info@smb.fitness</span></a>
                <span><FooterIcon name="location" /><span>Forney, Texas</span></span>
              </div>
              <div className="footer-hours"><FooterIcon name="clock" /><div><span>Mon–Thu — 5:00AM–8:00PM</span><span>Sat — 7:00AM–12:00PM</span><span>Sun — Closed</span></div></div>
              <div className="footer-social" aria-label="Social media">
                <a href="https://www.instagram.com/_smbfitness?igsi=bTVkYWVocmw2NmMx" target="_blank" rel="noreferrer" aria-label="SMB Fitness on Instagram"><FooterIcon name="instagram" /></a>
                <a href="https://www.facebook.com/smbfitnesss/" target="_blank" rel="noreferrer" aria-label="SMB Fitness on Facebook"><FooterIcon name="facebook" /></a>
              </div>
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
