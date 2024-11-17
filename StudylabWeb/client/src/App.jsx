import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <div className='flex min-h-screen bg-americanOrange-500'>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Register />} />
                <Route />
                <Route />
                <Route />
                <Route />
                <Route />
            </Routes>
        </div>
    );
}

export default App;
