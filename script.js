document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const content = document.getElementById('content');
    const progressBar = document.querySelector('.progress');
    
    // Simulate loading progress (in a real scenario, you'd track actual assets)
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressBar.style.width = `${progress}%`;
    }, 200);
    
    // Hide loading screen when everything is loaded
    window.addEventListener('load', function() {
        // Ensure minimum display time for branding (1.5s)
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            
            // After fade out completes, hide loading screen and show content
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                content.classList.remove('hidden');
                
                // Add loaded class to trigger animations
                document.body.classList.add('loaded');
            }, 800); // Match this with CSS transition duration
        }, 1500);
    });
    
    // Fallback in case load event doesn't fire
    setTimeout(() => {
        if (loadingScreen.style.opacity !== '0') {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                content.classList.remove('hidden');
                document.body.classList.add('loaded');
            }, 800);
        }
    }, 5000); // 5 second fallback
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to nav links when scrolling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            const response = await fetch('process_contact.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                contactForm.reset();
                showNotification('Message sent successfully!', 'success');
            } else {
                showNotification(result.message || 'Error sending message', 'error');
            }
        } catch (error) {
            showNotification('Network error. Please try again.', 'error');
            console.error('Error:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function handlePortfolioClick(event) {
    event.preventDefault();
    
    // Get or create notification element
    let notification = document.getElementById('portfolio-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'portfolio-notification';
        notification.className = 'portfolio-notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and show
    notification.textContent = "Oops! You're already on this site!";
    notification.classList.remove('hidden');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
    
    // Scroll to top with smooth behavior
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Visual feedback on project card
    const projectCard = event.target.closest('.project-card');
    if (projectCard) {
        projectCard.style.transform = 'scale(1.02)';
        projectCard.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        setTimeout(() => {
            projectCard.style.transform = '';
            projectCard.style.boxShadow = '';
        }, 300);
    }
}