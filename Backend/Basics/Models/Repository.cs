namespace Basics.Models;

public class Repository
{
    private static readonly List<Bootcamp> _bootcamps = new List<Bootcamp>();

    static Repository()
    {
        _bootcamps = new List<Bootcamp>
        {
            new Bootcamp()
            {
                Id = 1,
                Name = "Full Stack Development",
                Description = "Learn to build web applications using modern technologies.",
                Image = "1.png",
                IsActive = true,
                IsHome = true
            },
            new Bootcamp()
            {
                Id = 2,
                Name = "Data Science",
                Description = "Learn to analyze and interpret complex data.",
                Image = "2.jpg",
                IsActive = true,
                IsHome = false
            },
            new Bootcamp()
            {
                Id = 3,
                Name = "Cybersecurity",
                Description = "Learn to protect systems and networks from cyber threats.",
                Image = "3.png",
                IsActive = false,
                IsHome = false
            },
            new Bootcamp()
            {
                Id = 4,
                Name = "Cloud Computing",
                Description = "Learn to design and manage cloud-based solutions.",
                Image = "2.jpg",
                IsActive = false,
                IsHome = true
            },
        };
    }

    public static List<Bootcamp> GetAllBootcamps
    {
        get { return _bootcamps; }
    }

    public static Bootcamp? GetBootcampById(int? id)
    {
        return _bootcamps.FirstOrDefault(b => b.Id == id);
    }

}