import { Player } from "./player.model";

export class Chat {
    id: number = 0;
    text: string = '';
    playerId: number = 0;
    roomId: string = '';
    player: Player = new Player();
    guessed: boolean = false;
}
