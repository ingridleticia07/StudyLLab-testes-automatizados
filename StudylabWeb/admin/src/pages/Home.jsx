import InfoCards from '../components/InfoCards/InfoCards';
import { FileText, TrendingUp, ChevronRight } from 'lucide-react';

const Home = () => {
    return (
        <div className='w-full h-full text-gray-700'>
            <InfoCards />
            
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-8'>
                
                <section className='lg:col-span-2 flex flex-col p-6 rounded-xl bg-white shadow-sm border border-slate-100'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Últimos Materiais Adicionados</h2>
                        <button className="text-sm text-americanOrange-500 font-semibold hover:underline flex items-center">
                            Ver todos <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-lg text-americanOrange-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">Resumo de Sistemas Distribuídos e Web</p>
                                    <p className="text-xs text-slate-500 mt-1">Adicionado por Aluno • Há 2 horas</p>
                                </div>
                            </div>
                            <button className="hidden sm:block text-sm font-medium text-slate-600 bg-white border border-slate-300 px-4 py-2 rounded-md shadow-sm hover:bg-slate-50">
                                Abrir
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-lg text-americanOrange-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">Lista de Exercícios - FUP</p>
                                    <p className="text-xs text-slate-500 mt-1">Adicionado por Prof. Jacilane Rabelo • Há 5 horas</p>
                                </div>
                            </div>
                            <button className="hidden sm:block text-sm font-medium text-slate-600 bg-white border border-slate-300 px-4 py-2 rounded-md shadow-sm hover:bg-slate-50">
                                Abrir
                            </button>
                        </div>
                    </div>
                </section>

                <aside className='flex flex-col rounded-xl bg-white p-6 shadow-sm border border-slate-100'>
    <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-americanOrange-500" size={20} />
        <h2 className="text-lg font-bold text-slate-800">Fórum em Alta</h2>
    </div>

    <div className="flex flex-col gap-5">
        <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <h3 className="font-semibold text-slate-700 text-sm hover:text-americanOrange-500 cursor-pointer transition-colors">
                Alguém tem prova antiga de Cálculo 2 do Prof. João?
            </h3>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> 12 respostas • Última há 5 min
            </p>
        </div>

        <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <h3 className="font-semibold text-slate-700 text-sm hover:text-americanOrange-500 cursor-pointer transition-colors">
                Resumo de FUP disponível para P2?
            </h3>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> 8 respostas • Última há 20 min
            </p>
        </div>

        <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <h3 className="font-semibold text-slate-700 text-sm hover:text-americanOrange-500 cursor-pointer transition-colors">
                Alguém tem lista de exercícios de Estrutura de Dados?
            </h3>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-americanOrange-500"></span> 5 respostas • Última hoje cedo
            </p>
        </div>
    </div>

    <button className="w-full mt-auto pt-6 text-sm font-semibold text-americanOrange-600 hover:text-americanOrange-700 transition-colors">
        Ir para o Fórum Completo
    </button>
</aside>
                
            </div>
        </div>
    );
};

export default Home;