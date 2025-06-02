
  // products.js
  document.addEventListener('DOMContentLoaded', function () {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');

          // Special handling for header underline animation
          if (entry.target.tagName === 'H2') {
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, 300);
          }
        }
      });
    }, observerOptions);

    // Observe all animate elements
    const animateElements = document.querySelectorAll('.animate-element');
    animateElements.forEach((el) => observer.observe(el));

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((card) => {
      card.addEventListener('mouseenter', function () {
        this.classList.add('card-hover');
      });

      card.addEventListener('mouseleave', function () {
        this.classList.remove('card-hover');
      });
    });

    // Button interactions
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach((button) => {
      button.addEventListener('click', function (e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);

        // Handle button actions
        const buttonText = this.textContent.trim();
        switch (buttonText) {
          case 'Learn More':
            handleLearnMore(this);
            break;
          case 'Try Demo':
            handleTryDemo();
            break;
          case 'Request Quote':
            handleRequestQuote();
            break;
          default:
            break;
        }
      });
    });

    // Feature tag animations
    const featureTags = document.querySelectorAll('.feature-tag');
    featureTags.forEach((tag, index) => {
      tag.style.animationDelay = `${index * 0.1}s`;
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });

    // Parallax effect for background elements
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.lottie-container');

      parallaxElements.forEach((element) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  });

  // Button action handlers
  function handleLearnMore(button) {
    const productCard = button.closest('.product-card');
    const productTitle = productCard.querySelector('h3').textContent;

    // Add loading state
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;

      // In a real application, you would navigate to the product page
      console.log(`Learn more about: ${productTitle}`);
      // window.location.href = `/products/${productTitle.toLowerCase().replace(/\s+/g, '-')}`;
    }, 1000);
  }

  function handleTryDemo() {
    // Add demo modal or redirect logic
    console.log('Opening Qifess Field Service demo...');
    // In a real application:
    // window.open('/demo/qifess-field-service', '_blank');
  }

  function handleRequestQuote() {
    // Add quote request modal or redirect logic
    console.log('Opening quote request for ProtectQube Security...');
    // In a real application:
    // window.location.href = '/quote?product=protectqube-security';
  }

  // Add ripple effect CSS dynamically
  const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

  // Inject ripple CSS
  const style = document.createElement('style');
  style.textContent = rippleCSS;
  document.head.appendChild(style);

  // Performance optimization: Throttle scroll events
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply throttling to scroll events
  const throttledScrollHandler = throttle(() => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.lottie-container');

    parallaxElements.forEach((element) => {
      const speed = 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }, 16); // ~60fps

  window.addEventListener('scroll', throttledScrollHandler);
