// Fitness Coach Website JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Smooth scroll offset for fixed navbar
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
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
    
    // Form submission handler
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            goal: formData.get('goal'),
            message: formData.get('message'),
            timestamp: new Date().toLocaleString()
        };
        
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
                mode: 'no-cors', // Important for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Since we're using no-cors, we won't get a readable response
            // Assume success if no error is thrown
            showFormStatus('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            showFormStatus('error', 'Sorry, there was an error sending your message. Please try again later.');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    
    // Function to show form status messages
    function showFormStatus(type, message) {
        formStatus.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'text-green-800', 'text-red-800');
        
        if (type === 'success') {
            formStatus.classList.add('bg-green-100', 'text-green-800');
        } else {
            formStatus.classList.add('bg-red-100', 'text-red-800');
        }
        
        formStatus.textContent = message;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 5000);
    }
    
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const navHeight = document.querySelector('nav').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                // Remove active class from all links
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('text-blue-400');
                });
                
                // Add active class to current section link
                document.querySelectorAll(`nav a[href="#${sectionId}"]`).forEach(link => {
                    link.classList.add('text-blue-400');
                });
            }
        });
    });
});