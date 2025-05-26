using Scribble.Models;
using System.ComponentModel.DataAnnotations;
using System.Numerics;

public class Room
{
    [Key]
    [MaxLength(255)]
    public string RoomId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(255)]
    public string RoomName { get; set; }

    public List<Player> Players { get; set; } = new();
}
