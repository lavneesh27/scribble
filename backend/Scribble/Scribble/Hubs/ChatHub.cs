// Hubs/ChatHub.cs
using Microsoft.AspNetCore.SignalR;
using Scribble.Models;

public class ChatHub : Hub
{
    public async Task SendMessage(Player user, Chat? chat)
    {
        await Clients.All.SendAsync("SendMessage", user, chat);
    }
    public async Task JoinPlayer(Player player)
    {
        await Clients.All.SendAsync("JoinPlayer", player);
    }
    public async Task RemovePlayer(int playerId)
    {
        await Clients.All.SendAsync("RemovePlayer", playerId);
    }
    public async Task Draw(string drawData, string roomId)
    {
        await Clients.All.SendAsync("Draw", drawData, roomId);
    }
    public async Task MatchStart(string roomId, bool started, int wordIdx)
    {
        await Clients.All.SendAsync("MatchStart", roomId, started, wordIdx);
    }
    public async Task Increment(string roomId, int userId)
    {
        await Clients.All.SendAsync("Increment", roomId, userId);
    }
}
