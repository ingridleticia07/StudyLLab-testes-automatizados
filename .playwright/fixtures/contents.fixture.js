const path = require('path');

const contentsFixture = {
  adminContentsURL: 'https://admin.studyllab.com.br/conteudos',
  studentContentsURL: 'https://student.studyllab.com.br/conteudos',
  apiBaseURL: 'https://api.studyllab.com.br',
  apiKey: 'e24dd2210803b4737a9bd9e3163a4ca807b63201c3bc32b68fb122ca52efff36',
  filters: {
    allSubjects: 'Todas as disciplinas',
    allTopics: 'Todas os tópicos',
  },
  materialTypes: {
    prova: { value: '1', label: 'Prova' },
    trabalho: { value: '2', label: 'Trabalho' },
    artigo: { value: '3', label: 'Artigo' },
    tarefa: { value: '4', label: 'Tarefa' },
    pesquisa: { value: '5', label: 'Pesquisa' },
    tcc: { value: '6', label: 'Tcc' },
    outros: { value: '7', label: 'Outros' },
  },
  messages: {
    requiredFiles: '*Insira ao menos um arquivo, até 3 imagens ou 1 pdf.',
    requiredType: '*Insira o tipo de material.',
    requiredTopic: '*Insira o tópico.',
    uploadSuccess: 'Upload realizado com sucesso!',
    uploadError: 'Erro no upload!',
    deleteSuccess: 'Item Deletado',
    deletePermissionWarning: 'Verifique se alguma denúncia, possui este material!',
    deleteConfirmationTitle: 'Confirmar exclusão',
    deleteConfirmationText: 'Tem certeza de que deseja excluir:',
    irreversibleAction: 'Esta ação é irreversível.',
    emptyList: 'Nenhum registro encontrado!',
    maxImagesError: 'You can upload up to two image files or one PDF file.',
    mixedPdfError: 'Cannot upload multiple files if one is a PDF.',
    oversizedFileError: 'File size exceeds the 2MB limit.',
    unsupportedFileError: 'Unsupported file type.',
  },
  files: {
    pdf: path.join(__dirname, 'files', 'contents', 'sample-document.pdf'),
    image1: path.join(__dirname, 'files', 'contents', 'sample-image-1.jpg'),
    image2: path.join(__dirname, 'files', 'contents', 'sample-image-2.jpg'),
    image3: path.join(__dirname, 'files', 'contents', 'sample-image-3.webp'),
    unsupported: path.join(__dirname, 'files', 'contents', 'unsupported.txt'),
    oversizedImage: path.join(__dirname, 'files', 'contents', 'oversized-image.png'),
  },
  student: {
    email: 'ingridleticia@alu.ufc.br',
    password: 'Senha123',
  },
};

module.exports = { contentsFixture };
