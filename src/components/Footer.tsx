import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[var(--color-bg-dark)] pt-20 pb-8 border-t border-[#F2ECDA]/5 mt-auto">
            <div className="container mx-auto px-5 max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
                    {/* Coluna 1 */}
                    <div className="flex flex-col items-center md:items-start">
                        <Link href="/" className="inline-block mb-4">
                            <img src="/img/footer_logo.png" alt="KABRA Logo Branco" className="block w-full max-w-[250px]" />
                        </Link>
                        <p className="text-[#CCB8A3] text-[1.15rem] leading-relaxed">
                            Tranquilidade criativa aliada à neurose dos dados.<br />
                            Acelerando marcas que não aceitam ser a mesma.
                        </p>
                    </div>

                    {/* Coluna 2 */}
                    <div>
                        <h4 className="font-heading text-[#F2ECDA] text-[1.3rem] mb-6 uppercase tracking-wider">Agência</h4>
                        <ul>
                            <li className="mb-3"><Link href="/#servicos" className="text-[#CCB8A3] text-[1.15rem] hover:text-[#FF4719] transition-colors">A Engrenagem (Serviços)</Link></li>
                            <li className="mb-3"><Link href="/#manifesto" className="text-[#CCB8A3] text-[1.15rem] hover:text-[#FF4719] transition-colors">Manifesto KABRA</Link></li>
                            <li className="mb-3"><Link href="/blog" className="text-[#CCB8A3] text-[1.15rem] hover:text-[#FF4719] transition-colors">Conteúdo</Link></li>
                        </ul>
                    </div>

                    {/* Coluna 3 */}
                    <div>
                        <h4 className="font-heading text-[#F2ECDA] text-[1.3rem] mb-6 uppercase tracking-wider">Conecte-se</h4>
                        <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                            <a href="#" className="flex items-center justify-center w-[45px] h-[45px] bg-[#36423A] text-[#F2ECDA] font-bold rounded-full transition-all hover:bg-[#FF4719] hover:-translate-y-1">IG</a>
                            <a href="#" className="flex items-center justify-center w-[45px] h-[45px] bg-[#36423A] text-[#F2ECDA] font-bold rounded-full transition-all hover:bg-[#FF4719] hover:-translate-y-1">IN</a>
                            <a href="#" className="flex items-center justify-center w-[45px] h-[45px] bg-[#36423A] text-[#F2ECDA] font-bold rounded-full transition-all hover:bg-[#FF4719] hover:-translate-y-1">YT</a>
                        </div>
                    </div>
                </div>

                <div className="text-center text-[#CCB8A3] text-[1rem] pt-8 border-t border-[#F2ECDA]/5">
                    <p>&copy; 2026 Agência KABRA. Todos os direitos reservados. Desenhado para escalar.</p>
                </div>
            </div>
        </footer>
    );
}
