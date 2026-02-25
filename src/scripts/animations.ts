import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

let observers: IntersectionObserver[] = [];

function createObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
        obs.unobserve(entry.target);
      }
    });
  }, options);
  observers.push(obs);
  return obs;
}

export function initAnimations() {
  // Clean up previous observers
  observers.forEach((obs) => {
    obs.disconnect();
  });
  observers = [];

  // Fallback for reduced motion: ensure content is visible
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-content').forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
    });
    document
      .querySelectorAll(
        '.fade-in-up, .hero-actions, .post-item, .project-item, .note-item, .experience-item, .skills-item'
      )
      .forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
        (el as HTMLElement).style.translate = 'none';
      });
    document.querySelectorAll('.section-header, .animate-blob').forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
    });

    // Ensure scramble text matches final state
    document.querySelectorAll('.scramble-text').forEach((el) => {
      const target = el as HTMLElement;
      if (target.dataset.originalText) {
        target.innerText = target.dataset.originalText;
      }
    });
    return;
  }

  // Background blob
  document.querySelectorAll('.animate-blob').forEach((el) => {
    el.classList.add('is-visible');
  });

  // Block Reveal Animations (GSAP timeline triggered by IntersectionObserver)
  const revealWraps = document.querySelectorAll('.reveal-wrap');
  if (revealWraps.length > 0) {
    const revealObserver = createObserver(
      (entry) => {
        const wrap = entry.target;
        const block = wrap.querySelector('.reveal-block');
        const content = wrap.querySelector('.reveal-content');
        if (!block || !content) return;

        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.to(block, { scaleX: 1, duration: 0.6, transformOrigin: 'left' })
          .set(content, { opacity: 1 })
          .to(block, { scaleX: 0, duration: 0.6, transformOrigin: 'right' });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    revealWraps.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Fade / slide-up elements (CSS transition via .is-visible class)
  const fadeObserver = createObserver(
    (entry) => {
      entry.target.classList.add('is-visible');
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  document.querySelectorAll('.fade-in-up, .hero-actions, .section-header').forEach((el) => {
    fadeObserver.observe(el);
  });

  // Staggered list items (observe sections, then animate children with delay)
  const staggerObserver = createObserver(
    (entry) => {
      const items = entry.target.querySelectorAll(
        '.post-item, .project-item, .note-item, .experience-item, .skills-item'
      );
      items.forEach((item, i) => {
        (item as HTMLElement).style.setProperty('--stagger-delay', `${i * 0.1}s`);
        item.classList.add('is-visible');
      });
    },
    { rootMargin: '0px 0px -20% 0px' }
  );
  document
    .querySelectorAll(
      '.posts-section, .projects-section, .projects-page-section, .experience-section, .skills-section, .note-section'
    )
    .forEach((el) => {
      staggerObserver.observe(el);
    });

  // Scramble Text (GSAP core, triggered by IntersectionObserver)
  document.querySelectorAll('.scramble-text').forEach((element) => {
    const target = element as HTMLElement;
    const originalText = target.dataset.originalText || target.innerText;

    const tweenVars: gsap.TweenVars = {
      duration: 1.0,
      scrambleText: {
        text: originalText,
        chars: '!<>-_\\/[]{}—=+*^?#________',
        revealDelay: 0.5,
        speed: 0.3,
      },
    };

    const rect = target.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight * 0.85;

    if (isInViewport) {
      tweenVars.delay = 0.2;
      gsap.to(target, tweenVars);
    } else {
      const scrambleObserver = createObserver(
        () => {
          gsap.to(target, tweenVars);
        },
        { rootMargin: '0px 0px -15% 0px' }
      );
      scrambleObserver.observe(target);
    }
  });
}

// Global listeners for Astro View Transitions
document.addEventListener('astro:page-load', initAnimations);
document.addEventListener('astro:before-swap', () => {
  observers.forEach((obs) => {
    obs.disconnect();
  });
  observers = [];
});
