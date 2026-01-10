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

// Start everything on Load
document.addEventListener("DOMContentLoaded", () => {
    type();
    initTilt();
    initHeroGlow();
    initContactForm();
});