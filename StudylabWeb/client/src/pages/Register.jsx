import { useState } from 'react';
import { icons } from '../assets/assets';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import VisibilityButton from '../components/Buttons/VisibilityButton';
import InputField from '../components/InputField/InputField';
import PasswordValidation from '../components/PasswordValidation/PasswordValidation';
import { Link, useNavigate } from 'react-router-dom';
import ButtonActivate from '../components/Buttons/ButtonActivate';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import SelectField from '../components/SelectField/SelectField';
import {register} from "../../../platform/repository/auth";
import Button from '../components/Buttons/Button';

const Register = () => {
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState('');

    const cursos = [
        { value: 'CC', label: 'Ciência da Computação' },
        { value: 'ES', label: 'Engenharia de software' },
        { value: 'EM', label: 'Engenharia da Mecânica' },
        { value: 'EP', label: 'Engenharia de produção' },
        { value: 'EC', label: 'Engenharia civil' },
    ];

    const navigate = useNavigate();

    const isEmailValid = email.length > 0 && (email.endsWith('@alu.ufc.br') || email.endsWith('@ufc.br'));
    const isPasswordStrong = password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);
    const isConfirmMatch = password === confirmPassword;
    const isNameValid = nome.length > 0;
    const isMatriculaValid = matricula.length > 0;
    const isCurseValid = selectedCurso.length > 0;

    const isFormValid = isEmailValid && isPasswordStrong && isConfirmMatch 
    && isNameValid && isCurseValid && isMatriculaValid && termsAccepted;

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    const registerUser = async (e) => {
        e.preventDefault();

        try {
            await register(nome,email,password,matricula,selectedCurso)
            navigate('/LoginVerification');

        } catch (error) {
            setShowError(true);   
        }
    };
    return (
        <div>
            <AuthHeader color='text-white' />
            <div className='bg-white rounded-xl px-10 py-10 text-gray-800'>
                <form className='flex flex-col items-center' onSubmit={registerUser}>
                    <InputField
                        type='text'
                        id='nome'
                        label='Nome Completo'
                        placeholder='Digite seu nome completo'
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        invalidText='Nome inválido'
                    />

                    <SelectField
                        id="curso"
                        label="Seu curso"
                        Placeholder='Selecione seu curso'
                        options={cursos}
                        value={selectedCurso}
                        onChange={(e) => setSelectedCurso(e.target.value)}
                    />

                    <InputField
                        type='text'
                        id='matricula'
                        label='Matrícula'
                        placeholder='Sua matrícula'
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        maxLength={6}
                        invalidText='Matrícula inválida'
                    />

                    <InputField
                        type='email'
                        id='email'
                        label='Seu e-mail institucional'
                        placeholder='meuemail@alu.ufc.br'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isEmail={true}
                        isValid={email.length === 0 ? null : isEmailValid}
                    />

                    <InputField
                        type={showPassword ? 'text' : 'password'}
                        id='senha'
                        label='Senha'
                        placeholder='Crie sua senha'
                        icon={icons.padlock}
                        maxLength={32}
                        rightElement={
                            <VisibilityButton
                                handleClick={togglePasswordVisibility}
                                showPassword={showPassword}
                            />
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <InputField
                        type={showPassword ? 'text' : 'password'}
                        id='confirmar-senha'
                        label='Confirmar Senha'
                        placeholder='Confirme a sua senha'
                        icon={icons.padlock}
                        maxLength={32}
                        rightElement={
                            <VisibilityButton
                            handleClick={togglePasswordVisibility}
                            showPassword={showPassword}
                            />
                        }
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <PasswordValidation password={password} />

                    <Button text='Continuar meu cadastro' type='submit' disabled={!isFormValid} />

                    <p
                    className={`text-sm text-red-500 mt-3 transition-opacity duration-200 ${
                        isFormValid ? 'invisible' : 'visible'
                    }`}
                    >
                    A senha não corresponde ao requisito da diretiva de senha ou algum<br /> campo está vazio.
                    </p>
                    <div className='flex gap-2 text-start w-full mt-3'>
                        <input
                            type='checkbox'
                            id='terms'
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                        />
                        <label htmlFor='terms'>
                            Eu aceito os{' '}
                            <Link to='/termos' className='underline font-medium hover:text-black'>
                                Termos de serviço e Política de privacidade
                            </Link>
                        </label>
                    </div>
                </form>

                <div className='w-full text-center mt-5'>
                    <p>
                        Já tem uma conta?{' '}
                        <Link to='/' className='text-americanOrange-500 hover:underline'>
                            Entre aqui
                        </Link>
                    </p>
                </div>
            </div>
            <AuthFooter showSecondLink={false} />
        </div>
    );
};

export default Register;
