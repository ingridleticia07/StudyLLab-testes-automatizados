using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models
{
    [Table("disciplina")]
    public class DisciplinaModel
    {
        [Key]
        [Column("id_disciplina")]
        public int idDisciplina { get; set; }
        [Column("nome_disciplina")]
        [MaxLength(45)]
        public string nomeDisciplina { get; set; }

        [Column("professor_disciplina")]
        [Required]
        [MaxLength(45)]
        public string professorDisciplina { get; set; }
        [ForeignKey("id_curso")] public int fk_curso { get; set; }

        public CursoModel idCurso { get; set; }

        [Column("quantidade_aluno")]
        public int quantidadeDluno { get; set; }

        [Column("codigo_disciplina")]
        public string codigoDisciplina { get; set; }

    }
}
