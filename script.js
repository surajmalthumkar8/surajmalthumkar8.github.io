// Advanced Portfolio Website JavaScript - Suraj Malthumkar

// ==================== WAIT FOR DOM TO LOAD ====================
document.addEventListener('DOMContentLoaded', function() {

    // ==================== MOBILE MENU ====================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');

            // Animate icon
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ==================== SMOOTH SCROLL WITH OFFSET ====================
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== ACTIVE NAVIGATION HIGHLIGHTING ====================
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const nav = document.querySelector('nav');
        const navHeight = nav.offsetHeight;
        const sections = document.querySelectorAll('section[id]');

        // Add scrolled class to nav
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Highlight active section in navigation
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                // Remove active class from all links
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current section link
                document.querySelectorAll(`nav a[href="#${sectionId}"]`).forEach(link => {
                    link.classList.add('active');
                });
            }
        });
    });

    // ==================== SCROLL REVEAL ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once animated, stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-reveal');
        observer.observe(section);
    });

    // Observe skill badges for staggered animation
    const skillBadges = document.querySelectorAll('.skill-badge');
    skillBadges.forEach((badge, index) => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px)';
        badge.style.transition = `all 0.5s ease ${index * 0.05}s`;

        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    badgeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        badgeObserver.observe(badge);
    });

    // Observe project cards for staggered animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.15}s`;

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cardObserver.observe(card);
    });

    // Observe timeline items for staggered animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `all 0.6s ease ${index * 0.2}s`;

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        timelineObserver.observe(item);
    });

    // ==================== FORM SUBMISSION HANDLER ====================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || 'Not provided',
                subject: formData.get('subject'),
                message: formData.get('message'),
                timestamp: new Date().toLocaleString()
            };

            // Validate data
            if (!data.name || !data.email || !data.subject || !data.message) {
                showFormStatus('error', 'Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormStatus('error', 'Please enter a valid email address.');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';

            try {
                // Replace with your Google Apps Script Web App URL
                const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2wOin7ER-PGwYz2bEdb9i9jtlLzWygU-DmD4BPnin6LfMAZnS8lBfvPBJHkfJ04ASUA/exec';

                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                // Show success message
                showFormStatus('success', '✓ Thank you for your message! I\'ll get back to you within 24-48 hours.');
                contactForm.reset();

                // Track form submission (optional - Google Analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': data.subject
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                showFormStatus('error', '✗ Sorry, there was an error sending your message. Please try emailing me directly at surajmalthumkar8@gmail.com');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Function to show form status messages
    function showFormStatus(type, message) {
        formStatus.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'text-green-800', 'text-red-800');

        if (type === 'success') {
            formStatus.classList.add('bg-green-100', 'text-green-800');
        } else {
            formStatus.classList.add('bg-red-100', 'text-red-800');
        }

        formStatus.textContent = message;
        formStatus.style.border = '2px solid';
        formStatus.style.borderColor = type === 'success' ? '#10B981' : '#EF4444';

        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide message after 10 seconds
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 10000);
    }

    // ==================== TYPING EFFECT ====================
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const roles = [
            'Full Stack Cloud Engineer',
            'AI & ML Specialist',
            'AWS Certified Developer',
            'Data Science Expert',
            'Software Architect'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 150;

        function typeText() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at end
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500;
            }

            setTimeout(typeText, typingSpeed);
        }

        // Start typing effect after initial animation
        setTimeout(() => {
            typeText();
        }, 2000);
    }

    // ==================== STAT COUNTER ANIMATION ====================
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = current + (element.textContent.includes('+') ? '+' : '');

            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const hasPlus = text.includes('+');
                const value = parseInt(text.replace('+', ''));

                animateValue(target, 0, value, 2000);
                target.textContent = value + (hasPlus ? '+' : '');

                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ==================== PARALLAX EFFECT FOR HERO SECTION ====================
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('#home');

        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // ==================== CURSOR EFFECT (Optional) ====================
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.5);
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            display: none;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Expand cursor on clickable elements
        const clickables = document.querySelectorAll('a, button, .skill-badge, .project-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'rgba(139, 92, 246, 0.5)';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(59, 130, 246, 0.5)';
            });
        });
    }

    // ==================== CONSOLE MESSAGE ====================
    console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #3B82F6;');
    console.log('%cI see you\'re curious about how this website works! 🚀', 'font-size: 14px; color: #6B7280;');
    console.log('%cFeel free to reach out if you want to collaborate or chat about tech!', 'font-size: 14px; color: #6B7280;');
    console.log('%cEmail: surajmalthumkar8@gmail.com', 'font-size: 14px; color: #3B82F6; font-weight: bold;');
    console.log('%cLinkedIn: https://www.linkedin.com/in/surajmalthumkar8', 'font-size: 14px; color: #3B82F6; font-weight: bold;');

    // ==================== PAGE LOAD ANIMATION ====================
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ==================== PREVENT FORM DOUBLE SUBMISSION ====================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn.disabled) {
                e.preventDefault();
                return false;
            }
        });
    });

    // ==================== ANALYTICS (Optional - Add your tracking ID) ====================
    // Google Analytics Event Tracking
    const trackEvent = (category, action, label) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    };

    // Track navigation clicks
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Navigation', 'click', this.textContent);
        });
    });

    // Track social media clicks
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('Social', 'click', this.textContent);
        });
    });

    // Track project clicks
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Projects', 'click', this.closest('.project-card').querySelector('.project-title').textContent);
        });
    });

    // ==================== PERFORMANCE MONITORING ====================
    if ('performance' in window && 'getEntriesByType' in performance) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
            }, 0);
        });
    }

    // ==================== EASTER EGG ====================
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
            console.log('%c🎉 Konami Code Activated! You found the easter egg!', 'font-size: 20px; font-weight: bold; color: #10B981;');
            console.log('%c💼 I love working with curious developers like you!', 'font-size: 14px; color: #3B82F6;');

            // Add a fun visual effect
            document.body.style.animation = 'gradient-shift 2s ease infinite';
        }
    });
});
