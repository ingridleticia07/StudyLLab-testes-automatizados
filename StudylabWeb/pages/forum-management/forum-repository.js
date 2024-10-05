
import { getAllDisciplinas} from "../../assets/js/lib/services/disciplina.js";
import { getAllTopicosDisciplina} from "../../assets/js/lib/services/topico.js";

const topicoFilter = document.querySelector("#topico-filter");
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

export async function copulateTopicoFilter(){
    try {
        const topicos = await getAllTopicosDisciplina();
        addTopico(topicos);

    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}