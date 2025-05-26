using Microsoft.EntityFrameworkCore;

namespace Scribble.Models
{
    public partial class DBContextScribble : DbContext
    {
        public DBContextScribble(DbContextOptions<DBContextScribble> options) : base(options)
        {
        }
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<Player> Players => Set<Player>();
        public DbSet<Chat> Chats => Set<Chat>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Player>()
                .HasOne(p => p.Room)
                .WithMany(r => r.Players)
                .HasForeignKey(p => p.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
