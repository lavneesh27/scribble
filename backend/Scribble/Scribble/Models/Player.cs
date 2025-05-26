using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Scribble.Models
{
    public class Player
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(255)]
        public string UserName { get; set; }
        [MaxLength(255)]
        public string RoomId { get; set; }
        [JsonIgnore]
        public Room? Room { get; set; }
        public int Points { get; set; }
    }
}
