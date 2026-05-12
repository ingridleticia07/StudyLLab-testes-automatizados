const StudentCard = ({ name, image, role }) => {
    return (
        <div className="min-w-44 rounded-xl border border-americanOrange-400 p-2 text-center">
            <img
                src={image}
                alt={name}
                className="w-24 h-24 md:w-31 md:h-31 object-cover rounded-full mx-auto"
            />

            <h2 className="text-lg text-gray-700 pt-1">{name}</h2>
            <p className="text-gray-500">{role}</p>
        </div>
    );
};

export default StudentCard;