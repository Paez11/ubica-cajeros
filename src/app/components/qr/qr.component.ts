import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DTOTransaction } from 'src/app/model/DTOTransaction';
import { IClient } from 'src/app/model/IClient';
import { TransactionService } from 'src/app/services/transaction.service';
import { ModalTransactionComponent } from '../modal-transaction/modal-transaction.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {
  _ready:boolean = true;
  base64QR:string;
  base64Image:SafeResourceUrl;
  transaction:DTOTransaction;
  client:IClient ={
    id:1,
    account: "EN43544T654",
    dni: "12345678L",
    password: "1234",
  };

  timeLeft: number = 60000;
  
  //QR
  qrUrl = './assets/icons/codigo-qr.png';
  showQR = false;

  constructor(private transactionS:TransactionService, 
    private modal: ModalTransactionComponent, 
    private domSanitizer: DomSanitizer,
    private router:Router) { 
    transactionS.getTransaction().subscribe(data =>{
      this.transaction=data;
    });
    console.log(this.transaction);
  }

  ngOnInit(): void {
    //this.getQR(this.transaction.type,this.transaction.cashier,this.transaction.amount);
    this.getQR(true,1,5);
  }

  getQR(type:boolean,id:number,amount:number){
    this._ready=false;
    this.transactionS.createTransaction(this.client.id,id,type,amount).subscribe(transaction =>{
      this.transaction=transaction;
      console.log(this.transaction)
      this.base64QR = this.generateQRCodeImageFromBase64(transaction.securityCode);
      console.log("QR -->", this.base64QR)
      this.base64Image = this.domSanitizer.bypassSecurityTrustResourceUrl(this.base64QR);
      console.log("IMG -->",this.base64Image);
      this._ready=true;
    })
    
    this.showQR=true;
    console.log("QR ABIERTO")
    const timeout = setTimeout(() =>{
      this.router.navigate(['/main']);
    },60000);
    setInterval(() => {
      this.timeLeft = this.timeLeft - 1000; // reduce the time left by 1 second
    }, 1000)
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
