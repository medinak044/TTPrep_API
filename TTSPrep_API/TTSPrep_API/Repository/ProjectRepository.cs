using System.Linq.Expressions;
using TTSPrep_API.Data;
using TTSPrep_API.Models;
using TTSPrep_API.Repository.IRepository;

namespace TTSPrep_API.Repository;

public class ProjectRepository: Repository<Project>, IProjectRepository
{
    private AppDbContext _context;
    public ProjectRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public override IEnumerable<Project> GetSome(Expression<Func<Project, bool>> predicate)
    {
        IQueryable<Project> projects = _context.Projects.Where(predicate);

        // Include the navigation property values
        foreach (Project project in projects)
        {
            project.Chapters = _context.Chapters.Where(c => c.ProjectId == project.Id).ToList();
            project.Words = _context.Words.Where(w => w.ProjectId == project.Id).ToList();
            project.Speakers = _context.Speakers.Where(s => s.ProjectId == project.Id).ToList();
        }

        return projects;
    }


    public override async Task<Project> GetByIdAsync(string projectId)
    {
        Project project = await _context.Projects.FindAsync(projectId);
        _context.Entry(project).Collection(p => p.Chapters).Load();
        _context.Entry(project).Collection(p => p.Words).Load();
        _context.Entry(project).Collection(p => p.Speakers).Load();

        // Include nested navigation properties
        foreach (var chapter in project.Chapters)
        {
            _context.Entry(chapter).Collection(c => c.TextBlocks).Load();
            _context.Entry(chapter).Collection(c => c.TextBlockLabels).Load();
        }
        
        // Explicitly load Project data so that the navigation properties will load their values
        //List<Project> projects = _context.Projects.ToList();

        return project;
    }
}
