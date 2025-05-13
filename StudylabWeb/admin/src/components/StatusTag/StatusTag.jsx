import { useState } from 'react';

const StatusTag = ({ status }) => {
    const [statusMaterial] = useState(['Em análise','Aprovado','Reprovado']);
    
    const getStatus = (status) => {
        switch (status) {
            case 1:
                return 'bg-green-100 text-green-600';
            case 0:
                return 'bg-yellow-100 text-yellow-600';
            case 2:
                return 'bg-red-100 text-red-600';
        }
    };

    return (
        <div
            className={`
                ${getStatus(status)}
                 font-semibold capitalize text-center rounded-md py-1 px-2 whitespace-nowrap text-sm`}
        >
            {statusMaterial[status]}
        </div>
    );
};

export default StatusTag;
