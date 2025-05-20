import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgWhiteboardComponent, WhiteboardOptions } from 'ng-whiteboard';
import { NgWhiteboardService } from 'ng-whiteboard';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [RouterOutlet, NgWhiteboardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  whiteboardOptions: WhiteboardOptions = {
    backgroundColor: '#fff',
    strokeColor: '#000',
    strokeWidth: 3,
  };
  constructor(private whiteboardService: NgWhiteboardService) { }
  @ViewChild('whiteboard') whiteboard!: NgWhiteboardComponent;
  
  clear(){
    this.whiteboardService.clear();
  }
}
