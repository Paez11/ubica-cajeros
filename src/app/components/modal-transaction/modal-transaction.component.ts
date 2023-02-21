import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  id:any;
  cash:number;
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
    this.id=id;
    this._modal.show();
    this.show=true;
  }

  getQR(){
    //this.showQR = true;
    console.log("QR ABIERTO")
  }
}
