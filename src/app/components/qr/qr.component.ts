import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DTOTransaction } from 'src/app/model/DTOTransaction';
import { IClient } from 'src/app/model/IClient';
import { TransactionService } from 'src/app/services/transaction.service';
import { ModalTransactionComponent } from '../modal-transaction/modal-transaction.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {
  _ready:boolean = true;
  base64QR:string;
  base64Image:any;
  transaction:DTOTransaction;
  client:IClient ={
    id:1,
    account: "EN43544T654",
    dni: "12345678L",
    password: "1234",
  };

  //QR
  qrUrl = './assets/icons/codigo-qr.png';
  showQR = false;

  constructor(private transactionS:TransactionService, private modal: ModalTransactionComponent, private domSanitizer: DomSanitizer) { 
    transactionS.getTransaction().subscribe(data =>{
      this.transaction=data;
    });
    console.log(this.transaction);
  }

  ngOnInit(): void {
    this.getQR(this.transaction.type,this.transaction.cashier,this.transaction.amount);
  }

  getQR(type:boolean,id:number,amount:number){
    this._ready=false;
    this.transactionS.createTransaction(this.client.id,id,type,amount).subscribe(transaction =>{
      this.transaction=transaction;
      console.log(this.transaction)
      this.base64QR = "data:image/png;base64,"+ this.generateQRCodeImageFromBase64(transaction.securityCode);
      this.base64Image = this.domSanitizer.bypassSecurityTrustResourceUrl(this.base64QR) as SafeResourceUrl;
      console.log(this.base64Image);
      this._ready=true;
    })
    
    this.showQR=true;
    console.log("QR ABIERTO")
    const timeout = setTimeout(() =>{

    },6000);
  }

  closeQR(){
    
  }

  generateQRCodeImageFromBase64(filePath:string){
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(filePath, 20, 100);
    return canvas.toDataURL();
  }

}
