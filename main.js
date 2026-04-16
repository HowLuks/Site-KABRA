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
        let currentLeadId = null;

        if (form) {
            const step1 = document.getElementById('form-step-1');
            const step2 = document.getElementById('form-step-2');
            const btnNext = document.getElementById('btn-next-step');

            // Handle step 1 to step 2 transition
            if (btnNext) {
                btnNext.addEventListener('click', async () => {
                    const emailInput = form.querySelector('input[name="email"]');
                    const nomeInput = form.querySelector('input[name="nome"]');
                    const telInput = form.querySelector('input[name="telefone"]');

                    // HTML5 validation for Step 1
                    if (!emailInput.reportValidity() || !nomeInput.reportValidity() || !telInput.reportValidity()) return;

                    const origText = btnNext.textContent;
                    btnNext.disabled = true;
                    btnNext.textContent = "Salvando...";

                    if (window.supabaseClient) {
                        try {
                            const { data, error } = await window.supabaseClient.from('submissions').insert([{
                                email: emailInput.value,
                                name: nomeInput.value,
                                phone: telInput.value,
                                origin: 'popup',
                                status: 'new',
                                completed_second_step: false
                            }]).select();

                            if (data && data.length > 0) {
                                currentLeadId = data[0].id;
                            }
                            if (error) {
                                alert("Erro Supabase Etapa 1: " + error.message);
                                console.error('Erro detalhado etapa 1:', error);
                            }
                        } catch (err) {
                            alert("Erro de código na etapa 1: " + err.message);
                            console.error('Erro ao salvar etapa 1', err);
                        }
                    } else {
                        console.warn('Supabase não conectado na etapa 1.');
                    }

                    // Prossiga para a etapa 2 de qualquer forma
                    btnNext.textContent = origText;
                    btnNext.disabled = false;
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                });
            }

            // Handle Final Submission (Step 2)
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const btnSubmit = document.getElementById('btn-final-step');
                const origText = btnSubmit ? btnSubmit.textContent : '';
                if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = "Aguarde..."; }

                const empInput = form.querySelector('input[name="empresa"]');
                const cargoInput = form.querySelector('input[name="cargo"]');
                const classif = form.querySelector('select[name="classificacao"]');
                const investimento = form.querySelector('select[name="investimento"]');
                const faturamento = form.querySelector('select[name="faturamento"]');

                if (window.supabaseClient && currentLeadId) {
                    const { error } = await window.supabaseClient.from('submissions').update({
                        company: empInput ? empInput.value : '',
                        role: cargoInput ? cargoInput.value : '',
                        classification: classif ? classif.value : '',
                        investment_plan: investimento ? investimento.value : '',
                        average_revenue: faturamento ? faturamento.value : '',
                        completed_second_step: true
                    }).eq('id', currentLeadId);

                    if (error) {
                        alert("Erro Supabase Etapa 2: " + error.message);
                        console.error("Erro detalhado etapa 2:", error);
                    }
                } else if (window.supabaseClient && !currentLeadId) {
                    alert("ID não encontrado. A etapa 1 deve ter falhado.");
                }

                alert('Obrigado! Entraremos em contato em breve.');
                modal.classList.remove('active');
                form.reset();
                currentLeadId = null;
                step1.style.display = 'block';
                step2.style.display = 'none';
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
