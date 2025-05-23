import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Room } from "../models/room.model";
import { Player } from "../models/player.model";
import { Chat } from "../models/chat.model";
import { BehaviorSubject, Observable } from "rxjs";
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root',
})

export class ScribbleService {
    public hubConnection!: signalR.HubConnection;
    private newChatSubject = new BehaviorSubject<Chat | null>(null);
    newChat$ = this.newChatSubject.asObservable();
    private newPlayerSubject = new BehaviorSubject<Player | null>(null);
    newPlayer$ = this.newPlayerSubject.asObservable();
    private removePlayerSubject = new BehaviorSubject<number | null>(null);
    removePlayer$ = this.removePlayerSubject.asObservable();
    private drawDataSubject = new BehaviorSubject<[string, string] | null>(null);
    drawData$ = this.drawDataSubject.asObservable();
    private matchStartSubject = new BehaviorSubject<[string, boolean, string] | null>(null);
    matchStartData$ = this.matchStartSubject.asObservable();
    private incrementSubject = new BehaviorSubject<[string, number] | null>(null);
    incrementData$ = this.incrementSubject.asObservable();
    baseUrl: string = 'https://localhost:7102/api/Room/';
    constructor(private http: HttpClient) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7102/chathub')
            .withAutomaticReconnect()
            .build();
        this.hubConnection.start().catch(console.error);

        this.hubConnection.on('SendMessage', (player, chatDto) => {
            const chat = chatDto ? {
                id: 0,
                text: chatDto.text,
                playerId: player?.id,
                roomId: player?.roomId,
                player: { userName: player?.userName },
                guessed: chatDto.guessed
            } as Chat : null;

            this.newChatSubject.next(chat);
        });

        this.hubConnection.on('JoinPlayer', (player) => {
            this.newPlayerSubject.next(player);
        });
        this.hubConnection.on('RemovePlayer', (playerId) => {
            this.removePlayerSubject.next(playerId);
        });
        this.hubConnection.on('Draw', (drawData, roomId) => {
            this.drawDataSubject.next([drawData, roomId]);
        });
        this.hubConnection.on('MatchStart', (roomId, started, wordIdx) => {
            this.matchStartSubject.next([roomId, started, wordIdx]);
        });
        this.hubConnection.on('Increment', (roomId, userId) => {
            this.incrementSubject.next([roomId, userId]);
        });
    }
    createRoom(name: string) {
        const roomDto: Partial<Room> = { roomName: name };
        return this.http.post(this.baseUrl + 'create', roomDto);
    }

    joinRoom(roomId: string, userName: string) {
        const playerDto: Partial<Player> = { roomId: roomId, userName: userName };
        return this.http.post(this.baseUrl + 'join', playerDto);
    }

    getRoom(roomId: string) {
        return this.http.get(this.baseUrl + 'getRoom/' + roomId);
    }
    getChats(roomId: string) {
        return this.http.get(this.baseUrl + 'getChats/' + roomId);
    }
    sendChat(chat: Chat) {
        return this.http.post(this.baseUrl + 'sendChat', chat);
    }
    removePlayer(id: number) {
        return this.http.delete(this.baseUrl + 'removePlayer/' + id);
    }
    checkNameExist(roomId: string, userName: string) {
        return this.http.get<boolean>(this.baseUrl + 'checkNameExists', {
            params: { roomId, userName }
        })
    }
    clearChats(roomId: string) {
        return this.http.delete(this.baseUrl + 'deleteChats/' + roomId);
    }

    resetPoints(roomId: string) {
        return this.http.get(this.baseUrl + 'resetPoints/' + roomId);
    }
    increment(roomId: string, userId: number) {
        return this.http.get(this.baseUrl + 'increment/' + roomId + '/' + userId);
    }
}