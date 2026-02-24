/**
 * Página Home - Smart Andon VW
 * 
 * Seleção de módulo (Operador ou Logística)
 * Design Minimalista: Apenas ícones e títulos
 */

import { useLocation } from 'wouter';
import { HardHat, Truck, ArrowRight, HelpCircle, FileText } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col">
      {/* Header Premium */}
      <header className="w-full bg-white border-b-2 border-[#001E50]/10 py-6 px-4 md:px-6 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/vw-logo.png" 
            alt="Volkswagen" 
            className="h-12 md:h-14 w-12 md:w-14 object-contain"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#001E50] tracking-tight">
              Smart Andon
            </h1>
            <p className="text-xs md:text-sm text-[#6B7280] font-medium">
              Volkswagen Taubaté
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-700">
          {/* Title Section */}
          <div className="text-center space-y-4 pb-8">
            <h2 className="text-4xl md:text-5xl font-black text-[#001E50] tracking-tight">
              Bem-vindo ao Smart Andon
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#001E50] to-blue-400 mx-auto rounded-full" />
          </div>

          {/* Cards Grid - Minimalista */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Card Operador */}
            <button
              onClick={() => setLocation('/operador')}
              className="group relative overflow-hidden rounded-3xl bg-white border-2 border-[#001E50]/10 p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-[#001E50]/30 active:scale-95 flex flex-col items-center justify-center text-center space-y-6 min-h-64"
            >
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#001E50]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 space-y-4 flex flex-col items-center">
                {/* Icon */}
                <div className="bg-[#F3F4F6] p-8 rounded-full shadow-inner group-hover:shadow-md transition-shadow">
                  <HardHat size={48} className="text-[#001E50]" />
                </div>

                {/* Title Only */}
                <h3 className="text-3xl md:text-4xl font-black text-[#001E50] tracking-tight">
                  Operador
                </h3>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-6 right-6 bg-[#001E50] p-3 rounded-full text-white group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </div>
            </button>

            {/* Card Logística */}
            <button
              onClick={() => setLocation('/login')}
              className="group relative overflow-hidden rounded-3xl bg-white border-2 border-[#001E50]/10 p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-[#001E50]/30 active:scale-95 flex flex-col items-center justify-center text-center space-y-6 min-h-64"
            >
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#001E50]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 space-y-4 flex flex-col items-center">
                {/* Icon */}
                <div className="bg-[#F3F4F6] p-8 rounded-full shadow-inner group-hover:shadow-md transition-shadow">
                  <Truck size={48} className="text-[#001E50]" />
                </div>

                {/* Title Only */}
                <h3 className="text-3xl md:text-4xl font-black text-[#001E50] tracking-tight">
                  Logística
                </h3>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-6 right-6 bg-[#001E50] p-3 rounded-full text-white group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </div>
            </button>
          </div>

          {/* Links - Subtle */}
          <div className="text-center pt-6 border-t border-[#001E50]/10 space-y-3">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center flex-wrap">
              <button
                onClick={() => setLocation('/ajuda')}
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#001E50] font-medium transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Central de Ajuda
              </button>
              <span className="hidden md:inline text-[#001E50]/20">•</span>
              <a
                href="https://docs.google.com/presentation/d/1GLFJuvlZP73WOQMz4Klkx03Cr-QdNC39/edit?usp=sharing&ouid=106764730700458304896&rtpof=true&sd=true"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#001E50] font-medium transition-colors"
              >
                <FileText className="h-4 w-4" />
                Ver Apresentação do Projeto
              </a>
              <span className="hidden md:inline text-[#001E50]/20">•</span>
              <button
                onClick={() => setLocation('/admin')}
                className="text-sm text-[#6B7280] hover:text-[#001E50] font-medium transition-colors"
              >
                Acesso Administrativo →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#001E50]/10 py-4 px-4 md:px-6 text-center">
        <p className="text-xs text-[#9CA3AF] font-medium">
          Smart Andon v2.0 • © 2026 Volkswagen • Célula de Vidros • Taubaté
        </p>
      </footer>
    </div>
  );
}
