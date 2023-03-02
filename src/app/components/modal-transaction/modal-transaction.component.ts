import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DTOTransaction } from 'src/app/model/DTOTransaction';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from 'src/app/services/cashier.service';
import { TransactionService } from 'src/app/services/transaction.service';

declare var bootstrap:any;
@Component({
  selector: 'app-modal-transaction',
  templateUrl: './modal-transaction.component.html',
  styleUrls: ['./modal-transaction.component.scss']
})
export class ModalTransactionComponent implements OnInit {
  @ViewChild('modal') modal:ElementRef;
  _modal;

  show: boolean = false;
  amount:number;

  _ready:boolean = true;

  transaction:DTOTransaction;
  client:IClient;
  cashierId:number;
  type:boolean = false;
  //false extraer
  //true ingresar

  //QR
  qrUrl = './assets/icons/codigo-qr.png';
  showQR = false;

  constructor(public transactionS:TransactionService, private cashierS:CashierService) { 
  
  }

  ngOnInit(): void {
    this._modal = new bootstrap.Modal(document.getElementById("modal"),{
       
    });
  }

  close(){
    this._modal.hide();
    this.show=false;
  }
  open(id){
    this.cashierId=id;
    this._modal.show();
    this.show=true;
  }

  getQR(type:boolean){
    this.type=type;
    this.close();
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

  ngAfterInit(){

  }
}
