// Pricing page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize pricing toggle
    initPricingToggle();
});

/**
 * Initialize pricing toggle between monthly and annual billing
 */
function initPricingToggle() {
    const billingToggle = document.getElementById('billing-toggle');
    const monthlyOption = document.querySelector('.toggle-option:first-child');
    const annualOption = document.querySelector('.toggle-option:last-child');
    
    // Price elements
    const priceElements = document.querySelectorAll('.amount');
    
    // Store original monthly prices
    const monthlyPrices = [];
    priceElements.forEach(element => {
        const price = parseFloat(element.textContent.replace('$', ''));
        monthlyPrices.push(price);
    });
    
    // Toggle between monthly and annual pricing
    billingToggle.addEventListener('change', function() {
        const isAnnual = this.checked;
        
        // Update toggle UI
        if (isAnnual) {
            monthlyOption.classList.remove('active');
            annualOption.classList.add('active');
        } else {
            monthlyOption.classList.add('active');
            annualOption.classList.remove('active');
        }
        
        // Update prices
        priceElements.forEach((element, index) => {
            const monthlyPrice = monthlyPrices[index];
            const annualPrice = Math.round(monthlyPrice * 0.8); // 20% discount for annual
            
            if (isAnnual) {
                element.textContent = '$' + annualPrice;
                // Update period text
                const periodElement = element.nextElementSibling;
                if (periodElement && periodElement.classList.contains('period')) {
                    periodElement.textContent = '/month (billed annually)';
                }
            } else {
                element.textContent = '$' + monthlyPrice;
                // Reset period text
                const periodElement = element.nextElementSibling;
                if (periodElement && periodElement.classList.contains('period')) {
                    periodElement.textContent = '/month';
                }
            }
        });
    });
    
    // Allow clicking the toggle labels to change the toggle state
    monthlyOption.addEventListener('click', function() {
        billingToggle.checked = false;
        billingToggle.dispatchEvent(new Event('change'));
    });
    
    annualOption.addEventListener('click', function() {
        billingToggle.checked = true;
        billingToggle.dispatchEvent(new Event('change'));
    });
}

/**
 * Add animation to pricing cards
 */
function initPricingCardAnimations() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach((card, index) => {
        // Add staggered animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1 + 0.2}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            if (card.classList.contains('popular')) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'translateY(0)';
            }
        }, 100);
    });
}

// Initialize pricing card animations
document.addEventListener('DOMContentLoaded', function() {
    initPricingCardAnimations();
}); 