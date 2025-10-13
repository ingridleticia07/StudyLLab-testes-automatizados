import { useEffect, useState } from 'react';
import { StudylabContext } from './StudylabContext';
import * as dataFake from '../data/dataFake';

export const StudylabContextProvider = ({ children }) => {
    const [user, setUser] = useState({ imgProfile: '', notification: 0 });
    const [data, setData] = useState({
        disciplinas: [],
        usuarios: [],
        conteudos: [],
        denuncias: [],
    });

    useEffect(() => {
        setTimeout(() => {
            setUser({
                imgProfile: '',
                notification: null,
            });
            setData({
                disciplinas: dataFake.disciplinas,
                usuarios: dataFake.usuarios,
                conteudos: dataFake.conteudos,
                denuncias: dataFake.denuncias,
            });
        }, 300);
    }, []);

    const searchSubject = (id) => {
        return data.disciplinas.filter((item) => item.id === id)[0];
    };

    const editSubject = (item) => {
        setData((prevData) => {
            const updatedDisciplinas = prevData.disciplinas.map((disciplina) =>
                disciplina.id === item.id
                    ? { ...disciplina, ...item }
                    : disciplina
            );
            return {
                ...prevData,
                disciplinas: updatedDisciplinas,
            };
        });
    };

    const removeItem = (id, key) => {
        setData((prev) => ({
            ...prev,
            [key]: prev[key].filter((item) => item.id !== id),
        }));
    };

    const removeUsers = (id) => {
        setData((prev) => ({
            ...prev,
            usuarios: prev.usuarios.filter((user) => user.id !== id),
        }));
    };
    const contextValeu = {
        data,
        user,
        searchSubject,
        editSubject,
        removeItem,
        removeUsers,
    };

    return (
        <StudylabContext.Provider value={contextValeu}>
            {children}
        </StudylabContext.Provider>
    );
};

// const removerDisciplina = (codigo) => {
//     setData((prev) => prev.filter((turma) => turma.codigo !== codigo));
// };

// const removeItem = (id, key) => {
//     setData((prev) => ({
//         ...prev,
//         [key]: prev[chave].filter((item) => item.)
//     }))
// };
