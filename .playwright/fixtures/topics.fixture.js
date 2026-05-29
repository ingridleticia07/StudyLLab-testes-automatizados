const topicsFixture = {
  adminTopicsURL: 'https://admin.studyllab.com.br/topicos',
  apiBaseURL: 'https://api.studyllab.com.br',
  apiKey: 'e24dd2210803b4737a9bd9e3163a4ca807b63201c3bc32b68fb122ca52efff36',
  filters: {
    all: 'Todas as disciplinas',
  },
  messages: {
    requiredName: '*Insira o nome do tópico',
    requiredSubject: '*Insira a disciplina do tópico',
    duplicateTopic: 'Tópico discussão existente',
    registerFallbackError: 'Erro ao cadastrar tópico.',
    editFallbackError: 'Erro ao editar tópico.',
    deleteSuccess: 'Item Deletado',
    deleteConfirmationText: 'Tem certeza de que deseja excluir:',
    irreversibleAction: 'Esta ação é irreversível.',
  },
  labels: {
    topicName: 'Nome do tópico',
    subject: 'Disciplina',
  },
  placeholders: {
    topicName: 'Digite o nome do tópico',
    subject: 'Selecione...',
  },
};

function buildTestTopic(overrides = {}) {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 100)}`.slice(-5);

  return {
    name: overrides.name ?? `Tópico Automacao ${suffix}`,
    subjectName: overrides.subjectName ?? '',
  };
}

function buildTestForumResponse(overrides = {}) {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 100)}`.slice(-5);

  return {
    text: overrides.text ?? `Resposta automacao topicos ${suffix}`,
  };
}

module.exports = { topicsFixture, buildTestTopic, buildTestForumResponse };
