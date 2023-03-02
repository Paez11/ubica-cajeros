import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {

    //QR
    qrUrl = './assets/icons/codigo-qr.png';
    showQR = false;

  constructor() { }

  ngOnInit(): void {

  }

  getQR(){
    /*this._ready=false;
    this.transactionS.createTransaction(this.client,this.cashierId,this.type,this.amount).subscribe(transaction =>{
      this.transaction=transaction;
      console.log(this.transaction)
      //this.generateQRCodeImageFromBase64(transaction.securityCode)
      this._ready=true;
    })
    */
    this.showQR=true;
    console.log("QR ABIERTO")
    const timeout = setTimeout(() =>{

    },6000);
  }

  closeQR(){
    
  }

  generateQRCodeImageFromBase64(filePath:string){
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(filePath, 20, 100);
    return canvas.toDataURL();
  }

}
