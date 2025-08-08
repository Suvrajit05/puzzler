// Main JavaScript for Puzzler23

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Smooth scrolling for anchor links
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

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
        alerts.forEach(function(alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);

    // Add loading animation to buttons on form submit
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                submitBtn.disabled = true;
                
                // Re-enable button after 5 seconds as fallback
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    });

    // Add confirmation dialogs to delete buttons
    document.querySelectorAll('form[action*="DELETE"], .delete-btn').forEach(element => {
        element.addEventListener('submit', function(e) {
            if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });

    // Auto-focus first input in forms
    const firstInput = document.querySelector('form input:not([type="hidden"]):not([readonly]), form textarea:not([readonly])');
    if (firstInput) {
        firstInput.focus();
    }

    // Add character counter to textareas
    document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const counter = document.createElement('small');
        counter.className = 'form-text text-muted character-counter';
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.className = remaining < 20 ? 'form-text text-warning character-counter' : 'form-text text-muted character-counter';
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });

    // Enhanced navigation highlighting
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath !== '/' && link.getAttribute('href') !== '/' && currentPath.startsWith(link.getAttribute('href')))) {
            link.classList.add('active');
        }
    });

    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Utility Functions

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1050';
    document.body.appendChild(container);
    return container;
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy to clipboard', 'danger');
    });
}

// Format time duration
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Debounce function for search inputs
function debounce(func, wait) {
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

// Game-specific utilities
const GameUtils = {
    // Start timer
    startTimer: function(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let seconds = 0;
        const timer = setInterval(() => {
            seconds++;
            element.textContent = formatDuration(seconds);
        }, 1000);
        
        return {
            stop: () => clearInterval(timer),
            getTime: () => seconds
        };
    },
    
    // Animate score change
    animateScore: function(elementId, newScore) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentScore = parseInt(element.textContent) || 0;
        const difference = newScore - currentScore;
        
        if (difference !== 0) {
            element.style.transform = 'scale(1.2)';
            element.style.color = difference > 0 ? '#28a745' : '#dc3545';
            
            setTimeout(() => {
                element.textContent = newScore;
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 300);
        }
    },
    
    // Shake element for wrong answer
    shakeElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
};

// Add shake animation CSS
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);
