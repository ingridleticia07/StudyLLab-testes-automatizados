
import { getAllDisciplinas} from "../../assets/js/lib/services/disciplina.js";
import { getAllTopicosDisciplina,getAllTopicosDisciplinaByDisciplina} from "../../assets/js/lib/services/topico.js";

const topicoFilter = document.querySelector("#topico-filter");
const topicoFilterModal = document.querySelector("#topico-filter-modal");
const disciplinaFilter = document.querySelector("#disciplina-filter");

export function addDisciplinas(disciplinas){
    
    disciplinas.forEach(optionData => {
      const option = document.createElement('option');
      option.value = optionData.idDisciplina;
      option.text = optionData.nomeDisciplina;
      disciplinaFilter.appendChild(option);
    });
}

export async function copulateDisciplinaFilter(){
    try {
        const disciplinas = await getAllDisciplinas();
        addDisciplinas(disciplinas);

    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}

export function addTopico(topicos){
  
    topicos.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.idTopico;
        option.text = optionData.nomeTopico;
        topicoFilter.appendChild(option);
    });
}

export function addTopicoForModal(topicosFilter){
  
    topicosFilter.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.idTopico;
        option.text = optionData.nomeTopico;
        topicoFilterModal.appendChild(option);
    });
}

export async function copulateTopicoFilter(){
    try {
        const topicos = await getAllTopicosDisciplina();
        addTopico(topicos);

    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}

export async function copulateTopicoFilterByDisciplina(idDisciplina){
    try {
        const topicos = await getAllTopicosDisciplinaByDisciplina(idDisciplina);
        addTopicoForModal(topicos);

    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}