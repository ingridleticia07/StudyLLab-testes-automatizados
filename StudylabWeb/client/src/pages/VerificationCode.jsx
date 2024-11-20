import AuthFooter from '../components/AuthFooter/AuthFooter';
import AuthHeader from '../components/AuthHeader/AuthHeader';
import Button from '../components/Buttons/Button';

const VerificationCode = () => {
    const email = 'testetestando123@alu.ufc.com';

    const regexEmail = (email) => {
        const regex = /^(.{3})(.*)(.{3})@(.+)$/;

        return email.replace(regex, (match, inicio, meio, fim, dominio) => {
            return `${inicio}${'*'.repeat(meio.length)}${fim}@${dominio}`;
        });
    };

    return (
        <div className='flex flex-col justify-center items-center rounded-lg px-10 py-6 bg-white'>
            <AuthHeader infoText='Recuperar senha' />
            <div className='font-urbanist'>
                <p>Digite o codigo enviado para o email: </p>
                <p className='font-urbanist text-lg font-medium text-center'>
                    {regexEmail(email)}
                </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className='flex gap-4 my-5'>
                    <input
                        type='text'
                        maxLength={1}
                        className='border-2 h-20 w-16 rounded-lg text-4xl text-center font-semibold font-urbanist uppercase'
                    />
                    <input
                        type='text'
                        maxLength={1}
                        className='border-2 h-20 w-16 rounded-lg text-4xl text-center font-semibold font-urbanist uppercase'
                    />
                    <input
                        type='text'
                        maxLength={1}
                        className='border-2 h-20 w-16 rounded-lg text-4xl text-center font-semibold font-urbanist uppercase'
                    />
                    <input
                        type='text'
                        maxLength={1}
                        className='border-2 h-20 w-16 rounded-lg text-4xl text-center font-semibold font-urbanist uppercase'
                    />
                </div>
                <Button text='continuar' link='/senha' />
            </form>
            <AuthFooter />
        </div>
    );
};

export default VerificationCode;
