using StudyLabAPI.Models.User;

namespace StudyLabAPI.Models.Forum.DTOs
{
    public record RespostaForumReadModel
    {
        public int idResposta { get; init; }

        public string resposta { get; init; }

        public DateOnly dataResposta { get; init; }

        public TopicoDiscussaoModel topicoDiscussao { get; init; }

        public UsuarioModel usuario { get; init; }
    }
}
