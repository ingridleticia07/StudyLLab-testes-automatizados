using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;

namespace StudyLabAPI.Repositories
{
    public class TopicoDiscussaoRepository : ITopicoDiscussaoRepository
    {
        private AppDbContext dbContext { get; }
        public TopicoDiscussaoRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<List<TopicoDiscussaoModel>> GetAllTopicosDiscussao()
        {
            List<TopicoDiscussaoModel> disciplinaModel = await dbContext.discussao
            .Include(d => d.disciplina)
            .ToListAsync();
            return disciplinaModel;
        }

        public async Task<TopicoDiscussaoModel?> GetTopicosDiscussaoById(int id) =>
            await dbContext.discussao.FindAsync(id);

        public async Task<bool> VerifyTopicoDiscussaoExists(TopicoDiscussaoModel topicoDiscussao)
        {
            var existingTopicoDiscussao = await dbContext.discussao
                .Where(QueryValue => QueryValue.nomeTopico == topicoDiscussao.nomeTopico)
                .FirstOrDefaultAsync();

            return existingTopicoDiscussao != null;
        }

        public async Task<bool> VerifyTopicoDiscussaoExistsWithId(TopicoDiscussaoModel topicoDiscussao)
        {
            var existingTopicoDiscussao = await dbContext.discussao
                .Where(QueryValue => (QueryValue.nomeTopico == topicoDiscussao.nomeTopico) && 
                QueryValue.idTopico!=topicoDiscussao.idTopico)
                .FirstOrDefaultAsync();

            return existingTopicoDiscussao != null;
        }

        public async Task<bool> VerifyDisciplinaCreatedWithId(DisciplinaModel disciplina)
        {
            var existingDisciplina = await dbContext.disciplinas
                .Where(d => (d.nomeDisciplina == disciplina.nomeDisciplina ||
                    d.codigoDisciplina == disciplina.codigoDisciplina) && d.idDisciplina != disciplina.idDisciplina)
                .FirstOrDefaultAsync();

            return existingDisciplina != null;
        }

        public async Task CreateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao) =>
            await dbContext.discussao.AddAsync(topicoDiscussao);

        public async Task UpdateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussaoModel)
        {
            TopicoDiscussaoModel topicoDiscussaoForUpdate = await dbContext.discussao.FindAsync(topicoDiscussaoModel.idTopico);

            if (topicoDiscussaoForUpdate == null)
            {
                return;
            }
            topicoDiscussaoForUpdate.disciplina = topicoDiscussaoModel.disciplina;
            topicoDiscussaoForUpdate.dataTopico = topicoDiscussaoModel.dataTopico;
            topicoDiscussaoForUpdate.nomeTopico = topicoDiscussaoModel.nomeTopico;
        }

        public async Task DeleteTopicoDiscussao(int idTopicoDiscussao)
        {
            var topicoDiscussaoModel = await dbContext.discussao.FindAsync(idTopicoDiscussao);

            if (topicoDiscussaoModel != null)
            {
                dbContext.discussao.Remove(topicoDiscussaoModel);
            }
        }

        public async Task Flush() =>
            await dbContext.SaveChangesAsync();

    }
}
