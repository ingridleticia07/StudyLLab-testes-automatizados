const subjectsFixture = {
  adminSubjectsURL: 'https://admin.studyllab.com.br/disciplinas',
  courses: {
    software: { value: 'ES', label: 'Engenharia de software' },
    computing: { value: 'CC', label: 'Ciencia da computacao' },
    civil: { value: 'EC', label: 'Engenharia civil' },
    production: { value: 'EP', label: 'Engenharia de producao' },
    mechanics: { value: 'EM', label: 'Engenharia mecanica' },
  },
  filters: {
    all: 'Todos os curso',
    software: 'Engenharia de software',
    computing: 'Ciência da computação',
    civil: 'Engenharia Civil',
    production: 'Engenharia de produção',
    mechanics: 'Engenharia mecânica',
  },
  register: {
    defaultCourse: 'ES',
    defaultProfessor: 'Professor Automacao',
    defaultStudentsCount: '50',
  },
  messages: {
    requiredCode: '*Insira o codigo da disciplina',
    requiredName: '*Insira o nome da disciplina',
    requiredProfessor: '*Insira o professor(a) responsavel',
    requiredStudentsCount: '*Insira a quantidade de alunos',
    studentsCountMin: 'O valor deve ser maior ou igual a 1',
    studentsCountMinAlternatives: [
      'O valor deve ser maior ou igual a 1',
      'Value must be greater than or equal to 1',
    ],
    studentsCountValidValue: 'Insira um valor valido',
    studentsCountValidValueAlternatives: [
      'Insira um valor valido',
      'Value must be valid',
      'Enter a valid value',
      'Please enter a valid value',
      'valid value',
    ],
    requiredCourse: '*Insira o curso da disciplina',
    noChangesDetected: 'Nenhuma alteracao detectada.',
    requiredFieldsEdit: 'Por favor, preencha todos os campos obrigatorios.',
    deleteConfirmationText: 'Tem certeza de que deseja excluir:',
    irreversibleAction: 'Esta acao e irreversivel.',
    duplicateSubject: 'Disciplina existente',
    dependentDeleteWarning: 'Verifique se algum topico possui esta disciplina!',
  },
  placeholders: {
    code: 'xxxxxx',
    name: 'Digite o nome da disciplina',
    professor: 'Nome do professor',
    studentsCount: 'Quantidade de alunos',
    course: 'Selecione o curso',
  },
  labels: {
    code: 'Codigo da Disciplina',
    name: 'Nome da Disciplina',
    professor: 'Professor(a) Responsavel',
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
    professor: overrides.professor ?? 'Professor Automacao',
    studentsCount: overrides.studentsCount ?? '50',
    course: overrides.course ?? subjectsFixture.register.defaultCourse,
    courseLabel: overrides.courseLabel ?? subjectsFixture.courses.software.label,
  };
}

module.exports = { subjectsFixture, buildTestSubject, buildAutoSubjectSuffix };
