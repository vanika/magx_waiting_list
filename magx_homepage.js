// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sticky header
    initStickyHeader();
    
    // Initialize dropdown functionality for nav items
    initDropdowns();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize FAQ functionality
    initFAQ();
        
    // Re-adjust on resize
    window.addEventListener('resize', function() {
        checkMobileMenu();
    });
});

/**
 * Initialize sticky header with scroll-triggered class
 */
function initStickyHeader() {
    const header = document.querySelector('.navbar');
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('navbar-scrolled');
        } else {
            header.classList.remove('navbar-scrolled');
        }
    });
    
    // Trigger scroll check immediately to set initial state
    if (window.scrollY > scrollThreshold) {
        header.classList.add('navbar-scrolled');
    }
}

/**
 * Initialize dropdown functionality for nav items
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const link = this.querySelector('a');
            if (link) {
                link.style.color = '#000000';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            const link = this.querySelector('a');
            if (link) {
                link.style.color = '';
            }
        });
    });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatableElements = [
        ...document.querySelectorAll('h1, .hero-subtitle, .pricing-info'),
        ...document.querySelectorAll('.cta-buttons, .social-proof'),
        ...document.querySelectorAll('.step-card'),
        ...document.querySelectorAll('.logo-item')
    ];
    
    // Add initial classes with sequential delays for hero elements
    const heroElements = [
        document.querySelector('h1'),
        document.querySelector('.hero-subtitle'),
        document.querySelector('.pricing-info'),
        document.querySelector('.cta-buttons'),
        document.querySelector('.social-proof')
    ];
    
    // Add staggered animation for hero elements
    heroElements.forEach((el, index) => {
        if (el) {
            el.classList.add('animate-on-scroll');
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.transitionDelay = `${index * 0.1}s`;
        }
    });
    
    // Add animation for non-hero elements
    animatableElements.forEach(el => {
        if (!heroElements.includes(el)) {
            el.classList.add('animate-on-scroll');
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && 
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll events
    function handleScrollAnimation() {
        animatableElements.forEach(element => {
            if (isInViewport(element) && element.style.opacity === '0') {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Trigger once on load to show elements already in view
    setTimeout(handleScrollAnimation, 100);
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('mobile-menu-open');
            this.classList.toggle('active');
            
            // Toggle aria-expanded for accessibility
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
        });
    }
    
    // Check initial state
    checkMobileMenu();
}

/**
 * Check and adjust mobile menu based on screen width
 */
function checkMobileMenu() {
    const isMobile = window.innerWidth <= 768;
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!isMobile && document.body.classList.contains('mobile-menu-open')) {
        document.body.classList.remove('mobile-menu-open');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
    }
}

/**
 * Initialize FAQ toggle functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close any open FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle the clicked item
                item.classList.toggle('active');
            });
        }
    });
}