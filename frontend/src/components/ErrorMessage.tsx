import React from "react";

interface ErrorMessageProps {
  message: string | null; // O erro pode ser nulo quando não há mensagem
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null; // Não renderiza nada se a mensagem for nula ou vazia

  return (
    <div className="flex justify-center items-center my-4">
      <p className="text-red-500 text-center bg-red-100 border border-red-500 rounded-lg px-4 py-2 max-w-md w-full">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
