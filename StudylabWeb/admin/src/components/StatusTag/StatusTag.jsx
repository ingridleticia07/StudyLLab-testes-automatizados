const StatusTag = ({ status, text }) => {
    const getStatus = (status) => {
        switch (status) {
            case 'green':
                return 'bg-green-100 text-green-600';
            case 'yellow':
                return 'bg-yellow-100 text-yellow-600';
            case 'red':
                return 'bg-red-100 text-red-600';
        }
    };

    return (
        <div
            className={`
                ${getStatus(status)}
                 font-semibold capitalize text-center rounded-md py-1`}
        >
            {text}
        </div>
    );
};

export default StatusTag;
