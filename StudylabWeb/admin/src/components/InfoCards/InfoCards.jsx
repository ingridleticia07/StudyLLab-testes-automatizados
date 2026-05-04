import Cards from '../Cards/Cards';
import{Users, BookOpen, FileText, Flag} from 'lucide-react';

const InfoCards = () => {
    return (
        <section className='flex justify-around py-4 mb-4 rounded-xl bg-white'>
            <Cards
                text='Total de Usuários'
                number={1400}
                icon={<Users size={28} className="text-americanOrange-500" />}
            />
            <Cards
                text='Disciplinas Cadastradas'
                number={150}
                icon={<BookOpen size={28} className="text-americanOrange-500" />}
            />
            <Cards
                text='Conteúdos Publicados'
                number={2500}
                icon={<FileText size={28} className="text-americanOrange-500" />}
            />
            <Cards
                text='Total de Denúncias'
                number={400}
                division={false}
                icon={<Flag size={28} className="text-americanOrange-500" />}
            />
        </section>
    );
};

export default InfoCards;
