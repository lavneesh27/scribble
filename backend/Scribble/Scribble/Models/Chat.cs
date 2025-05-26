using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Scribble.Models
{
    public class Chat
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Text { get; set; }
        public int PlayerId { get; set; }
        public string RoomId { get; set; }
        [ForeignKey(nameof(PlayerId))]
        public Player? Player { get; set; }

        [ForeignKey(nameof(RoomId))]
        public Room? Room { get; set; }
        public bool Guessed { get; set; }
    }
}
