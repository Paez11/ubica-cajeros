import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.el.nativeElement.innerHTML = this;
  }

}
