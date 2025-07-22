import { instance } from "./axios.js";
import { getCursoCodeByName } from "../utils/curso_matcher.js";

const DISCIPLINA_ENDPOINT = "/disciplina";

export async function getAllDisciplinasWithPagination(page, pageSize, idCurso) {
    let response = await instance.get(DISCIPLINA_ENDPOINT+
      "/listarDisciplinasWithPagination?page="+page+"&pageSize="+pageSize+"&idCurso="+idCurso);
  
    if (response.status !== 200) {
      return null;
    }
    return response.data;
}

export async function getAllDisciplinas(page, pageSize) {
  let response = await instance.get(DISCIPLINA_ENDPOINT+
    "/listarDisciplinas");

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function createDisciplina(disciplina) {
  const cursoCode = getCursoCodeByName(disciplina.curso);
  
  let response = await instance.post(DISCIPLINA_ENDPOINT+"/cadastrarDisciplina",{
    nomeDisciplina:disciplina.nomeDisciplina,
    professorDisciplina:disciplina.professorDisciplina,
    curso:cursoCode,
    quantidadeAluno:disciplina.quantidadeAluno,
    codigoDisciplina:disciplina.codigoDisciplina
  });

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function editarDisciplina(disciplina) {
  
  let response = await instance.put(DISCIPLINA_ENDPOINT+"/editarDisciplina",{
    idDisciplina:disciplina.idDisciplina,
    nomeDisciplina:disciplina.nomeDisciplina,
    professorDisciplina:disciplina.professorDisciplina,
    fkProfessor:disciplina.fkProfesor,
    curso:disciplina.curso,
    quantidadeAluno:disciplina.quantidadeAluno,
    codigoDisciplina:disciplina.codigoDisciplina
  });

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}

export async function deleteDisciplina(idDisciplina) {
  let response = await instance.delete(DISCIPLINA_ENDPOINT+
    "/excluirDisciplina?disciplinaIdentifier="+idDisciplina);

  if (response.status !== 200) {
    return null;
  }
  return response.data;
}