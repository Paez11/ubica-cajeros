import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DTOTransaction } from 'src/app/model/DTOTransaction';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from 'src/app/services/cashier.service';
import { ClientService } from 'src/app/services/client.service';
import { TransactionService } from 'src/app/services/transaction.service';

declare var bootstrap:any;
@Component({
  selector: 'app-modal-transaction',
  templateUrl: './modal-transaction.component.html',
  styleUrls: ['./modal-transaction.component.scss']
})
export class ModalTransactionComponent implements AfterViewInit {
  @Input() id = 'modal';
  _modal;

  show: boolean = false;
  @Output() amount:number;
  isValid: boolean = true;

  _ready:boolean = true;

  transaction:DTOTransaction;
  client:IClient;
  cashierId:number;
  @Output() type:boolean = false;
  //false extraer
  //true ingresar

  //QR
  qrUrl = './assets/icons/codigo-qr.png';
  showQR = false;

  constructor(public transactionS:TransactionService, private cashierS:CashierService, 
    private router: Router, private clientS:ClientService) { 
    this.clientS.getUserObservable().subscribe(client =>{
      this.client = client;
    });
  }

  ngAfterViewInit(): void {
    this._modal = new bootstrap.Modal(document.getElementById(this.id),{
       
    });
  }

  close(){
    this._modal.hide();
    this.show=false;
    this.isValid = true;
  }
  open(id){
    this.cashierId=id;
    this._modal.show();
    this.show=true;
  }

  doTransaction(type:boolean){
    if(isNaN(this.amount) || (this.amount<5.00 || this.amount>3000.00)){
      this.isValid = false;
    } else{
      this.isValid = true;
      this.transaction = {
        client:this.client.id,
        amount:this.amount,
        cashier:this.cashierId,
        type:type
      }
      this.transactionS.setTransaction(this.transaction);
      this.close();
      this.router.navigate(['/QR']);
    }
  }

  ngAfterInit(){

  }
}
