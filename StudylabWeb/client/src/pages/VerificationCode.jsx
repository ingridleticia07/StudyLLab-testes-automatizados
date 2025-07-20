import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import AuthFooter from '../components/AuthFooter/AuthFooter';
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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-0">
          <div className="w-full max-w-2lg bg-white rounded-xl px-4 sm:px-6 md:px-10 py-10 shadow-lg">
            <AuthHeader infoText={'Recuperar senha'} />

          <p className="text-center text-sm mb-6">
            Digite o código enviado para o e-mail <br />
            <span className="font-medium">{maskedEmail(email)}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-4 mb-6">
              {code.map((char, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={char}
                  ref={inputRefs.current[i]}
                  onChange={(e) => handleChange(e, i)}
                  className="border-2 border-gray-300 rounded-md w-12 h-12 text-center text-xl font-semibold uppercase focus:outline-none focus:border-[#f97300]"
                  aria-label={`Código - dígito ${i + 1}`}
                />
              ))}
            </div>

            {isSubmitted && code.join('').length < 4 && (
              <p className="text-red-500 text-center mb-3">
                *Insira os 4 dígitos do código de recuperação!
              </p>
            )}

            <Button
              text="Continuar"
              type="submit"
              className="w-full bg-[#f97300] hover:bg-[#e06600] text-white rounded-full py-5 text-xl font-bold"
            />
          </form>
      </div>
    </div>
    <AuthFooter />
  </div>
  );
};

export default VerificationCode;
