import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
submitCreateRoom() {
throw new Error('Method not implemented.');
}
submitJoinRoom() {
throw new Error('Method not implemented.');
}
    modalType: 'create' | 'join' = 'create';
    @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
createRoomName: any;
joinRoomId: any;
username: any;
    constructor(private modalService: NgbModal) {}
 
    openModal(type: 'create' | 'join') {
        this.modalType = type;
        this.modalService.open(this.modalTemplate);
  }
}
