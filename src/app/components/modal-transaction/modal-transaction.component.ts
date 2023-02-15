import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-modal-transaction',
  templateUrl: './modal-transaction.component.html',
  styleUrls: ['./modal-transaction.component.scss']
})
export class ModalTransactionComponent implements OnInit {

  show: boolean = false;
  cash:number;

  constructor(public transactionS:TransactionService) { 
  
  }

  ngOnInit(): void {
    this.transactionS.showModal$.subscribe(show => this.show = show);
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
