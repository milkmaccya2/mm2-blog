import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let mm: gsap.MatchMedia | undefined;

export function initAnimations() {
  // Clean up previous context if it needs a full reset
  if (mm) mm.revert();

  mm = gsap.matchMedia();

  // Only play animations if user has no preference for reduced motion
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Background blob
    const blobs = document.querySelectorAll('.animate-blob');
    if (blobs.length > 0) {
      gsap.to(blobs, {
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut',
      });
    }

    // Block Reveal Animations
    const revealWraps = document.querySelectorAll('.reveal-wrap');
    if (revealWraps.length > 0) {
      revealWraps.forEach((wrap) => {
        const block = wrap.querySelector('.reveal-block');
        const content = wrap.querySelector('.reveal-content');

        // Skip if required children are missing
        if (!block || !content) return;

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: wrap,
            start: 'top 90%',
          },
        });

        tl.to(block, {
          scaleX: 1,
          duration: 0.6,
          transformOrigin: 'left',
        })
          .set(content, { opacity: 1 })
          .to(block, {
            scaleX: 0,
            duration: 0.6,
            transformOrigin: 'right',
          });
      });
    }

    // Secondary text fade in (Subtitle second line)
    const fadeIns = document.querySelectorAll('.fade-in-up');
    if (fadeIns.length > 0) {
      fadeIns.forEach((fadeIn) => {
        gsap.to(fadeIn, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: fadeIn,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }

    // Buttons animation
    const heroActions = document.querySelectorAll('.hero-actions');
    if (heroActions.length > 0) {
      gsap.to(heroActions, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.hero-actions',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Section Header
    const sectionHeaders = document.querySelectorAll('.section-header');
    if (sectionHeaders.length > 0) {
      sectionHeaders.forEach((header) => {
        // Trigger based on the closest parent section if available, otherwise the header itself
        const triggerElement = header.closest('section') || header;

        gsap.to(header, {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top 85%',
          },
        });
      });
    }

    // Generalized List Item Animation Function
    const animateListItems = (itemSelector: string, sectionSelector: string) => {
      const items = document.querySelectorAll(itemSelector);
      if (items.length > 0) {
        const section = document.querySelector(sectionSelector);
        const trigger = section || items[0];

        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: trigger,
            start: 'top 80%',
          },
        });
      }
    };

    // Post List Interactions
    animateListItems('.post-item', '.posts-section');

    // Project List Interactions
    animateListItems('.project-item', '.projects-section');
  });

  // Fallback for reduced motion: ensure content is visible
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.reveal-content', { opacity: 1 });
    gsap.set('.fade-in-up', { opacity: 1, y: 0 });
    gsap.set('.hero-actions', { opacity: 1, y: 0 });
    gsap.set('.section-header', { opacity: 1 });
    gsap.set('.post-item', { opacity: 1, y: 0 });
    gsap.set('.project-item', { opacity: 1, y: 0 });
    gsap.set('.animate-blob', { opacity: 1 });
  });
}

// Global listeners for Astro View Transitions
document.addEventListener('astro:page-load', initAnimations);
document.addEventListener('astro:before-swap', () => {
  if (mm) mm.revert();
});
