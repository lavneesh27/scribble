using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;
using Newtonsoft.Json;
using Scribble.Models;
using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace Scribble.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly DBContextScribble _context;
        public RoomController(DBContextScribble context)
        {
            _context = context;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateRoom([FromBody] Room roomDto)
        {
            if (roomDto == null)
                return BadRequest("Room name is required");

            var room = new Room { RoomName = roomDto.RoomName };
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(room);
        }



        [HttpPost("join")]
        public async Task<IActionResult> JoinRoom([FromBody] Player playerDto)
        {
            if (playerDto == null)
                return BadRequest("Player is required");
            var room = await _context.Rooms.Include(r => r.Players).FirstOrDefaultAsync(r => r.RoomId == playerDto.RoomId);
            if (room == null) return NotFound();
            var player = new Player { Id = 0, UserName = playerDto.UserName, RoomId = playerDto.RoomId };
            room.Players.Add(player);
            await _context.SaveChangesAsync();
            return Ok(player);
        }
        [HttpDelete("removePlayer/{id}")]
        public async Task<IActionResult> RemovePlayer(int id)
        {
            if (id == 0) return BadRequest("Player is required");

            var count = await _context.Players
                .Where(p => p.Id == id)
                .ExecuteDeleteAsync();

            return Ok(new { message = count > 0 ? "Player removed" : "Player already removed" });
        }


        [HttpGet("getRoom/{roomId}")]
        public async Task<IActionResult> GetRoom(string roomId)
        {
            var room = await _context.Rooms.Include(r => r.Players).FirstOrDefaultAsync(r => r.RoomId == roomId);
            return room == null ? NotFound() : Ok(room);
        }
        [HttpDelete("{roomId}")]
        public async Task<IActionResult> DeleteRoom(string roomId)
        {
            var room = await _context.Rooms.Include(r => r.Players).FirstOrDefaultAsync(r => r.RoomId == roomId);
            if (room is null) return NotFound();
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("getChats/{roomId}")]
        public async Task<List<Chat>> GetChats(string roomId)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomId == roomId);
            if (room == null) return new List<Chat>();

            return await _context.Chats
                .Where(c => c.RoomId == room.RoomId)
                .Include(c => c.Player)
                .Include(c => c.Room)
                .ToListAsync();
        }
        [HttpPost("sendChat")]
        public async Task<IActionResult> SendChat([FromBody] Chat chat)
        {
            if (chat.RoomId == null) return NotFound();

            var roomExists = await _context.Rooms.AnyAsync(r => r.RoomId == chat.RoomId);
            if (!roomExists) return NotFound();

            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();

            return Ok(chat);
        }
        [HttpGet("checkNameExists")]
        public async Task<bool> CheckNameExists(string roomId, string userName)
        {
            bool isExist = await _context.Rooms.Include(e => e.Players).AnyAsync(e => e.RoomId == roomId && e.Players.Any(r => r.UserName == userName));

            return isExist;
        }
        [HttpDelete("deleteChats/{roomId}")]
        public async Task<IActionResult> DeleteChats(string roomId)
        {
            await _context.Chats.Where(chat => chat.RoomId == roomId).ExecuteDeleteAsync();

            return Ok();
        }
        [HttpGet("resetPoints/{roomId}")]
        public async Task<IActionResult> ResetPoints(string roomId)
        {
            List<Player> players = await _context.Players.Where(p => p.RoomId == roomId).ToListAsync();

            foreach (var p in players)
            {
                p.Points = 0;
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("increment/{roomId}/{userId}")]
        public async Task<IActionResult> ResetPoints(string roomId, int userId)
        {
            var player = await _context.Players.FirstOrDefaultAsync(p => p.RoomId == roomId && p.Id == userId);
            if (player == null) return NotFound();
            player.Points++;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
