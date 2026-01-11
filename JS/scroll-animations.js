// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        } else {
            entry.target.classList.remove('animate-in');
        }
    });
}, observerOptions);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Observe all sections and major elements
    const elementsToAnimate = document.querySelectorAll('section, .skill-item, .project, .edu-card');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // Special handling for skill progress bars
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-line span');
                if (progressBar) {
                    progressBar.style.animationPlayState = 'running';
                }
            } else {
                const progressBar = entry.target.querySelector('.progress-line span');
                if (progressBar) {
                    progressBar.style.animationPlayState = 'paused';
                    progressBar.style.animation = 'none';
                    setTimeout(() => {
                        progressBar.style.animation = 'slideIn 1.5s ease-out forwards';
                    }, 10);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.skill-item').forEach(skill => {
        skillObserver.observe(skill);
    });
});