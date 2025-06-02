// products.js - Animation and interaction handler for ProductSection

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for section title line animation
                if (entry.target.classList.contains('section-title')) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 300);
                }
            }
        });
    }, observerOptions);

    // Observe all animate elements
    const animateElements = document.querySelectorAll('.animate-element');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Add smooth hover effects for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return; // Skip if clicking buttons
            
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(67, 56, 202, 0.1);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Enhanced hover animations for feature pills
        const featurePills = card.querySelectorAll('.feature-pill');
        featurePills.forEach((pill, index) => {
            pill.style.transitionDelay = `${index * 0.05}s`;
        });
    });

    // Button interaction enhancements
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        // Add loading state simulation for primary buttons
        if (button.classList.contains('btn-primary')) {
            button.addEventListener('click', function(e) {
                // Prevent default for demo purposes
                // e.preventDefault();
                
                const originalText = button.innerHTML;
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                
                // Add subtle pulse effect
                button.style.animation = 'pulse 0.3s ease-in-out';
                
                setTimeout(() => {
                    button.style.animation = '';
                }, 300);
            });
        }

        // Add focus handling for accessibility
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid rgba(67, 56, 202, 0.5)';
            this.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Parallax effect for section background (subtle)
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const productsSection = document.querySelector('.products-section');
        
        if (productsSection) {
            const rate = scrolled * -0.5;
            productsSection.style.backgroundPosition = `center ${rate}px`;
        }
        
        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Add scroll listener for parallax (optional)
    window.addEventListener('scroll', requestParallaxUpdate);

    // Add CSS animations keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }

        /* Enhanced focus states */
        .btn-primary:focus-visible,
        .btn-secondary:focus-visible {
            outline: 2px solid rgba(67, 56, 202, 0.6);
            outline-offset: 2px;
        }

        /* Smooth transitions for all interactive elements */
        .product-card * {
            transition-property: transform, color, background-color, border-color, box-shadow;
            transition-duration: 0.2s;
            transition-timing-function: ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Initialize any additional product-specific features
    initializeProductFeatures();
});

// Additional product-specific functionality
function initializeProductFeatures() {
    // Add logo animation on hover
    const productLogos = document.querySelectorAll('.product-logo img');
    productLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add category badge animation
    const categoryBadges = document.querySelectorAll('.product-category');
    categoryBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.color = '#4338ca';
            this.style.transform = 'translateY(-1px)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.color = '';
            this.style.transform = 'translateY(0)';
        });
    });

}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeProductFeatures };
}