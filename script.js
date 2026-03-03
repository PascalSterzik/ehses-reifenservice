/* ============================================
   Dieter Ehses Reifenservice | script.js
   Fresh rebuild — EMBER-level quality
   ============================================ */

(function () {
    'use strict';

    /* ---- Mobile Navigation ---- */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
    }

    /* ---- Sticky Header ---- */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    /* ---- Scroll Progress Bar ---- */
    const scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
        }, { passive: true });
    }

    /* ---- Back to Top ---- */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            smoothScrollTo(0);
        });
    }

    /* ---- Custom Smooth Scroll (rule #25) ---- */
    function smoothScrollTo(targetY, duration) {
        duration = duration || 800;
        const startY = window.scrollY;
        const diff = targetY - startY;
        let startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, startY + diff * easeInOutCubic(progress));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    /* ---- Smooth Scroll for Anchor Links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = header ? header.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
                smoothScrollTo(targetPos);
            }
        });
    });

    /* ---- Scroll Reveal (IntersectionObserver) ---- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children, .hero-stagger').forEach(el => {
        revealObserver.observe(el);
    });

    /* ---- Animated Stat Counters ---- */
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1).replace('.', ',') + suffix;
            } else {
                el.textContent = Math.floor(current).toLocaleString('de-DE') + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    el.textContent = target.toFixed(1).replace('.', ',') + suffix;
                } else {
                    el.textContent = target.toLocaleString('de-DE') + suffix;
                }
            }
        }
        requestAnimationFrame(update);
    }

    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
                    entry.target.setAttribute('data-counted', '');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => statsObserver.observe(el));
    }

    /* ---- Hero Parallax ---- */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + scrollY * 0.3 + 'px) scale(1.08)';
            }
        }, { passive: true });
    }

    /* ---- FAQ Toggle ---- */
    document.querySelectorAll('.faq-item').forEach(item => {
        const summary = item.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', (e) => {
                // Let native <details> handle open/close
                // Just close other items for accordion behavior
                const parent = item.parentElement;
                if (parent) {
                    parent.querySelectorAll('.faq-item[open]').forEach(openItem => {
                        if (openItem !== item) {
                            openItem.removeAttribute('open');
                        }
                    });
                }
            });
        }
    });

    /* ---- Mobile Sticky CTA Show/Hide ---- */
    const mobileCta = document.querySelector('.mobile-sticky-cta');
    if (mobileCta) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 600) {
                mobileCta.classList.add('visible');
                if (currentScroll > lastScroll && currentScroll > 800) {
                    mobileCta.classList.add('hidden');
                } else {
                    mobileCta.classList.remove('hidden');
                }
            } else {
                mobileCta.classList.remove('visible');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    /* ---- 3D Tilt on Service Cards (desktop only) ---- */
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'translateY(-8px) perspective(600px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

})();
