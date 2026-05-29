const subjectsFixture = {
  adminSubjectsURL: 'https://admin.studyllab.com.br/disciplinas',
  courses: {
    software: { value: 'ES', label: 'Engenharia de software' },
    computing: { value: 'CC', label: 'Ciência da computação' },
    civil: { value: 'EC', label: 'Engenharia civil' },
    production: { value: 'EP', label: 'Engenharia de produção' },
    mechanics: { value: 'EM', label: 'Engenharia mecânica' },
  },
  filters: {
    all: 'Todos os curso',
    software: 'Engenharia de software',
    computing: 'Ciência da computação',
    civil: 'Engenharia civil',
    production: 'Engenharia de produção',
    mechanics: 'Engenharia mecânica',
  },
  register: {
    defaultCourse: 'ES',
    defaultProfessor: 'Professor Automacao',
    defaultStudentsCount: '50',
  },
  messages: {
    requiredCode: '*Insira o código da disciplina',
    requiredName: '*Insira o nome da disciplina',
    requiredProfessor: '*Insira o professor(a) responsável',
    requiredStudentsCount: '*Insira a quantidade de alunos',
    studentsCountMin: 'O valor deve ser maior ou igual a 1',
    studentsCountValidValue: 'Insira um valor válido',
    requiredCourse: '*Insira o curso da disciplina',
    noChangesDetected: 'Nenhuma alteração detectada.',
    requiredFieldsEdit: 'Por favor, preencha todos os campos obrigatórios.',
    deleteConfirmationText: 'Tem certeza de que deseja excluir:',
    irreversibleAction: 'Esta ação é irreversível.',
    duplicateSubject: 'Disciplina existente',
    dependentDeleteWarning: 'Verifique se algum tópico, possui está disciplina!',
  },
  placeholders: {
    code: 'xxxxxx',
    name: 'Digite o nome da disciplina',
    professor: 'Nome do professor',
    studentsCount: 'Quantidade de alunos',
    course: 'Selecione o curso',
  },
  labels: {
    code: 'Código da Disciplina',
    name: 'Nome da Disciplina',
    professor: 'Professor(a) Responsável',
    studentsCount: 'Quantidade de Alunos',
    course: 'Curso',
  },
};

function buildAutoSubjectSuffix() {
  const numericPortion = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-5);
  return `5${numericPortion}`;
}

function buildTestSubject(overrides = {}) {
  const suffix = buildAutoSubjectSuffix();

  return {
    code: overrides.code ?? `RUS${suffix}`,
    name: overrides.name ?? `[AUTO] Disciplina Base ${suffix}`,
    professor: overrides.professor ?? `Professor Automação`,
    studentsCount: overrides.studentsCount ?? '50',
    course: overrides.course ?? subjectsFixture.register.defaultCourse,
    courseLabel:
      overrides.courseLabel ??
      subjectsFixture.courses.software.label,
  };
}

module.exports = { subjectsFixture, buildTestSubject, buildAutoSubjectSuffix };
