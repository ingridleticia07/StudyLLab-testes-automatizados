import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import Button from '../components/Buttons/Button';
import { getCookie } from '../../../platform/repository/auth';

const VerificationCode = () => {
  const navigate = useNavigate();

  const email = getCookie('emailForReset') || '';
  const [code, setCode] = useState(['', '', '', '']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));

  const maskedEmail = (email) => {
    const regex = /^(.{3})(.*)(.{3})@(.+)$/;
    return email.replace(regex, (_, start, mid, end, domain) =>
      `${start}${'*'.repeat(mid.length)}${end}@${domain}`
    );
  };

  const handleChange = (e, index) => {
    const value = e.target.value.toUpperCase();
    if (!/^[A-Z0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const finalCode = code.join('');

    if (finalCode.length === 4) {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      document.cookie = `codeForReset=${finalCode}; path=/; expires=${expireDate.toUTCString()};`;

      navigate('/senha');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-americanOrange-500'>
      <div className='flex flex-col justify-center items-center rounded-xl px-10 py-6 bg-white'>
        <AuthHeader infoText='Recuperar senha' />

        <div className='font-urbanist text-center mt-2'>
          <p>Digite o código enviado para o e-mail:</p>
          <p className='text-lg font-medium text-americanOrange-500'>
            {maskedEmail(email)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='flex justify-center gap-4 mb-4'>
            {code.map((char, i) => (
              <input
                key={i}
                type='text'
                maxLength={1}
                value={char}
                ref={inputRefs.current[i]}
                onChange={(e) => handleChange(e, i)}
                className='border-2 h-16 w-14 rounded-lg text-4xl text-center font-semibold font-urbanist uppercase'
                aria-label={`Código - dígito ${i + 1}`}
              />
            ))}
          </div>

          {isSubmitted && code.join('').length < 4 && (
            <p className='text-red-500 text-sm text-center mb-3'>
              *Insira os 4 dígitos do código de recuperação!
            </p>
          )}
          
            <Button text="Continuar" type="submit" />

        </form>

        <div className='text-center mt-6 text-sm text-americanOrange-500'>
          <p>
            Não tem uma conta?{' '}
            <Link to='/cadastro' className='hover:underline'>
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
