const roles = ["Web Developer", "Mobile Developer", "Full-Stack Developer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 150;
const deletingSpeed = 75;
const pauseTime = 2000; 

// --- TYPING ANIMATION ---
function type() {
    const currentRole = roles[roleIndex];
    const rolesSpan = document.getElementById("roles");
    if (!rolesSpan) return;

    if (isDeleting) {
        rolesSpan.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        rolesSpan.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let dynamicSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
        dynamicSpeed = pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        dynamicSpeed = 500;
    }
    setTimeout(type, dynamicSpeed);
}

// --- 3D TILT INTERACTION ---
function initTilt() {
    const card = document.getElementById('profile-card');
    const wrapper = document.querySelector('.about-image-wrapper');
    if (!card || !wrapper) return;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        card.style.transition = "transform 0.6s ease";
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });

    wrapper.addEventListener('mouseenter', () => {
        card.style.transition = "transform 0.1s ease-out";
    });
}

// --- HERO BACKGROUND MOUSE TRACKING ---
function initHeroGlow() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        hero.style.setProperty('--x', `${x}px`);
        hero.style.setProperty('--y', `${y}px`);
    });
}

// --- LIVE CONTACT FORM WITH EMAILJS ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    const card = document.querySelector('.contact-card');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const btn = form.querySelector('.submit-btn');
        const originalContent = btn.innerHTML;

        // Change button to loading state
        btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        // Your specific EmailJS credentials
        const serviceID = 'service_zt98rvb';
        const templateID = 'template_31wz4rp';

        emailjs.sendForm(serviceID, templateID, form)
            .then(() => {
                // Success UI update
                btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
                btn.style.backgroundColor = '#6F8F7B';
                card.classList.add('sent');
                
                form.reset();

                // Reset button appearance after 4 seconds
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    card.classList.remove('sent');
                }, 4000);
            }, (err) => {
                // Error handling
                alert("Failed to send message. Please try again later.");
                console.error("EmailJS Error:", err);
                btn.innerHTML = '<span>Error!</span>';
                btn.disabled = false;
                btn.style.opacity = '1';
            });
    });
}

// --- SMOOTH PROJECT EXPANSION ANIMATION ---
function initProjectAnimation() {
    const projectsSection = document.getElementById('projects');
    const projectContainers = document.querySelectorAll('.project-minimized');
    
    if (!projectsSection || !projectContainers.length) return;

    let animationFrame;
    let currentMargin = 0;
    const targetMargin = 400;
    
    function animateMargin(target, duration = 800) {
        const startMargin = currentMargin;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function (ease-out-cubic)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            currentMargin = startMargin + (target - startMargin) * easeProgress;
            projectsSection.style.marginBottom = `${currentMargin}px`;
            
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        }
        
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(animate);
    }
    
    function animateProjectContent(container, show, duration = 800) {
        const icon = container.querySelector('.project-icon');
        const expanded = container.querySelector('.project-expanded');
        
        if (!icon || !expanded) return;
        
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            if (show) {
                expanded.style.visibility = 'visible';
                expanded.style.opacity = easeProgress;
                icon.style.opacity = 1 - easeProgress;
                if (easeProgress > 0.5) icon.style.visibility = 'hidden';
            } else {
                icon.style.visibility = 'visible';
                icon.style.opacity = easeProgress;
                expanded.style.opacity = 1 - easeProgress;
                if (easeProgress > 0.5) expanded.style.visibility = 'hidden';
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    projectContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            animateMargin(targetMargin);
            animateProjectContent(container, true);
        });
        
        container.addEventListener('mouseleave', () => {
            animateMargin(0);
            animateProjectContent(container, false);
        });
    });
}

// --- FLOATING ICONS CURSOR AVOIDANCE ---
function initFloatingIconsAvoidance() {
    const skillsSection = document.getElementById('skills');
    const toolIcons = document.querySelectorAll('.tool-icon');
    
    if (!skillsSection || !toolIcons.length) return;

    let mouseX = 0;
    let mouseY = 0;
    let isActive = false;
    let animationId;

    function updateIconPositions() {
        if (!isActive) return;
        
        toolIcons.forEach((icon, index) => {
            const iconRect = icon.getBoundingClientRect();
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top + iconRect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - iconCenterX, 2) + Math.pow(mouseY - iconCenterY, 2)
            );
            
            const avoidanceRadius = 150;
            
            if (distance < avoidanceRadius && distance > 0) {
                const angle = Math.atan2(iconCenterY - mouseY, iconCenterX - mouseX);
                const force = (avoidanceRadius - distance) / avoidanceRadius;
                const moveX = Math.cos(angle) * force * 60;
                const moveY = Math.sin(angle) * force * 60;
                
                icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                icon.style.transform = 'translate(0px, 0px)';
            }
        });
        
        if (isActive) {
            animationId = requestAnimationFrame(updateIconPositions);
        }
    }

    skillsSection.addEventListener('mouseenter', () => {
        isActive = true;
        if (animationId) cancelAnimationFrame(animationId);
        updateIconPositions();
    });

    skillsSection.addEventListener('mouseleave', () => {
        isActive = false;
        if (animationId) cancelAnimationFrame(animationId);
        toolIcons.forEach(icon => {
            icon.style.transform = 'translate(0px, 0px)';
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isActive) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
    });
}

// Start everything on Load
document.addEventListener("DOMContentLoaded", () => {
    type();
    initTilt();
    initHeroGlow();
    initContactForm();
    initProjectAnimation();
    initFloatingIconsAvoidance();
});