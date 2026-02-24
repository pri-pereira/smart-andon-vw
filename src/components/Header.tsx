import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function Header({ title, showBackButton = true }: HeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="w-full bg-white border-b-2 border-[#001E50]/10 py-6 px-4 md:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#001E50] tracking-tight">
            Smart Andon
          </h1>
          {title && (
            <p className="text-xs md:text-sm text-[#6B7280] font-medium">
              {title}
            </p>
          )}
        </div>
      </div>
      {showBackButton && (
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 px-4 py-2 text-[#001E50] hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      )}
    </header>
  );
}
