using StudyLabAPI.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyLabAPI.Models
{
    [Table("documento")]
    public class DocumentoModel
    {
        [Key]

        [Column("id_documento")]
        public int idDocumento { get; set; }

        [Column("data_documento")]
        public DateOnly dataCadastro { get; set; }

        [Column("diretorio_material")]
        public string diretorioMaterial { get; set; }

        [Column("tipo_material")]
        public tipoMaterialEnum tipoMaterial { get; set; }

        [Column("status")]
        public statusDocumentoEnum status { get; set; }

        [ForeignKey("fk_topico")]

        public TopicoDiscussaoModel topico { get; set; }

        [Column("tipo_arquivo")]
        public tipoArquivo tipoArquivo { get; set; }

        [ForeignKey("fk_usuario")]
        public UsuarioModel usuario { get; set; }

        [ForeignKey("fk_professor")]
        public UsuarioModel professor {get;set;}


    }
}
