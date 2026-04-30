import Cards from '../Cards/Cards';
import {Download,BookOpen,Upload, Bell} from 'lucide-react';

const InfoCards = () => {
    return (
        <section className='flex justify-around py-4 mb-4 rounded-xl bg-white'>
            <Cards
                text='Materiais Baixados'
                number={1400}
                icon={<Download className="w-8 h-8 text-americanOrange-500" />}
            />
            <Cards
                text='Disciplinas Seguidas'
                number={150}
                icon={<BookOpen className="w-8 h-8 text-americanOrange-500" />}
            />
            <Cards
                text='Materiais Enviados'
                number={2500}
                icon={<Upload className="w-8 h-8 text-americanOrange-500" />}
            />
            <Cards
                text='Notificações'
                number={400}
                division={false}
                icon={<Bell className="w-8 h-8 text-americanOrange-500" />}
            />
        </section>
    );
};

export default InfoCards;
