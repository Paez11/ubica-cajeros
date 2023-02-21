import { Component, Input, OnInit } from '@angular/core';
import { CashierService } from 'src/app/services/cashier.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-modal-transaction',
  templateUrl: './modal-transaction.component.html',
  styleUrls: ['./modal-transaction.component.scss']
})
export class ModalTransactionComponent implements OnInit {

  show: boolean = false;
  cash:number;
  @Input() openModal: any;

  constructor(public transactionS:TransactionService, private cashierS:CashierService) { 
  
  }

  ngOnInit(): void {
    //this.transactionS.showModal$.subscribe(show => this.show = show);
    //this.openModal(1);
  }

  close(){
    this.transactionS.hide();
  }

  /*
  public openModal() {
    document.getElementById("launchModal")?.click();
    this.isModalOpen=true;
  }

  public closeModal(){
    //document.getElementById('myModal').style.display = 'none';
    this.isModalOpen=false;
  }
  */

  getQR(){
    //this.showQR = true;
    console.log("QR ABIERTO")
  }
}
