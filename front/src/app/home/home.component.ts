import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ScribbleService } from '../service/scribble.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  modalType: 'create' | 'join' = 'create';
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  createRoomName: any;
  joinRoomId: any;
  username: any;
  constructor(private modalService: NgbModal, private service: ScribbleService, private route: Router, private toastr: ToastrService) { }
  ngOnInit(){
    let playerId = sessionStorage.getItem('userId');
    if(playerId){
      this.service.hubConnection.invoke('RemovePlayer', Number(playerId));
      this.service.removePlayer(Number(playerId)).subscribe();
    }
    sessionStorage.clear();
  }
  openModal(type: 'create' | 'join') {
    this.modalType = type;
    this.modalService.open(this.modalTemplate, { centered: true });
  }
  handleFormSubmit(form: NgForm, type: 'create' | 'join') {
    if (form?.valid) {
      if (type === 'create') {
        this.service.createRoom(form.value?.roomName).subscribe({
          next: (room: any) => {
            alert(`Successfully created ${room.roomName} with Room ID: ${room.roomId}` );
            form.reset();
            this.modalService.dismissAll(this.modalTemplate);
          },
          error: err => console.error(err)
        })
      } else {
        this.service.checkNameExist(form.value?.roomId, form.value?.userName).subscribe(res => {
          if (res) {
            alert("This username is taken for that room, please choose a different name");
            return;
          }
          this.service.joinRoom(form.value?.roomId, form.value?.userName).subscribe({
            next: (player: any) => {
              form.reset();
              this.modalService.dismissAll(this.modalTemplate);
              sessionStorage.setItem('userName', player.userName);
              sessionStorage.setItem('userId', player.id);
              this.route.navigate(['/board', player.roomId]);
              this.service.hubConnection.invoke('JoinPlayer', player);
              this.toastr.success(`Successfully Joined the room ${player.roomId}`);
            },
            error: (err) =>{
              alert('Given RoomID not found, please create new one');
              return;
            }
          })
        })
      }
    }
  }
}