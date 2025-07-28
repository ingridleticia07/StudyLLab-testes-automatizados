import { useState } from 'react';

const StatusTagUser = ({ status }) => {
    
    const getStatus = (status) => {
        switch (status) {
            case true:
                return 'bg-green-100 text-green-600';
            case false:
                return 'bg-red-100 text-red-600';
        }
    };

    return (
        <div
            className={`
                ${getStatus(status)}
                 font-semibold capitalize text-center rounded-md py-1 px-2 whitespace-nowrap text-sm`}
        >
            {status == true ? 'Ativo':'Inativo'}
        </div>
    );
};

export default StatusTagUser;
