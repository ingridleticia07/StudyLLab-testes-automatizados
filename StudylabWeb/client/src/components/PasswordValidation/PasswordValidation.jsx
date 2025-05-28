const getPasswordStrength = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    const score = [hasUpper, hasLower, hasNumber, isLongEnough].filter(
        Boolean
    ).length;

    if (score < 2) return { label: 'Muito Fraca!', color: 'bg-[#EB0000]' };
    if (score === 2 || score === 3)
        return { label: 'Fraca!', color: 'bg-yellow-500' };
    return { label: 'Forte!', color: 'bg-green-600' };
};

const PasswordValidation = ({ password }) => {
    const { label, color } = getPasswordStrength(password);

    return (
        <div className='mt-2 items-center justify-center flex flex-col'>
            <p className='text-lg mb-1 '>{label}</p>

            <div className={`h-2 w-64 rounded ${color}`} />
            <p className='mt-3'>
                Sua senha precisa ter no mínimo 8 caracteres e deve conter
                números
                <br /> e letras minúsculas e maiúsculas
            </p>
        </div>
    );
};

export default PasswordValidation;
