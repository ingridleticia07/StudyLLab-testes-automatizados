const InputField = ({
    type,
    id,
    name,
    label,
    placeholder,
    icon,
    rightElement,
    invalidText,
    maxLength,
    value,
    onChange,
    needValidation
}) => {
    return (
        <div className='mb-4 w-full min-w-96'>
            <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-700'
            >
                {label}
            </label>
            <div className='flex items-center border border-gray-300 rounded-md p-2'>
                {icon && <img src={icon} alt='' className='mr-2' />}
                <input
                    type={type}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    className='flex-1 outline-none'
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                />
                {rightElement}
            </div>
            {needValidation && invalidText && <p className='text-sm text-red-500'>{invalidText}</p>}
        </div>
    );
};

export default InputField;
