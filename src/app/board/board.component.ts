import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgWhiteboardComponent, WhiteboardOptions } from 'ng-whiteboard';
import { NgWhiteboardService } from 'ng-whiteboard';
import { ScribbleService } from '../service/scribble.service';
import { Room } from '../models/room.model';
import { Chat } from '../models/chat.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [NgWhiteboardComponent, CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  constructor(public whiteboardService: NgWhiteboardService, private route: ActivatedRoute, private service: ScribbleService) { }
  userName: string | null = '';
  userId: number | null = null;
  room: Room = new Room();
  whiteboardOptions: WhiteboardOptions = {
    backgroundColor: '#fff',
    strokeColor: '#000',
    strokeWidth: 3,
  };
  chats: Chat[] = [];
  chat: Chat = new Chat();
  @ViewChild('whiteboard') whiteboard!: NgWhiteboardComponent;
  ngOnInit() {
    if (sessionStorage.getItem('userName')) {
      this.userName = sessionStorage.getItem('userName');
      this.userId = Number(sessionStorage.getItem('userId'));
    } else {
      alert('User does not exist, please re-enter the room');
      return;
    }
    this.room.roomId = this.route.snapshot.paramMap.get('roomId') ?? '';

    if (this.room.roomId) {
      this.service.getRoom(this.room.roomId).subscribe({
        next: (res: any) => this.room = res,
        error: () => {
          alert('Room does not exist, please create new one');
          return;
        }
      });

      this.service.getChats(this.room.roomId).subscribe((res: any) => {
        this.chats = res;
      })
    }
    this.service.newChat$.subscribe((chat: Chat | null) => {
      if (chat) this.chats.push(chat);
    })
    this.service.newPlayer$.subscribe((player: Player | null) => {
      if (player) this.room.players.push(player);
    })
  }

  clear() {
    this.whiteboardService.clear();
  }
  send(chatForm: NgForm) {
    if (this.userId && chatForm.valid) {
      const chat: Chat = {
        playerId: this.userId,
        roomId: this.room.roomId,
        text: chatForm.value.text
      } as Chat;
      const player: Player = {
        id: 0,
        roomId: this.room.roomId,
        userName: this.userName
      } as Player;

      this.service.sendChat(chat).subscribe(() => {
        this.service.hubConnection.invoke('SendMessage', player, chat.text);
        chatForm.reset();
      })
    }
  }
}
