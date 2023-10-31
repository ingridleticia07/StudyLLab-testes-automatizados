using Microsoft.EntityFrameworkCore;
using StudyLabAPI.Context;
using StudyLabAPI.Models;
using StudyLabAPI.Models.Enums;
using StudyLabAPI.Utils.Extensions;

namespace StudyLabAPI.Repositories;

public class CodigoUsuarioRepository : ICodigoUsuarioRepository
{
    private AppDbContext dbContext { get; }
    
    private const int CODE_LENGTH = 4;
    // Will be generated a random number between 0 and 9
    private const int MIN_CODE_DIGIT = 0;
    private const int MAX_CODE_DIGIT = 10; 

    public CodigoUsuarioRepository(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    
    public async Task<CodigoUsuarioModel?> GetUserCode(UsuarioModel usuarioModel, 
        UserCodeKind codeKind) =>
        await dbContext.codigoUsuario
            .FirstOrDefaultAsync(c => c.usuarioModel == usuarioModel && c.tipo == codeKind);
    
    public CodigoUsuarioModel UseCode(UsuarioModel usuarioModel,
        CodigoUsuarioModel codigoUsuarioModel) =>
        dbContext.codigoUsuario.Remove(codigoUsuarioModel).Entity;
    
    public async Task<CodigoUsuarioModel> GenerateAndEnsureCode(UsuarioModel usuarioModel, 
        UserCodeKind codeKind)
    {
        await dbContext.codigoUsuario
            .Where(c => c.usuarioModel == usuarioModel && c.tipo == codeKind)
            .ForEachAsync(c => dbContext.codigoUsuario.Remove(c));
        
        string code = GenerateCodes().FuseString();
        CodigoUsuarioModel codigoUsuarioModel = new()
        {
            usuarioModel = usuarioModel,
            codigo = code,
            tipo = codeKind
        };
        CodigoUsuarioModel newCodeUser = (await dbContext.codigoUsuario.AddAsync(codigoUsuarioModel)).Entity;
        return newCodeUser;
    }
    
    private static IEnumerable<string> GenerateCodes()
    {
        Random random = new();
        for (int c = 0; c < CODE_LENGTH; c++)
        {
            string codeDigit = random.Next(MIN_CODE_DIGIT, MAX_CODE_DIGIT).ToString();
            yield return codeDigit;
        }
    }
    public async Task Flush() =>
        await dbContext.SaveChangesAsync();
}