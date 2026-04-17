import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 w-full py-6 bg-[#252B27]/95 backdrop-blur-[10px] z-[1000] border-b border-[#F2ECDA]/10 transition-all">
            <div className="container mx-auto px-5 max-w-[1200px] flex justify-between items-center relative gap-4">
                <Link href="/" className="logo z-10 shrink-0">
                    <img src="/img/logo.png" alt="KABRA Logo" className="block w-[180px] md:w-[226px] object-contain" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
                    <ul className="flex gap-8 items-center m-0 p-0">
                        <li><Link href="/#servicos" className="nav-link font-medium text-[0.85rem] text-[#CCB8A3] relative hover:text-[#F2ECDA] transition-colors">Serviços</Link></li>
                        <li><Link href="/#manifesto" className="nav-link font-medium text-[0.85rem] text-[#CCB8A3] relative hover:text-[#F2ECDA] transition-colors">Manifesto</Link></li>
                        <li><Link href="/blog" className="nav-link font-medium text-[0.85rem] text-[#CCB8A3] relative hover:text-[#F2ECDA] transition-colors">Conteúdo</Link></li>
                        <li><Link href="/#contato" className="nav-link font-medium text-[0.85rem] text-[#CCB8A3] relative hover:text-[#F2ECDA] transition-colors">Contato</Link></li>
                    </ul>
                </nav>

                <div className="flex space-x-4 items-center z-10">
                    <Link href="https://wa.me/558591927755" className="hidden md:inline-flex bg-[#FF4719] hover:bg-[#e03810] text-[#F2ECDA] uppercase font-bold text-sm tracking-widest px-8 py-3 rounded transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,71,25,0.3)]">
                        Acelerar agora
                    </Link>
                    <button className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer">
                        <span className="block w-[25px] h-[3px] bg-[#F2ECDA] transition-all"></span>
                        <span className="block w-[25px] h-[3px] bg-[#F2ECDA] transition-all"></span>
                        <span className="block w-[25px] h-[3px] bg-[#F2ECDA] transition-all"></span>
                    </button>
                </div>
            </div>

            {/* Global Styles Specific for Custom Link Underscores */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0%;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: #FF4719;
                    transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                }
                .nav-link:hover::after {
                    width: 100%;
                }
            `}} />
        </header>
    );
}
