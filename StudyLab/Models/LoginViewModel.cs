using System.ComponentModel.DataAnnotations;

namespace StudyLab.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Informe o nome de usuário")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Informe a senha")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public string ReturnUrl { get; set; }
    }
}
