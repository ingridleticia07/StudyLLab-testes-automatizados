using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using StudyLabAPI.Models.Curso;

namespace StudyLabAPI.Models.Disciplina
{
    [Table("disciplina")]
    public class DisciplinaModel
    {
        [Key]
        [Column("id_disciplina")]
        public int idDisciplina { get; set; }

        [Column("nome_disciplina")]
        [Required]
        [MaxLength(45)]
        public string nomeDisciplina { get; set; }

        [Column("professor_disciplina")]
        [Required]
        [MaxLength(45)]
        public string professorDisciplina { get; set; }

        [ForeignKey("fk_curso")]
        public CursoModel curso { get; set; }

        [Column("quantidade_aluno")]
        public int ?quantidadeAluno { get; set; }

        [Column("codigo_disciplina")]
        [MaxLength(10)]
        public string ?codigoDisciplina { get; set; }

    }
}
