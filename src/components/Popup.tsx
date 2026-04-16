"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Popup() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState("start");

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        document.addEventListener("open-kabra-popup", handleOpen);
        return () => document.removeEventListener("open-kabra-popup", handleOpen);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
        const company = (form.elements.namedItem("company") as HTMLInputElement).value;
        const reason = (form.elements.namedItem("reason") as HTMLSelectElement).value;

        const { error } = await supabase.from('submissions').insert([
            { name, email, phone, company, role: reason, origin: "popup", status: "new" }
        ]);

        if (error) {
            alert("Erro: " + error.message);
            setStatus("start");
        } else {
            setStatus("success");
            setTimeout(() => {
                setIsOpen(false);
                setStatus("start");
                form.reset();
            }, 3500);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#0F1210]/85 backdrop-blur-sm flex justify-center items-center z-[9999] transition-all">
            <div className="bg-[#36423A] p-10 rounded-lg w-[90%] max-w-[500px] border-t-4 border-[#FF4719] shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative">
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-5 text-[#CCB8A3] text-4xl leading-none hover:text-[#FF4719] border-none bg-transparent cursor-pointer">&times;</button>
                <div className="text-center mb-8">
                    <h2 className="text-[#F2ECDA] text-[clamp(1.8rem,4vw,2.2rem)] font-heading mb-2 uppercase">Vamos Escalar?</h2>
                    <p className="text-[#CCB8A3]">Agende um diagnóstico consultivo gratuito.</p>
                </div>
                {status === "success" ? (
                    <div className="bg-[#24422e] text-[#F2ECDA] p-6 text-center rounded border border-[#4CAF50]/30 shadow-lg mt-4 mb-4">
                        <strong className="block text-2xl mb-3 text-[#4CAF50]">🚀 Sucesso!</strong>
                        Recebemos seus dados estruturais. Entraremos em contato em breve para acelerar a sua operação.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-sm text-[#CCB8A3] font-body">Nome Completo *</label>
                            <input name="name" type="text" required className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-sm text-[#CCB8A3] font-body">E-mail Corporativo *</label>
                            <input name="email" type="email" required className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-sm text-[#CCB8A3] font-body">Celular / WhatsApp *</label>
                            <input name="phone" type="text" required className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 text-left w-1/2">
                                <label className="text-sm text-[#CCB8A3] font-body">Empresa</label>
                                <input name="company" type="text" className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors" />
                            </div>
                            <div className="flex flex-col gap-1.5 text-left w-1/2">
                                <label className="text-sm text-[#CCB8A3] font-body">Desafio Base</label>
                                <select name="reason" className="w-full p-3 bg-[#252B27]/80 border border-[#252B27] rounded text-[#F2ECDA] focus:border-[#FF4719] outline-none transition-colors">
                                    <option value="lead-gen" className="bg-[#36423A] text-[#F2ECDA]">Geração de Leads</option>
                                    <option value="content" className="bg-[#36423A] text-[#F2ECDA]">Conteúdo</option>
                                    <option value="branding" className="bg-[#36423A] text-[#F2ECDA]">Branding</option>
                                    <option value="other" className="bg-[#36423A] text-[#F2ECDA]">Outros</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={status !== "start"} className="w-full mt-4 bg-[#FF4719] hover:bg-[#e03810] text-[#F2ECDA] uppercase font-bold text-[1rem] tracking-widest px-8 py-4 rounded transition-all hover:-translate-y-1">
                            {status === "loading" ? "Enviando..." : "Solicitar Diagnóstico"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
