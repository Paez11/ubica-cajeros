import { AfterViewInit, Component, Input, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DTOTransaction } from 'src/app/model/DTOTransaction';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from 'src/app/services/cashier.service';
import { ClientService } from 'src/app/services/client.service';
import { TransactionService } from 'src/app/services/transaction.service';

declare var bootstrap: any;
@Component({
  selector: 'app-modal-transaction',
  templateUrl: './modal-transaction.component.html',
  styleUrls: ['./modal-transaction.component.scss'],
})
export class ModalTransactionComponent implements AfterViewInit {
  @Input() id = 'modal';
  _modal;

  show: boolean = false;
  @Output() amount: number;
  isValid: boolean = true;

  _ready: boolean = true;

  transaction: DTOTransaction;
  client: IClient;
  cashierId: number;
  cashier: ICashier;
  @Output() type: boolean = false;
  //false extraer
  //true ingresar

  //QR
  qrUrl = './assets/icons/codigo-qr.png';
  showQR = false;

  constructor(
    public _transactionS: TransactionService,
    private _cashierS: CashierService,
    private router: Router,
    private _clientS: ClientService
  ) {
    this._clientS.getUserObservable().subscribe((client) => {
      this.client = client;
    });
    //this.cashier = null;
  }

  ngAfterViewInit(): void {
    this._modal = new bootstrap.Modal(document.getElementById(this.id), {});
  }

  close() {
    this._modal.hide();
    this.show = false;
    this.isValid = true;
    this._modal = null;
  }
  open(cashier: ICashier) {
    this.cashier = cashier;
    this.cashierId = cashier.id;
    this._modal.show();
    this.show = true;
  }

  doTransaction(type: boolean) {
    if (isNaN(this.amount) || this.amount < 5.0 || this.amount > 3000.0) {
      this.isValid = false;
    } else {
      this.isValid = true;
      this.transaction = {
        client: this.client.id,
        amount: this.amount,
        cashier: this.cashierId,
        type: type,
      };
      this._transactionS.setTransaction(this.transaction);
      this.close();
      this.router.navigate(['/main/QR']);
    }
  }

  ngAfterInit() {}

  decodeImg(photo: string): SafeResourceUrl {
    return this._cashierS.getDecodeImg(photo);
  }
}
