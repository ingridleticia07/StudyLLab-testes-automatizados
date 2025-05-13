// import { useState } from 'react';

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
    onChange,
    value,
    needValidation,
    isEmail = false,
    isValid = null,
}) => {
    // const [invalid, setInvalid] = useState(false);
    const invalid = false;

    if (isEmail) {
        return (
            <div className='mb-4 w-full min-w-96'>
                <label
                    htmlFor={id}
                    className='block text-sm font-medium text-gray-700'
                >
                    {label}
                </label>
                <div className="relative">
                    <span
                        className={`absolute inset-y-0 left-3 text-2xl flex items-center ${
                            isValid === null
                                ? "text-gray-500"
                                : isValid
                                ? "text-[#00BDEB]"
                                : "text-[#EB0000]"
                        }`}
                    >
                        @
                    </span>

                    <input
                        type={type}
                        id={id}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`w-full pl-10 px-4 py-2 rounded-md outline-none ${
                            isValid === null
                                ? "border border-gray-300"
                                : isValid
                                ? "border border-[#00BDEB]"
                                : "border border-[#EB0000]"
                        }`}
                    />
                </div>
                {invalidText && isValid === false && (
                    <p className="text-sm text-[#EB0000] mt-1">{invalidText}</p>
                )}
            </div>
        );
    };
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
                    onChange={onChange}
                    value={value}
                />
                {rightElement}
            </div>
            {needValidation && invalidText && <p className='text-sm text-red-500'>{invalidText}</p>}
        </div>
    );
};

export default InputField;
