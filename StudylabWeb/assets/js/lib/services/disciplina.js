import { instance } from "./axios.js";

const DISCIPLINA_ENDPOINT = "/disciplina";

export async function getAllDisciplinas(page, pageSize) {
    let response = await instance.get(DISCIPLINA_ENDPOINT+"/listarDisciplinas");
  
    if (response.status !== 200) {
      return null;
    }
    return response.data;
}

export async function createDisciplina(disciplina) {
  let response = await instance.post(DISCIPLINA_ENDPOINT+"/cadastrarDisciplina",{
    nomeDisciplina:disciplina.nomeDisciplina,
    professorDisciplina:disciplina.professorDisciplina,
    curso:disciplina.curso,
    quantidadeAluno:disciplina.quantidadeAluno,
    codigoDisciplina:disciplina.codigoDisciplina
  });

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}