using Microsoft.AspNetCore.Mvc;
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

        public async Task CreateTopicoDiscussao(TopicoDiscussaoModel topicoDiscussao) =>
            await dbContext.discussao.AddAsync(topicoDiscussao);
        public async Task Flush() =>
            await dbContext.SaveChangesAsync();

    }
}
