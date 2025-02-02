const InputField = ({ id, name, label, placeholder, required = false, value = '', onChange }) => {
    return (
        <div className='flex flex-col '>
            <label htmlFor={id} className='font-bold text-gray-500'>
                {label}
            </label>
            <input
                className='border-2 rounded-lg pl-4 py-2 mt-2 min-w-96 text-lg placeholder:text-sm placeholder:tracking-wider focus:border-americanOrange-500 outline-none'
                type='text'
                id={id}
                name={name}
                placeholder={placeholder}
                required={required}
                value={value} 
                onChange={onChange}
            />
        </div>
    );
};

export default InputField;
