using System.Text;
using Konscious.Security.Cryptography;
using Microsoft.Extensions.Options;
using StudyLabAPI.Models.Options;

namespace StudyLabAPI.Services.Hash;

public class ArgonHashService : IHashService
{
    private readonly Argon2HashParametersOptions _options;

    public ArgonHashService(IOptions<Argon2HashParametersOptions> options)
    {
        _options = options.Value;
    }
    
    public string Hash(string password)
    {
        Argon2d argon2 = CreateArgon2Hasher(password);
        byte[] hashBytes = argon2.GetBytes(16);
        string hash = Convert.ToBase64String(hashBytes);
        
        return hash;
    }
    
    private Argon2d CreateArgon2Hasher(string password)
    {
        byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
        byte[] saltBytes = Encoding.UTF8.GetBytes(_options.Salt);
        
        Argon2d argon2 = new(passwordBytes);
        argon2.DegreeOfParallelism = _options.DegreeOfParallelism;
        argon2.Iterations = _options.Iterations;
        argon2.MemorySize = _options.MemorySize;
        argon2.Salt = saltBytes;
        
        return argon2;
    }
}