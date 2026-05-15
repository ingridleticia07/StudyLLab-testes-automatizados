import { useEffect, useState } from 'react';

const Loading = ({ hasData }) => {
    const [showMessage, setShowMessage] = useState(false);
    
    useEffect(() => {
        if (!hasData) {
            setShowMessage(true);
            return;
        }
        
        const timeout = setTimeout(() => {
            setShowMessage(true);
        }, 7000);

        return () => clearTimeout(timeout);
    }, [hasData]);

    // Retorna apenas o conteúdo, sem o tbody
    return (
        <div className="flex justify-center items-center py-4 w-full">
            {showMessage ? (
                <span className="text-gray-600">Nenhum registro encontrado!</span>
            ) : (
                <div className="w-12 h-12 border-8 border-t-transparent border-l-transparent border-gray-500 rounded-full animate-spin"></div>
            )}
        </div>
    );
};

export default Loading;