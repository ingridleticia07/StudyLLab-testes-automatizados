const InputField = ({ type, id, label, placeholder, icon, rightElement }) => (
    <div className='mb-4 w-96'>
        <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
            {label}
        </label>
        <div className='flex items-center border border-gray-300 rounded-md p-2'>
            {icon && <img src={icon} alt='' className='mr-2' />}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className='flex-1 outline-none'
            />
            {rightElement}
        </div>
    </div>
);

export default InputField;
