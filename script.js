// Theme management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add keyboard support
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update button aria-label
        const isLight = theme === 'light';
        this.themeToggle.setAttribute('aria-label', 
            isLight ? 'Switch to dark mode' : 'Switch to light mode'
        );
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        this.themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 150);
    }
}

// Animation utilities
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffect();
        this.setupCardAnimations();
    }

    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe all cards and sections
        const cards = document.querySelectorAll('.product-card');
        const hero = document.querySelector('.hero');
        
        cards.forEach(card => observer.observe(card));
        if (hero) observer.observe(hero);
    }

    setupParallaxEffect() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    setupCardAnimations() {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach((card, index) => {
            // Add staggered animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover sound effect (visual feedback)
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
            
            // Add click animation for buttons
            const button = card.querySelector('.btn-primary');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Create ripple effect
                    const ripple = document.createElement('span');
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: ripple 0.6s ease-out;
                        pointer-events: none;
                    `;
                    
                    button.style.position = 'relative';
                    button.style.overflow = 'hidden';
                    button.appendChild(ripple);
                    
                    // Remove ripple after animation
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                    
                    // Simulate product view (you can replace this with actual functionality)
                    this.showProductModal(card);
                });
            }
        });
    }

    showProductModal(card) {
        const title = card.querySelector('.card-title').textContent;
        const description = card.querySelector('.card-description').textContent;
        const price = card.querySelector('.price-current').textContent;
        
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.innerHTML = `
            <strong>Product Details</strong><br>
            ${title} - ${price}<br>
            <small>Click outside to close</small>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 3 seconds or on click
        const removeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        };
        
        setTimeout(removeNotification, 3000);
        notification.addEventListener('click', removeNotification);
    }
}

// Performance and accessibility utilities
class UtilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupKeyboardNavigation();
        this.setupReducedMotion();
        this.setupErrorHandling();
    }

    setupLazyLoading() {
        if (!window.IntersectionObserver) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupKeyboardNavigation() {
        // Ensure all interactive elements are keyboard accessible
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const button = card.querySelector('.btn-primary');
                    if (button) {
                        button.click();
                    }
                }
            });
        });
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }
        
        prefersReducedMotion.addEventListener('change', () => {
            const duration = prefersReducedMotion.matches ? '0.01ms' : '';
            document.documentElement.style.setProperty('--animation-duration', duration);
        });
    }

    setupErrorHandling() {
        // Handle image loading errors
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.style.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0)';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.innerHTML = '<span style="color: #666;">Image not available</span>';
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const themeManager = new ThemeManager();
    const animationManager = new AnimationManager();
    const utilityManager = new UtilityManager();
    
    // Add custom CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.8s ease forwards !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .animate-in {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger any additional animations after full load
        setTimeout(() => {
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    });
    
    // Add smooth scroll for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('🎉 Product Showcase Gallery initialized successfully!');
});
