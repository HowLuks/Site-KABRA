"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Popup() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [leadId, setLeadId] = useState<number | null>(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        document.addEventListener("open-kabra-popup", handleOpen);
        return () => document.removeEventListener("open-kabra-popup", handleOpen);
    }, []);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(""), 4500);
    };

    const handleStep1 = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;

        try {
            const { data, error } = await supabase.from('submissions').insert([
                { name, email, phone, origin: "popup", status: "new", completed_second_step: false }
            ]).select();

            if (error) {
                alert("Erro Supabase Etapa 1: " + error.message);
                setIsSubmitting(false);
            } else {
                if (data && data.length > 0) {
                    setLeadId(data[0].id);
                }
                setStep(2);
                setIsSubmitting(false);
            }
        } catch (err: any) {
            alert("Erro na etapa 1: " + err.message);
            setIsSubmitting(false);
        }
    };

    const handleStep2 = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const company = (form.elements.namedItem("company") as HTMLInputElement).value;
        const role = (form.elements.namedItem("role") as HTMLInputElement).value;
        const classification = (form.elements.namedItem("classification") as HTMLSelectElement).value;
        const investment = (form.elements.namedItem("investment") as HTMLSelectElement).value;
        const revenue = (form.elements.namedItem("revenue") as HTMLSelectElement).value;

        if (leadId) {
            const { error } = await supabase.from('submissions').update({
                company,
                role,
                classification,
                investment_plan: investment,
                average_revenue: revenue,
                completed_second_step: true
            }).eq('id', leadId);

            if (error) {
                alert("Erro Supabase Etapa 2: " + error.message);
            }
        }

        setIsOpen(false);
        setTimeout(() => {
            setStep(1);
            setIsSubmitting(false);
            setLeadId(null);
            showToast("Obrigado! Formulário enviado com sucesso, em breve entraremos em contato. 🚀");
        }, 300);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-[#0F1210]/85 backdrop-blur-sm flex justify-center items-center z-[9999] transition-all" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
                    <div className="bg-[#36423A] p-10 rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto border-t-4 border-[#FF4719] shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-5 text-[#CCB8A3] text-4xl leading-none hover:text-[#FF4719] border-none bg-transparent cursor-pointer">&times;</button>
                        <div className="text-center mb-8 mt-2">
                            <h2 className="text-[#F2ECDA] text-[clamp(1.8rem,4vw,2.2rem)] font-heading mb-2 uppercase">Acelere seu negócio</h2>
                            <p className="text-[#CCB8A3]">Preencha os dados abaixo e nossa equipe entrará em contato.</p>
                        </div>

                        {step === 1 ? (
                            <form onSubmit={handleStep1} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">Nome Completo</label>
                                    <input name="name" type="text" required placeholder="Seu nome completo" className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">E-mail Profissional</label>
                                    <input name="email" type="email" required placeholder="seu@email.com" className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">Telefone / WhatsApp</label>
                                    <input name="phone" type="tel" required placeholder="(11) 99999-9999" className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-[#FF4719] hover:bg-[#e03810] text-[#F2ECDA] uppercase font-bold text-[1rem] tracking-widest px-8 py-4 rounded transition-all hover:-translate-y-1">
                                    {isSubmitting ? "Salvando..." : "Continuar"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleStep2} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">Nome da Empresa</label>
                                    <input name="company" type="text" required placeholder="Sua empresa" className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">Seu Cargo</label>
                                    <input name="role" type="text" required placeholder="Ex: CEO, Diretor, Analista" className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">Como se identifica no momento?</label>
                                    <select name="classification" defaultValue="" required className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors [&:invalid]:text-gray-400">
                                        <option value="" disabled className="text-gray-500">Selecione uma opção</option>
                                        <option value="Buscando crescimento acelerado" className="bg-[#36423A]">Buscando crescimento acelerado</option>
                                        <option value="Desejo reestruturar a marca" className="bg-[#36423A]">Desejo reestruturar a marca</option>
                                        <option value="Preciso de tráfego e vendas" className="bg-[#36423A]">Preciso de tráfego e vendas</option>
                                        <option value="Outro" className="bg-[#36423A]">Outro</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">Quanto planeja investir no momento?</label>
                                    <select name="investment" defaultValue="" required className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors [&:invalid]:text-gray-400">
                                        <option value="" disabled className="text-gray-500">Selecione uma opção</option>
                                        <option value="Até 5 mil" className="bg-[#36423A]">Até 5 mil</option>
                                        <option value="Entre 5-10 mil" className="bg-[#36423A]">Entre 5 e 10 mil</option>
                                        <option value="Entre 10-50 mil" className="bg-[#36423A]">Entre 10 e 50 mil</option>
                                        <option value="Entre 50-100 mil" className="bg-[#36423A]">Entre 50 e 100 mil</option>
                                        <option value="+100k" className="bg-[#36423A]">Mais de 100 mil</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5 text-left">
                                    <label className="text-sm text-[#CCB8A3] font-body">Qual o faturamento médio da empresa?</label>
                                    <select name="revenue" defaultValue="" required className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors [&:invalid]:text-gray-400">
                                        <option value="" disabled className="text-gray-500">Selecione uma opção</option>
                                        <option value="Até 5 mil" className="bg-[#36423A]">Até 5 mil</option>
                                        <option value="Entre 5-10 mil" className="bg-[#36423A]">Entre 5 e 10 mil</option>
                                        <option value="Entre 10-50 mil" className="bg-[#36423A]">Entre 10 e 50 mil</option>
                                        <option value="Entre 50-100 mil" className="bg-[#36423A]">Entre 50 e 100 mil</option>
                                        <option value="+100k" className="bg-[#36423A]">Mais de 100 mil</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-[#FF4719] hover:bg-[#e03810] text-[#F2ECDA] uppercase font-bold text-[1rem] tracking-widest px-8 py-4 rounded transition-all hover:-translate-y-1">
                                    {isSubmitting ? "Aguarde..." : "Enviar Solicitação"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* TOAST / SNACKBAR */}
            <div className={`fixed bottom-5 right-5 bg-[#FF4719] text-[#F2ECDA] px-6 py-4 rounded-md shadow-lg font-medium font-body text-[1.05rem] z-[10000] flex items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0'}`}>
                <span>✅</span> {toastMessage}
            </div>
        </>
    );
}
