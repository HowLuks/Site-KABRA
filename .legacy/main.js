document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
});

async function loadComponents() {
    try {
        const [headerResponse, footerResponse, popupResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html'),
            fetch('popup.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok || !popupResponse.ok) {
            throw new Error("Failed to load components");
        }

        const headerHtml = await headerResponse.text();
        const footerHtml = await footerResponse.text();
        const popupHtml = await popupResponse.text();

        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

        const popupPlaceholder = document.getElementById('popup-placeholder');
        if (popupPlaceholder) popupPlaceholder.innerHTML = popupHtml;

        // Initialize events after components are loaded
        initializeEvents();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function initializeEvents() {
    // Modal Logic
    const modal = document.getElementById('lead-modal');
    if (modal) {
        // Auto-show popup (delayed by a short moment for a smoother feel)
        setTimeout(() => {
            modal.classList.add('active');
        }, 800);

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // Handle form submission (Popup)
        const form = document.getElementById('lead-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const btnSubmit = form.querySelector('.btn-submit');
                const origText = btnSubmit ? btnSubmit.textContent : '';
                if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = "Aguarde..."; }

                const emailInput = form.querySelector('input[name="email"]');
                const nomeInput = form.querySelector('input[name="nome"]');
                const telInput = form.querySelector('input[name="telefone"]');
                const empInput = form.querySelector('input[name="empresa"]');
                const cargoInput = form.querySelector('input[name="cargo"]');
                const classif = form.querySelector('select[name="classificacao"]');

                if (window.supabaseClient) {
                    await window.supabaseClient.from('submissions').insert([{
                        email: emailInput ? emailInput.value : '',
                        name: nomeInput ? nomeInput.value : '',
                        phone: telInput ? telInput.value : '',
                        company: empInput ? empInput.value : '',
                        role: cargoInput ? cargoInput.value : '',
                        classification: classif ? classif.value : '',
                        origin: 'popup',
                        status: 'new'
                    }]);
                } else {
                    console.warn('Supabase não conectado. Não foi possível inserir dados no banco.');
                }

                alert('Obrigado! Entraremos em contato em breve.');
                modal.classList.remove('active');
                form.reset();
                if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = origText; }
            });
        }

        // CTA Form Setup
        const ctaForm = document.getElementById('cta-form');
        if (ctaForm) {
            ctaForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const btnSubmit = ctaForm.querySelector('.btn-submit');
                const origText = btnSubmit ? btnSubmit.textContent : '';
                if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = "Aguarde..."; }

                const emailInput = ctaForm.querySelector('input[type="email"]');
                if (window.supabaseClient && emailInput && emailInput.value) {
                    await window.supabaseClient.from('submissions').insert([{
                        email: emailInput.value,
                        origin: 'cta-header',
                        status: 'new'
                    }]);
                }

                alert('Obrigado! Nossa equipe vai acelerar com você em breve.');
                ctaForm.reset();
                if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = origText; }
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
