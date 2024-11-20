import { Link } from 'react-router-dom';
const Terms = () => {
    return (
        <div>
            <div className='my-10'>
                <h1 className='text-white text-center text-4xl font-urbanist '>
                    Study
                    <span className='font-bold'>Lab</span>
                </h1>
            </div>
            <div className='bg-white rounded-lg px-10 text-gray-700 py-10 mb-10 w-[800px]'>
                <h1 className='text-3xl text-center font-bold mb-5'>
                    Termos de serviços
                </h1>
                <p>
                    Bem-vindo(a) aos nossos Termos de Serviço! O objetivo desta
                    política é explicar os nossos serviços e as suas obrigações
                    como usuário(a). Ao acessar e utilizar os nossos serviços,
                    você concorda em cumprir com estes termos. Caso não concorde
                    com alguma disposição aqui estabelecida, por favor, não use
                    os nossos serviços.
                </p>
                <ol start={'1'} className='list-decimal space-y-2 ml-6'>
                    <li>
                        Descrição dos Serviços: Oferecemos serviços de
                        [descrição dos serviços oferecidos]. O acesso aos nossos
                        serviços está sujeito à disponibilidade e pode ser
                        interrompido a qualquer momento por questões técnicas ou
                        por qualquer outra razão.
                    </li>
                    <li>
                        Uso dos Nossos Serviços: ao utilizar os nossos serviços,
                        você concorda em não:
                        <ol className=' ml-6 space-y-2'>
                            <li>
                                (a) usar os nossos serviços para fins ilegais;
                            </li>
                            <li>(b) violar qualquer lei aplicável;</li>
                            <li>
                                (c) interferir na segurança ou integridade dos
                                nossos serviços ou de outros sistemas de
                                computadores;
                            </li>
                            <li>
                                (d) coletar informações pessoais de outros
                                usuários sem a sua autorização;
                            </li>
                            <li>
                                (e) enviar mensagens de spam ou outras
                                comunicações não solicitadas;
                            </li>
                            <li>
                                (f) fazer engenharia reversa, descompilar ou
                                desmontar qualquer parte dos nossos serviços.
                            </li>
                        </ol>
                    </li>
                    <li>
                        Propriedade Intelectual: Os nossos serviços e todo o
                        conteúdo relacionado (incluindo, mas não se limitando a,
                        textos, gráficos, logotipos, imagens e software) são
                        protegidos por direitos autorais, marcas registradas e
                        outras leis de propriedade intelectual. Você não pode
                        copiar, reproduzir, modificar, distribuir ou criar obras
                        derivadas do nosso conteúdo sem a nossa autorização
                        prévia por escrito.
                    </li>
                    <li>
                        Rescisão: Podemos rescindir ou suspender o seu acesso
                        aos nossos serviços a qualquer momento, por qualquer
                        motivo e sem aviso prévio.
                    </li>
                    <li>
                        Isenção de Responsabilidade: Não nos responsabilizamos
                        por danos diretos, indiretos, especiais, incidentais,
                        consequenciais ou punitivos resultantes do uso ou da
                        incapacidade de usar os nossos serviços, mesmo que
                        tenhamos sido informados da possibilidade de tais danos.
                    </li>
                    <li>
                        Alterações aos Termos de Serviço: Podemos atualizar
                        estes termos a qualquer momento, e recomendamos que você
                        os revise periodicamente. Seu uso continuado dos nossos
                        serviços após a publicação de quaisquer alterações a
                        estes termos constitui a sua aceitação dessas
                        alterações.
                    </li>
                </ol>
                <h2 className='text-3xl text-center font-bold text-gray-800 mt-10 mb-5'>
                    Política de Privacidade
                </h2>
                <p>
                    Esta Política de Privacidade descreve como nós, [nome da
                    empresa/organização], coletamos, usamos e divulgamos
                    informações pessoais dos nossos usuários. Ao utilizar nossos
                    serviços, você concorda com a coleta e uso de suas
                    informações pessoais de acordo com esta política.
                </p>
                <h3 className='font-semibold my-5 text-xl'>
                    Coleta de Informações
                </h3>
                <p>
                    Nós coletamos informações pessoais de diferentes maneiras,
                    incluindo:
                </p>
                <ol className='list-disc ml-6 space-y-2'>
                    <li>
                        Informações que você nos fornece: quando você se
                        registra em nossos serviços, solicita informações
                        adicionais ou se comunica conosco, podemos coletar
                        informações como nome, endereço de e-mail, endereço
                        físico, número de telefone e outras informações que você
                        nos forneça.
                    </li>
                    <li>
                        Informações que coletamos automaticamente: podemos
                        coletar informações sobre o seu uso dos nossos serviços,
                        incluindo o seu endereço IP, tipo de navegador, provedor
                        de serviços de Internet (ISP), páginas de
                        referência/saída, sistema operacional, data/hora e
                        informações de registro de cliques.
                    </li>
                    <li>
                        Cookies e tecnologias semelhantes: podemos usar cookies,
                        web beacons e outras tecnologias semelhantes para
                        coletar informações sobre como você usa nossos serviços
                        e fornecer uma melhor experiência para você. Você pode
                        configurar seu navegador para recusar todos os cookies
                        ou para indicar quando um cookie está sendo enviado.
                    </li>
                </ol>

                <h3 className='font-semibold my-5 text-xl'>
                    Uso de Informações
                </h3>
                <p>Usamos suas informações pessoais para:</p>
                <ol className='list-disc ml-6 space-y-2'>
                    <li>
                        Fornecer e manter nossos serviços: usamos suas
                        informações para operar, manter e melhorar nossos
                        serviços.
                    </li>
                    <li>
                        Personalizar sua experiência: podemos usar suas
                        informações para fornecer conteúdo personalizado e
                        recomendações de produtos/serviços com base em suas
                        preferências e histórico de uso.
                    </li>
                    <li>
                        Comunicação: podemos usar suas informações para nos
                        comunicar com você sobre nossos serviços, promoções e
                        outras informações relevantes.
                    </li>
                </ol>

                <h3 className='font-semibold my-5 text-xl'>
                    Divulgação de Informações
                </h3>
                <p>
                    Não vendemos suas informações pessoais para terceiros. No
                    entanto, podemos divulgar suas informações para:
                </p>
                <ol className='list-disc ml-6 space-y-2'>
                    <li>
                        Fornecedores de serviços: podemos compartilhar suas
                        informações com terceiros que nos prestam serviços, como
                        processamento de pagamentos, análise de dados e
                        gerenciamento de campanhas de marketing.
                    </li>
                    <li>
                        Cumprimento de obrigações legais: podemos divulgar suas
                        informações se exigido por lei ou se acreditarmos de
                        boa-fé que a divulgação é necessária para proteger
                        nossos direitos ou cumprir uma obrigação legal.
                    </li>
                </ol>
                <h3 className='font-semibold my-5 text-xl'>
                    Segurança de Informações
                </h3>
                <p>
                    Tomamos medidas razoáveis para proteger suas informações
                    pessoais contra acesso não autorizado, alteração, divulgação
                    ou destruição. No entanto, nenhuma transmissão pela Internet
                    é totalmente segura, e não podemos garantir a segurança das
                    informações que você nos fornece.
                </p>
                <h3 className='font-semibold my-5 text-xl'>
                    Alterações nesta Política de Privacidade
                </h3>
                <p>
                    Podemos atualizar esta Política de Privacidade de tempos em
                    tempos. Você deve verificar esta página periodicamente para
                    se manter atualizado sobre quaisquer alterações. Se fizermos
                    alterações significativas nesta política, notificaremos você
                    por meio de um aviso em nosso site ou por e-mail.
                </p>
                <h3 className='font-semibold my-5 text-xl'>Contato</h3>
                <p>
                    Se você tiver alguma dúvida ou preocupação sobre esta
                    Política de Privacidade, entre em contato conosco.
                </p>
                <div className='w-full flex justify-center'>
                    <button className='text-americanOrange-500 font-medium mt-10 hover:text-amber-600'>
                        <Link to={'/'}>Eu aceito os termos</Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Terms;
