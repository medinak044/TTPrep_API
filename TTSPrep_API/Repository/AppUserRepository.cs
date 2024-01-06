using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class AppUserRepository: Repository<AppUser>, IAppUserRepository
{
    private AppDbContext _context;
    public AppUserRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
}
