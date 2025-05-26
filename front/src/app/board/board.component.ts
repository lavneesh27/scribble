import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgWhiteboardComponent, WhiteboardOptions } from 'ng-whiteboard';
import { NgWhiteboardService } from 'ng-whiteboard';
import { ScribbleService } from '../service/scribble.service';
import { Room } from '../models/room.model';
import { Chat } from '../models/chat.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Player } from '../models/player.model';
import { words } from '../models/words.data';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [NgWhiteboardComponent, CommonModule, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  constructor(public whiteboardService: NgWhiteboardService, private route: ActivatedRoute, private service: ScribbleService, private navigator: Router,
    private toastr: ToastrService
  ) { }
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
  drawData: any;
  guessingWord: string = '';
  currentPlayer: Player = new Player();
  @ViewChild('whiteboard') whiteboard!: NgWhiteboardComponent;
  ngOnInit() {
    if (sessionStorage.getItem('userName')) {
      this.userName = sessionStorage.getItem('userName');
      this.userId = Number(sessionStorage.getItem('userId'));
    } else {
      alert('User does not exist, please re-enter the room');
      this.navigator.navigate(['home']);
      return;
    }
    this.room.roomId = this.route.snapshot.paramMap.get('roomId') ?? '';

    if (this.room.roomId) {
      this.service.getRoom(this.room.roomId).subscribe({
        next: (res: any) => this.room = res,
        error: () => {
          alert('Room does not exist, please create new one');
          this.navigator.navigate(['home']);
          return;
        }
      });

      this.service.getChats(this.room.roomId).subscribe((res: any) => {
        this.chats = res;
      })
    }
    this.service.newChat$.subscribe((chat: Chat | null) => {
      if (chat) this.chats.push(chat);
      else this.chats = [];
    })
    this.service.newPlayer$.subscribe((player: Player | null) => {
      if (player && !this.room.players.find(p => p.id === player.id)) this.room.players.push(player);
    })
    this.service.matchStartData$.subscribe((res: any | null) => {
      if (this.room.roomId === res[0]) {
        this.matchStarted = res[1];
        this.room.players.forEach(p => p.points = 0);
        if (res[1]) this.guessingWord = words[res[2]];
        else {
          const player = this.room.players.reduce((a: any, b: any) => a.points > b.points ? a : b);
          alert(`${player.userName} has win this match!`);
          this.guessingWord = ''
        }
        this.service.resetPoints(this.room.roomId).subscribe();
        this.service.hubConnection.invoke('SendMessage', null, null);
        this.service.clearChats(this.room.roomId).subscribe();
        this.modify('clear');

        this.currentPlayer = this.room.players[0];
        this.toastr.info(`${this.currentPlayer.userName} will start drawing!`);
      }
    });

    this.service.drawData$.subscribe((res: any) => {
      if (res && this.room.roomId === res[1]) {
        this.drawData = JSON.parse(res[0]);
      }
    })
    this.service.incrementData$.subscribe((res: any) => {
      if (res && this.room.roomId === res[0] && this.room.players.some(e => e.id == res[1])) {
        let player = this.room.players.find(e => e.id == res[1]);
        if (player) {
          this.toastr.success('+1 pt', `${player.userName} guessed the word!`);
          player.points++;
          this.service.increment(player.roomId, player.id).subscribe();
        }
      }
    })
    this.service.removePlayer$.subscribe((playerId: number | null) => {
      if (playerId && (this.room.players as any[]).some(e => e.id === playerId)) {
        this.room.players = this.room.players.filter(p => p.id !== playerId);
        this.service.removePlayer(playerId).subscribe();
      }
    });
  }
  clear() {
    this.whiteboardService.clear();
  }
  send(chatForm: NgForm) {
    if (this.userId && chatForm.valid) {
      let guessed = chatForm.value.text.toLowerCase() === this.guessingWord.toLowerCase();
      const chat: Chat = {
        playerId: this.userId,
        roomId: this.room.roomId,
        text: guessed ? `${this.userName} guessed the word!` : chatForm.value.text,
        guessed: guessed
      } as Chat;

      this.service.sendChat(chat).subscribe((ch: any) => {
        const player: Player = {
          id: ch.playerId,
          roomId: ch.roomId,
          userName: this.userName
        } as Player;
        if (guessed) {
          
          ch.text = `${this.userName} guessed the word!`;
          const player = this.room.players.find(p => p.id === ch.playerId);
          if (player) {
            this.service.hubConnection.invoke('Increment', player.roomId, player.id);
          }
        }
        this.service.hubConnection.invoke('SendMessage', player, ch);
        chatForm.reset();
      })
    }
  }
  copy() {
    navigator.clipboard.writeText(this.room.roomId);
    alert("Room ID copied to clipboard");
  }
  saveDraw() {
    setTimeout(() => {
      this.service.hubConnection.invoke('Draw', JSON.stringify(this.drawData), this.room.roomId);
    });
  }
  modify(method: 'undo' | 'redo' | 'clear') {
    if (method === 'undo') {
      this.whiteboardService.undo();
    } else if (method === 'redo') {
      this.whiteboardService.redo();
    } else {
      this.whiteboardService.clear();
    }
    setTimeout(() => {
      this.service.hubConnection.invoke('Draw', JSON.stringify(this.drawData), this.room.roomId);
    }, 100);
  }
  matchStarted: boolean = false;
  start(status: 'Start' | 'End') {
    this.service.hubConnection.invoke('MatchStart', this.room.roomId, status === 'Start', Math.floor(Math.random() * words.length));
  }
}
