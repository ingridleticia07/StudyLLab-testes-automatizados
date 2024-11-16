const StatusTag = ({ status }) => {
    const getStatus = (status) => {
        switch (status) {
            case 'aprovado':
                return 'bg-green-100 text-green-600';
            case 'em análise':
            case 'pendente':
                return 'bg-yellow-100 text-yellow-600';
            case 'rejeitado':
            case 'bloqueado':
                return 'bg-red-100 text-red-600';
        }
    };

    return (
        <div
            className={`
                ${getStatus(status)}
                 font-semibold capitalize text-center rounded-md py-1 px-2 whitespace-nowrap text-sm`}
        >
            {status}
        </div>
    );
};

export default StatusTag;
