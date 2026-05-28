const usersFixture = {
  baseURL: 'https://studyllab.com.br/',
  adminUsersURL: 'https://admin.studyllab.com.br/usuarios',
  apiBaseURL: 'https://api.studyllab.com.br',
  apiKey: 'e24dd2210803b4737a9bd9e3163a4ca807b63201c3bc32b68fb122ca52efff36',
  filters: {
    status: {
      all: 'Todos os status',
      active: 'Ativo',
      inactive: 'Inativo',
    },
    type: {
      all: 'Todos os tipos',
      admin: 'Admin',
      student: 'Aluno',
      professor: 'Professor',
    },
  },
  courses: {
    ES: 'Engenharia de Software',
    CC: 'Ciência da Computação',
    EC: 'Engenharia Civil',
    EP: 'Engenharia de Produção',
    EM: 'Engenharia Mecânica',
  },
  register: {
    invalidEmail: 'usuario@gmail.com',
    malformedInstitutionalEmail: 'usuario@alu.ufc.com.br',
    shortPassword: 'Aa1',
    weakPassword: 'senha1234',
    lettersOnlyMatricula: 'matric',
    defaultCourse: 'ES',
    defaultRole: 'student',
    defaultPassword: 'Senha1234',
  },
  limits: {
    nameMaxLength: 45,
  },
  messages: {
    requiredName: '*Insira o nome',
    requiredCourse: '*Insira o curso',
    requiredRole: '*Insira o tipo de usuário',
    requiredMatricula: '*Insira a matrícula/siape',
    requiredEmailInstitutional: '*Insira um email institucional válido',
    requiredPassword: '*A senha precisa ter no mínimo 8 caracteres e deve conter números e letras minúsculas e maiúsculas',
    duplicateUser: 'Já existe um usuário com esta matrícula ou email!',
    noChangesDetected: 'Nenhuma alteração detectada.',
    deleteConfirmationTitle: 'Confirmar exclusão',
    deleteConfirmationText: 'Tem certeza de que deseja excluir:',
    irreversibleAction: 'Esta ação é irreversível.',
  },
};

function buildTestStudentUser() {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-5);

  return {
    name: `Usuario Automacao 5${suffix}`,
    matricula: `5${suffix}`,
    email: `usuario.automacao5${suffix}@alu.ufc.br`,
    password: usersFixture.register.defaultPassword,
    course: usersFixture.register.defaultCourse,
    role: usersFixture.register.defaultRole,
  };
}

module.exports = { usersFixture, buildTestStudentUser };
