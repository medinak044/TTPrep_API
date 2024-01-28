using Microsoft.EntityFrameworkCore;
using System.Linq;
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

    // PostgreSQL compatible
    public override async Task<IEnumerable<Project>> GetAllAsync()
    {
        var projects = await _context.Projects.ToListAsync();

        // Additional data
        if (projects.Count() > 0)
        {
            //var chapters = await _context.Chapters.ToListAsync();
            //var speakers = await _context.Speakers.ToListAsync();
            //var words = await _context.Words.ToListAsync();
            foreach (var project in projects)
            {
                _context.Entry(project).Collection(p => p.Chapters).Load();
                _context.Entry(project).Collection(p => p.Words).Load();
                _context.Entry(project).Collection(p => p.Speakers).Load();
                //foreach (var chapter in chapters)
                //{
                //    if (chapter.ProjectId == project.Id) { project.Chapters.Add(chapter); }
                //}
                //foreach (var word in words)
                //{
                //    if (word.ProjectId == project.Id) { project.Words.Add(word); }
                //}
                //foreach (var speaker in speakers)
                //{
                //    if (speaker.ProjectId == project.Id) { project.Speakers.Add(speaker); }
                //}
            }
        }

        return projects;
    }

    // PostgreSQL compatible
    public override IEnumerable<Project> GetSome(Func<Project, bool> predicate)
    {
        var projects = base.GetSome(predicate);

        // Include the navigation property values
        foreach (Project project in projects)
        {
            _context.Entry(project).Collection(p => p.Chapters).Load();
            _context.Entry(project).Collection(p => p.Words).Load();
            _context.Entry(project).Collection(p => p.Speakers).Load();

        }

        return projects;
    }

    //public override IEnumerable<Project> GetSome(Expression<Func<Project, bool>> predicate)
    //{
    //    IQueryable<Project> projects = _context.Projects.Where(predicate);

    //    // Include the navigation property values
    //    foreach (Project project in projects)
    //    {
    //        project.Chapters = _context.Chapters.Where(c => c.ProjectId == project.Id).ToList();
    //        project.Words = _context.Words.Where(w => w.ProjectId == project.Id).ToList();
    //        project.Speakers = _context.Speakers.Where(s => s.ProjectId == project.Id).ToList();
    //    }

    //    return projects;
    //}


    public override async Task<Project> GetByIdAsync(string projectId)
    {
        Project project = await _context.Projects.FindAsync(projectId);

        // Explicitly load Project data so that the navigation properties will load their values
        _context.Entry(project).Collection(p => p.Chapters).Load();
        _context.Entry(project).Collection(p => p.Words).Load();
        _context.Entry(project).Collection(p => p.Speakers).Load();

        // Include nested navigation properties
        foreach (var chapter in project.Chapters)
        {
            _context.Entry(chapter).Collection(c => c.TextBlocks).Load();
            _context.Entry(chapter).Collection(c => c.TextBlockLabels).Load();
        }

        return project;
    }
}
