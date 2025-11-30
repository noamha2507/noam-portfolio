// ============================================
// Custom Cursor
// ============================================

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    if (cursorDot && cursorOutline) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay for the outline to create a trailing effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    }
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card-premium, .journey-card, .bento-cell');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorOutline) cursorOutline.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
        if (cursorOutline) cursorOutline.classList.remove('hovered');
    });
});

// ============================================
// Spotlight Effect
// ============================================

const spotlightGroups = document.querySelectorAll('.spotlight-group');

spotlightGroups.forEach(group => {
    group.addEventListener('mousemove', (e) => {
        const rect = group.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        group.style.setProperty('--mouse-x', `${x}px`);
        group.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ============================================
// Magnetic Buttons
// ============================================

const magneticButtons = document.querySelectorAll('.btn-magnetic');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);

            // Trigger number counter if it's a stat box
            if (entry.target.classList.contains('cell-stat')) {
                const numberElement = entry.target.querySelector('.stat-num');
                if (numberElement) {
                    animateValue(numberElement, 0, parseInt(numberElement.getAttribute('data-target')), 2000);
                }
            }
        }
    });
}, observerOptions);

// Elements to animate
document.querySelectorAll('.bento-cell, .journey-card, .project-card-premium, .section-title, .contact-minimal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add class for animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

// ============================================
// Number Counter Animation
// ============================================

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + (end > 10 ? '+' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ============================================
// Navbar Scroll Effect
// ============================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// Mobile Menu Toggle
// ============================================

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            // Reset hamburger
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ============================================
// Gallery Rail Hover Scroll
// ============================================

const galleryRails = document.querySelectorAll('.project-gallery-rail');

galleryRails.forEach(rail => {
    let scrollInterval;
    const scrollSpeed = 5; // Adjust speed as needed
    const edgeThreshold = 50; // Distance from edge to trigger scroll

    rail.addEventListener('mousemove', (e) => {
        const rect = rail.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Clear existing interval to prevent stacking
        clearInterval(scrollInterval);

        if (x < edgeThreshold) {
            // Scroll Left
            scrollInterval = setInterval(() => {
                rail.scrollLeft -= scrollSpeed;
            }, 10);
        } else if (x > rect.width - edgeThreshold) {
            // Scroll Right
            scrollInterval = setInterval(() => {
                rail.scrollLeft += scrollSpeed;
            }, 10);
        }
    });

    rail.addEventListener('mouseleave', () => {
        clearInterval(scrollInterval);
    });
});
