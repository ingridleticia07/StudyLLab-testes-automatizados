import 'react-toastify/dist/ReactToastify.css';

const ViewMaterials = ({ itemForView, handleClose }) => {
    console.log(itemForView)

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300">
            <div className="bg-white flex flex-col tracking-wide rounded-lg shadow-lg p-4 gap-4 w-[80%] h-[90%]">
                <div className="flex-1 flex justify-center items-center">
                    {itemForView.typeFile == 1 ? (
                        <iframe
                            src={`http://localhost:5000${itemForView.dir1}`}
                            className="w-full h-full rounded-lg"
                        />
                    ) : (
                        <img
                            src={`http://localhost:5000${itemForView.dir1}`}
                            className="max-h-full max-w-full rounded-lg"
                            alt="Visualização"
                        />
                    )}
                </div>
                <div className="flex items-center justify-end">
                    <button
                        className="px-4 py-2 rounded-lg border-2 border-americanOrange-500 text-americanOrange-500 hover:bg-americanOrange-50"
                        onClick={handleClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewMaterials;
