document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
});

async function loadComponents() {
    try {
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok) {
            throw new Error("Failed to load components");
        }

        const headerHtml = await headerResponse.text();
        const footerHtml = await footerResponse.text();

        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

        // Initialize events after components are loaded
        initializeEvents();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function initializeEvents() {
    // Simple JS for mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function () {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const nav = document.querySelector('.nav');
            if (nav) {
                nav.classList.remove('active');
                const btn = document.querySelector('.mobile-menu-btn');
                if (btn) btn.classList.remove('active');
            }
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}
