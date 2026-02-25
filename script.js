/**
 * NIVIA TECH - Enhanced Professional Script Module
 * Features: Precision Scrolling, Fluid Counters, Cinematic Sliders, and Showcase Auto-Cycle
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INITIALIZE AOS (Animate On Scroll) ---
    // We check if AOS exists to prevent console errors
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-quint',
            offset: 100,
            mirror: false
        });
    }

    // --- 2. CINEMATIC HERO SLIDER ---
    const initHeroSlider = () => {
        const slides = document.querySelectorAll(".slide");
        if (slides.length === 0) return;

        let index = 0;
        const slideInterval = 6000;

        const nextSlide = () => {
            slides[index].classList.remove("active");
            index = (index + 1) % slides.length;
            slides[index].classList.add("active");
        };

        // Subtle Parallax on Mouse Move for Hero Content (Desktop Only)
        const hero = document.querySelector('.hero');
        if (hero && window.innerWidth > 1024) {
            hero.addEventListener('mousemove', (e) => {
                const moveX = (e.clientX - window.innerWidth / 2) / 60;
                const moveY = (e.clientY - window.innerHeight / 2) / 60;
                const overlays = document.querySelectorAll('.overlay');
                overlays.forEach(overlay => {
                    overlay.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
        }

        setInterval(nextSlide, slideInterval);
    };

    // --- 3. FLUID STAT COUNTERS ---
    // Uses requestAnimationFrame for a silky smooth 60fps counting effect
    const initStatCounters = () => {
        const stats = document.querySelectorAll('.stat-number');
        
        const animateValue = (obj, start, end, duration, suffix) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = progress * (end - start) + start;
                
                // Format decimal for precision stats (like 99.9)
                const formattedValue = end % 1 === 0 ? Math.floor(value) : value.toFixed(1);
                obj.innerHTML = formattedValue + suffix;
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    // Extract number and suffix (e.g., "99.9" and "%")
                    const endVal = parseFloat(targetEl.innerText.replace(/[^0-9.]/g, ''));
                    const suffix = targetEl.innerText.replace(/[0-9.]/g, '');
                    
                    animateValue(targetEl, 0, endVal, 2000, suffix);
                    observer.unobserve(targetEl);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    };

    // --- 4. INTERACTIVE SERVERLESS SHOWCASE (FIXED SHAKING) ---
    const showcaseData = {
        speed: {
            title: "Lightning Speed",
            desc: "Your site loads instantly from the nearest global node, ensuring no customer leaves due to slow loading times.",
            img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
        },
        security: {
            title: "Bulletproof Security",
            desc: "By eliminating traditional databases, we remove the risk of SQL injections or server-side hacking. Your data remains untouchable.",
            img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
        },
        eco: {
            title: "Eco-Friendly & Efficient",
            desc: "Resources are only used when a visitor clicks, making it the smartest, most cost-effective, and sustainable way to host.",
            img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
        }
    };

    const domains = ['speed', 'security', 'eco'];
    let currentDomainIndex = 0;

    window.switchShowcase = (key, btn) => {
        const display = document.getElementById('showcaseDisplay');
        if (!key || !showcaseData[key] || !display) return;
        
        // Sync index if user clicked manually
        if (btn) currentDomainIndex = domains.indexOf(key);

        // Update Button Active States
        const buttons = document.querySelectorAll('.domain-btn');
        buttons.forEach(b => b.classList.remove('active'));
        
        // Find correct button if not passed directly (auto-cycle)
        const activeBtn = btn || Array.from(buttons).find(b => b.getAttribute('onclick')?.includes(`'${key}'`));
        if (activeBtn) activeBtn.classList.add('active');

        // Smooth "Fade & Glide" transition to mask content changes
        display.style.opacity = '0';
        display.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            document.getElementById('showcaseTitle').innerText = showcaseData[key].title;
            document.getElementById('showcaseDesc').innerText = showcaseData[key].desc;
            document.getElementById('showcaseImg').src = showcaseData[key].img;
            
            display.style.opacity = '1';
            display.style.transform = 'translateY(0)';
            display.style.transition = 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
        }, 300);
    };

    // Domain Auto-cycle every 7 seconds
    // --- IMPROVED AUTO-CYCLE WITH PAUSE ---
    let cycleInterval = setInterval(() => {
        currentDomainIndex = (currentDomainIndex + 1) % domains.length;
        window.switchShowcase(domains[currentDomainIndex]);
    }, 7000);

    // Stop auto-cycle if the user is interacting with the showcase
    const showcaseContainer = document.querySelector('.inner-showcase');
    if(showcaseContainer) {
        showcaseContainer.addEventListener('mouseenter', () => {
            clearInterval(cycleInterval); // Stops the timer
        });
        
        // Optional: Restart the timer when the mouse leaves
        showcaseContainer.addEventListener('mouseleave', () => {
            cycleInterval = setInterval(() => {
                currentDomainIndex = (currentDomainIndex + 1) % domains.length;
                window.switchShowcase(domains[currentDomainIndex]);
            }, 7000);
        });
    }

    // --- 5. PRECISION NAVIGATION & ACTIVE HIGHLIGHTING ---
    const handleNavigation = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar nav a');

        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId.startsWith("#") || targetId === "#") return;
                
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbar = document.querySelector('.navbar');
                    // Dynamic calculation of navbar height for perfect landing
                    const navHeight = navbar.getBoundingClientRect().height;
                    const offsetPosition = targetElement.offsetTop - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });

        // Scroll Logic: Navbar Shrink + Active Link Tracking
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const navbar = document.querySelector('.navbar');
            
            // Navbar Glassmorphism & Shrink Effect
            if (scrollY > 80) {
                navbar.style.background = "rgba(0, 0, 0, 0.95)";
                navbar.style.boxShadow = "0 10px 40px rgba(0,0,0,0.7)";
                navbar.style.height = "70px";
            } else {
                navbar.style.background = "rgba(0, 0, 0, 0.85)";
                navbar.style.boxShadow = "none";
                navbar.style.height = "85px";
            }

            // Scrollspy: Highlight correct menu item as you scroll
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 120;
                const sectionId = current.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    };
    // --- 6. MAGNETIC MARQUEE EFFECT ---
    // Makes industry tags "attracted" to the mouse for a premium interactive feel
    const initMagneticMarquee = () => {
        const marqueeSpans = document.querySelectorAll('.marquee-content span');
        
        marqueeSpans.forEach(span => {
            span.addEventListener('mousemove', (e) => {
                const rect = span.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Moves the span slightly toward the cursor
                span.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px) scale(1.15)`;
            });

            span.addEventListener('mouseleave', () => {
                // Snaps back to original position
                span.style.transform = `translate(0px, 0px) scale(1)`;
            });
        });
    };

    // --- INITIALIZE ALL MODULES ---
    // --- INITIALIZE ALL MODULES ---
    initHeroSlider();
    initStatCounters();
    handleNavigation();
    initMagneticMarquee(); // <--- Add this line
});
