import { Link } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import InputField from '../components/InputField/InputField';
import { useState } from 'react';
import Button from '../components/Buttons/Button';

const PassowordEmail = () => {
    const [email, setEmail] = useState('');
    const isEmailValid = email.length > 0 && (email.endsWith('@alu.ufc.br') || email.endsWith('@ufc.br'));

    return (
        <div>
            <div className='flex flex-col justify-center items-center rounded-xl py-10 px-10 bg-white'>
                <AuthHeader infoText='Recuperar senha' />
                <form className='mb-5' onSubmit={(e) => e.preventDefault()}>
                    <InputField
                        type='email'
                        id='email'
                        label='E-mail cadastrado'
                        placeholder='Seu e-mail institucional'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isEmail={true}
                        isValid={email.length === 0 ? null : isEmailValid}
                    />
                    
                    <Button text='Continuar' link='/verificacao' />
                    
                </form>
                <div className='text-center mb-3 mt-3 text-sm text-americanOrange-500'>
                    <p>
                        Não tem uma conta?{' '}
                        <Link to='/cadastro' className='text-americanOrange-500 hover:underline'>
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
            <AuthFooter />

        </div>
    );
};

export default PassowordEmail;
