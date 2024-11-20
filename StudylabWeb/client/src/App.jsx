import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import PassowordEmail from './pages/PassowordEmail';
import VerificationCode from './pages/VerificationCode';
import ResetPassword from './pages/ResetPassword';

function App() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-americanOrange-500'>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Register />} />
                <Route path='/recuperar' element={<PassowordEmail />} />
                <Route path='/verificacao' element={<VerificationCode />} />
                <Route path='/senha' element={<ResetPassword />} />
                <Route path='/termos' element={<Terms />} />
            </Routes>
        </div>
    );
}

export default App;
