import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import PassowordEmail from './pages/PassowordEmail';
import VerificationCode from './pages/VerificationCode';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';
import About from './pages/About';
import Register2 from './pages/Register2';
import LoginVerification from './pages/LoginVerification';

function App() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-americanOrange-500'>
            <Routes>
                {/* Rotas da tela de cadastro */}
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Register />} />
                <Route path='/recuperar' element={<PassowordEmail />} />
                <Route path='/verificacao' element={<VerificationCode />} />
                <Route path='/senha' element={<ResetPassword />} />
                <Route path='/termos' element={<Terms />} />
                <Route path='/inicio' element={<LandingPage />} />
                <Route path='/contato' element={<Contact />} />
                <Route path='/sobre' element={<About />} />
                <Route
                    path='/LoginVerification'
                    element={<LoginVerification />}
                />
            </Routes>
        </div>
    );
}

export default App;
