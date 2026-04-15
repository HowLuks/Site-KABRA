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
    // Modal Close Logic
    const modal = document.getElementById('lead-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // Handle form submission
        const form = document.getElementById('lead-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Formulário recebido! (Em produção, conecte à API).');
                modal.classList.remove('active');
                form.reset();
            });
        }
    }

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

            // Modal intercept
            if (targetId === '#contato' || targetId === '#modal' || this.classList.contains('open-modal')) {
                const modal = document.getElementById('lead-modal');
                if (modal) {
                    modal.classList.add('active');
                    return;
                }
            }

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
