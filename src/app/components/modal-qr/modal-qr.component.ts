import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-qr',
  templateUrl: './modal-qr.component.html',
  styleUrls: ['./modal-qr.component.scss']
})
export class ModalQRComponent implements OnInit {

  //QR
  qrUrl = './assets/icons/codigo-qr.png';
  showQR = false;

  constructor() { }

  ngOnInit(): void {
  }
}
