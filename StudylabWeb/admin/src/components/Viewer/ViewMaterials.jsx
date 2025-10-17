import 'react-toastify/dist/ReactToastify.css';

const ViewMaterials = ({ itemForView, handleClose }) => {
    

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300">
            <div className="bg-white flex flex-col tracking-wide rounded-lg shadow-lg p-4 gap-4 w-[90%] h-[90%]">
                <div className="flex-1 flex justify-center items-center overflow-auto">
                    {itemForView.typeFile == 1 ? (
                        <iframe
                            src={`https://agqvmxhwxafycxcwhyft.supabase.co/storage/v1/object/public/study-documents${itemForView.dir1}`}
                            className="w-full h-full rounded-lg"
                        />
                    ) : (
                        <div className="flex flex-col gap-4 w-full h-full items-center p-4 overflow-auto">
                            <div className="flex justify-center items-center w-full">
                                <img
                                    src={`https://agqvmxhwxafycxcwhyft.supabase.co/storage/v1/object/public/study-documents${itemForView.dir1}`}
                                    className="max-h-[90%] max-w-[90%] rounded-lg object-contain"
                                    alt="Visualização 1"
                                />
                            </div>
                            {itemForView.dir2 && (
                                <div className="flex justify-center items-center w-full">
                                    <img
                                        src={`https://agqvmxhwxafycxcwhyft.supabase.co/storage/v1/object/public/study-documents${itemForView.dir2}`}
                                        className="max-h-[90%] max-w-[90%] rounded-lg object-contain"
                                        alt="Visualização 2"
                                    />
                                </div>
                            )}
                        </div>
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
