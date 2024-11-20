import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';

function App() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-americanOrange-500'>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Register />} />
                <Route path='/termos' element={<Terms />} />
                <Route />
                <Route />
                <Route />
                <Route />
            </Routes>
        </div>
    );
}

export default App;
