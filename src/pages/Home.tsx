import { useLocation } from 'wouter';
import { useAuthRE } from '@/hooks/useAuthRE';
import { Truck, HardHat, FileText, HelpCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuthRE();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-[#001E50] p-6 text-center shadow-md">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase">Smart Andon</h1>
        <p className="text-blue-200 text-sm font-medium tracking-widest mt-1">Volkswagen Taubaté</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl p-6 flex flex-col justify-center gap-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-[#001E50]">Selecione o Módulo</h2>
          <div className="w-16 h-1 bg-[#001E50] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card Operador */}
          <button
            onClick={() => setLocation('/operador')}
            className="group flex flex-col items-center justify-center bg-white border-2 border-[#001E50]/20 p-12 rounded-2xl hover:border-[#001E50] hover:bg-blue-50 transition-all shadow-sm"
          >
            <HardHat size={64} className="text-[#001E50] mb-6" />
            <h3 className="text-3xl font-black text-[#001E50] uppercase tracking-wide">Operador</h3>
            <p className="text-[#6B7280] font-medium mt-2">Registrar chamados de peças</p>
            <div className="mt-8 flex items-center text-[#001E50] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </button>

          {/* Card Logística */}
          <button
            onClick={() => setLocation('/login')}
            className="group flex flex-col items-center justify-center bg-[#001E50] border-2 border-[#001E50] p-12 rounded-2xl hover:bg-[#002E7A] transition-all shadow-md"
          >
            <Truck size={64} className="text-white mb-6" />
            <h3 className="text-3xl font-black text-white uppercase tracking-wide">Logística</h3>
            <p className="text-blue-200 font-medium mt-2">Painel de separadores e rotas</p>
            <div className="mt-8 flex items-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Acessar <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Links do Rodapé */}
        <div className="mt-12 pt-6 border-t-2 border-gray-100 flex flex-wrap justify-center gap-6 text-sm font-bold text-[#6B7280]">
          <button onClick={() => setLocation('/ajuda')} className="flex items-center hover:text-[#001E50]">
            <HelpCircle size={16} className="mr-2" /> Ajuda
          </button>
          <span className="hidden md:inline text-gray-300">|</span>
          <a href="#" className="flex items-center hover:text-[#001E50]">
            <FileText size={16} className="mr-2" /> Documentação
          </a>
          {user?.role === 'admin' && (
            <>
              <span className="hidden md:inline text-gray-300">|</span>
              <button onClick={() => setLocation('/admin')} className="flex items-center hover:text-[#001E50]">
                Painel Admin
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
