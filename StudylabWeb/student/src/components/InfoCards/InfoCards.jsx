import Cards from '../Cards/Cards';

const InfoCards = () => {
    return (
        <section className='flex justify-around py-4 mb-4 rounded-xl bg-white'>
            <Cards
                text='Total de Usuários'
                number={1400}
            />
            <Cards
                text='Disciplinas Cadastradas'
                number={150}
            />
            <Cards
                text='Conteúdos Publicados'
                number={2500}
            />
            <Cards
                text='Total de Denúncias'
                number={400}
                division={false}
            />
        </section>
    );
};

export default InfoCards;
