import { useEffect, useState } from 'react';

const Loading = (data = true) => {
    const [showMessage, setShowMessage] = useState(false);
    useEffect(() => {
        
        if(!data.hasData){
            setShowMessage(true);
            return;
        }
        
        const timeout = setTimeout(() => {
            setShowMessage(true);
        }, 7000);

        return () => clearTimeout(timeout);
    }, [data]);

    return (
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="flex justify-center items-center py-4">
                    {showMessage ? (
                        <span className="text-600">Nenhum registro encontrado!</span>
                    ) : (
                        <div className="w-12 h-12 border-8 border-t-transparent border-l-transparent border-gray-500 rounded-full animate-spin"></div>
                    )}
                </td>
            </tr>
        </tbody>
    );
};

export default Loading;
