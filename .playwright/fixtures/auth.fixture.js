const authFixture = {
  baseURL: 'https://studyllab.com.br/login',
  adminURL: 'https://admin.studyllab.com.br/',
  admin: {
    email: 'study@alu.ufc.br',
    password: 'study2025',
  },
  professor: {
    email: 'ingridleticiaprofessora@alu.ufc.br',
    password: 'Senha123',
  },
  invalid: {
    emailNotFound: 'naoexiste@alu.ufc.br',
    wrongPassword: 'senhaerrada123',
    invalidEmail: 'study@gmail.com',
    shortPassword: 'senha',
    specialCharsEmail: 'study@@alu.ufc.br',
    spacedEmail: '     study@alu.ufc.br ',
  },
  messages: {
    invalidCredentials: 'Email e/ou senha incorreto(s)!',
    emptyCredentials: 'Preencha os campos email e senha corretamente!',
    logoutConfirmation: 'Clique em ok para sair!',
  },
};

module.exports = { authFixture };
