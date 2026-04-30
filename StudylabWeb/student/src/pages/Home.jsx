import InfoCards from '../components/InfoCards/InfoCards';
import { FileText, ChevronRight, BookOpen } from 'lucide-react';

const Home = () => {
    return (
        <div className='w-full h-full text-gray-700'>
            <InfoCards />

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-8'>
                <section className='lg:col-span-2 flex flex-col p-6 rounded-xl bg-white'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Ultimos Materiais Acessados</h2>
                        <button className="text-sm text-americanOrange-500 font-semibold hover:underline flex items-center">
                            Ver todos
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-lg text-americanOrange-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">Prova de PAA - 2025.2</p>
                                    <p className="text-xs text-slate-500 mt-1">Projeto e Análise de Algoritmos • Acessado há 1 hora</p>
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
                                    <p className="font-semibold text-slate-700">Prova de SD - 2025.2</p>
                                    <p className="text-xs text-slate-500 mt-1">Sistemas Distribuídos • Acessado há 3 hora</p>
                                </div>
                            </div>
                            <button className="hidden sm:block text-sm font-medium text-slate-600 bg-white border border-slate-300 px-4 py-2 rounded-md shadow-sm hover:bg-slate-50">
                                Abrir
                            </button>
                        </div>
                    </div>
                    
                                        
                </section>
                <aside className='flex-grow flex flex-col rounded-xl bg-white p-6'>
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen className="text-americanOrange-500" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">Minhas Disciplinas</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <p className="font-semibold text-slate-700 text-sm">Cálculo 2</p>
                            <button className="text-xs text-americanOrange-500 font-semibold hover:underline flex items-center">
                                Ver materiais <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <p className="font-semibold text-slate-700 text-sm">FUP</p>
                            <button className="text-xs text-americanOrange-500 font-semibold hover:underline flex items-center">
                                Ver materiais <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <p className="font-semibold text-slate-700 text-sm">Estrutura de Dados</p>
                            <button className="text-xs text-americanOrange-500 font-semibold hover:underline flex items-center">
                                Ver materiais <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                            <p className="font-semibold text-slate-700 text-sm">Redes de Computadores</p>
                            <button className="text-xs text-americanOrange-500 font-semibold hover:underline flex items-center">
                                Ver materiais <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <button className="w-full mt-auto pt-6 text-sm font-semibold text-americanOrange-500 hover:text-americanOrange-700 transition-colors">
                        Ver todas as disciplinas
                    </button>
                </aside>
                
            </div>
        </div>
    );
};

export default Home;
