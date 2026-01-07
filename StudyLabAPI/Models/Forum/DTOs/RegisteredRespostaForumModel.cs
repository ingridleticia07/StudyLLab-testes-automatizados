namespace StudyLabAPI.Models.Forum.DTOs
{
    public class RegisteredRespostaForumModel
    {
        public int idResposta { get; set; }

        public string resposta { get; set; }

        public DateOnly dataResposta { get; set; }

        public int topicoDiscussao { get; set; }

        public int usuario { get; set; }
    }
}
