namespace StudyLabAPI.Models
{
    public class RespostaForumReadModel
    {
        public int idResposta { get; set; }

        public string resposta { get; set; }

        public DateOnly dataResposta { get; set; }

        public TopicoDiscussaoModel topicoDiscussao { get; set; }

        public UsuarioModel usuario { get; set; }
    }
}
