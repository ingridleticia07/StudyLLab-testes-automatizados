import { useRef, useState } from 'react';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import Button from '../components/Buttons/Button';
import { Link } from 'react-router-dom';

const VerificationCode = () => {
    const email = 'testetestando123@alu.ufc.com';

    const regexEmail = (email) => {
        const regex = /^(.{3})(.*)(.{3})@(.+)$/;
        return email.replace(regex, (match, inicio, meio, fim, dominio) => {
            return `${inicio}${'*'.repeat(meio.length)}${fim}@${dominio}`;
        });
    };

    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [code, setCode] = useState(['', '', '', '']);

    const handleChange = (e, index) => {
        const value = e.target.value.toUpperCase(); // força maiúscula
        if (!/^[A-Z0-9]?$/i.test(value)) return; // só letras e números

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCode = code.join('');
    };

    return (
        <div>
            <div className='flex flex-col justify-center items-center rounded-xl px-10 py-6 bg-white'>
                <AuthHeader infoText='Recuperar senha' />
                <div>
                    <div className='font-urbanist'>
                        <span>Digite o código enviado para o email: </span>
                        <span className='font-urbanist text-lg font-medium text-center'>
                            {regexEmail(email)}
                        </span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='flex gap-4 my-5 items-center justify-center'>
                            {inputRefs.map((ref, i) => (
                                <input
                                    key={i}
                                    type='text'
                                    maxLength={1}
                                    ref={ref}
                                    value={code[i]}
                                    onChange={(e) => handleChange(e, i)}
                                    className='border-2 h-16 w-14 rounded-lg text-4xl text-center font-semibold font-urbanist uppercase'
                                />
                            ))}
                        </div>
                        <Button link='/senha' text='continuar' type='submit' />
                    </form>
                </div>
                <div className='text-center mb-8 mt-6 text-sm text-americanOrange-500'>
                    <p>
                        Não tem uma conta?{' '}
                        <Link to='/cadastro' className='text-americanOrange-500 hover:underline'>
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
            <AuthFooter showFirstLink={false} />
        </div>
    );
};

export default VerificationCode;
