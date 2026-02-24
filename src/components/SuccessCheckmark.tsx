import { CheckCircle } from "lucide-react";

interface SuccessCheckmarkProps {
  message?: string;
  onClose?: () => void;
}

export default function SuccessCheckmark({
  message = "Operação realizada com sucesso!",
  onClose,
}: SuccessCheckmarkProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center max-w-sm">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-6">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}
