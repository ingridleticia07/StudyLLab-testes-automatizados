import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import Users from './pages/Users';
import Materials from './pages/Materials';
import Report from './pages/Report';
import Help from './pages/Help';

function App() {
    return (
        <div className=' flex min-h-screen bg-slate-200'>
            <div>
                <Menu />
                <Sidebar />
            </div>

            <main className='w-full mt-28 mx-4'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/disciplinas' element={<Subjects />} />
                    <Route path='/usuarios' element={<Users />} />
                    <Route path='/conteudos' element={<Materials />} />
                    <Route path='/denucias' element={<Report />} />
                    <Route path='/ajuda' element={<Help />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
