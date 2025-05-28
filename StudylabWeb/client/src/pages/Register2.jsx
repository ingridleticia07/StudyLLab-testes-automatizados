import AuthHeader from '../components/AuthHeader/AuthHeader';
import { Link } from 'react-router-dom';
import AuthFooter from '../components/AuthFooter/AuthFooter';
import { useState } from 'react';
import InputField from '../components/InputField/InputField';
import SelectField from '../components/SelectField/SelectField';
import ButtonActivate from '../components/Buttons/ButtonActivate';

const Register = () => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [selectedCurso, setSelectedCurso] = useState('');

    const cursos = [
    { value: 'cc', label: 'Ciência da Computação' },
    { value: 'ec', label: 'Engenharia da Computação' },
    ];

    const nomeValido = nome.length > 0 && nome.length <= 100 && /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
    const matriculaValida = /^\d{6}$/.test(matricula);
    const cursoValido = selectedCurso !== '';
    const termosAceitos = termsAccepted;

    const isFormValid = nomeValido && matriculaValida && cursoValido && termosAceitos;


    return (
        <div>
            <AuthHeader color='text-white' />
            <div className='bg-white rounded-xl px-10 py-10 text-gray-800'>
                <form className='flex flex-col items-center'>

                    <InputField
                        type='text'
                        id='nome'
                        label='Nome Completo'
                        placeholder='Digite seu nome completo'
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        invalidText='Nome inválido'
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

                    <SelectField
                        id="curso"
                        label="Seu curso"
                        Placeholder='Selecione seu curso'
                        options={cursos}
                        value={selectedCurso}
                        onChange={(e) => setSelectedCurso(e.target.value)}
                    />

                    <div className='flex gap-2 text-start w-full mb-3 mt-3'>
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

                    <ButtonActivate text='Concluir meu cadastro' link='/' type='submit' disabled={!isFormValid} />
                </form>

                <div className='w-full text-center mt-5'>
                    <p>
                        Já tem uma conta?{' '}
                        <Link to='/LoginVerification' className='text-americanOrange-500 hover:underline'>
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
