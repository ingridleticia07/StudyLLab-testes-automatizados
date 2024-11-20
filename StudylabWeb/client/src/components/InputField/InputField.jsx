// import { useState } from 'react';

const InputField = ({
    type,
    id,
    label,
    placeholder,
    icon,
    rightElement,
    invalidText,
}) => {
    // const [invalid, setInvalid] = useState(false);
    const invalid = false;

    return (
        <div className='mb-4 w-96'>
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
                    placeholder={placeholder}
                    className='flex-1 outline-none'
                />
                {rightElement}
            </div>
            {invalid && <p className='text-sm text-red-500'>{invalidText}</p>}
        </div>
    );
};

export default InputField;
