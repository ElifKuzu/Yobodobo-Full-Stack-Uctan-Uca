namespace Basics.Models
{
    public class Bootcamp
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsHome { get; set; } = true;
    }
}
