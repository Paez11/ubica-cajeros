import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DTOTransaction } from 'src/app/model/DTOTransaction';
import { IATMParams } from 'src/app/model/IATMParams';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from 'src/app/services/cashier.service';
import { ClientService } from 'src/app/services/client.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  
  amount: number;
  isValid: boolean = true;
  cashier: IATMParams;
  transaction: DTOTransaction;
  client: IClient;

  constructor(private activatedRouter: ActivatedRoute, 
              private router: Router,
              private _cashierService: CashierService,
              private _transactionService: TransactionService,
              private _clientService: ClientService,              
              private toastr: ToastrService,
              private _translateService: TranslateService ){
  }

  ngOnInit(): void {
    this._clientService.getUserObservable().subscribe((client) => {
      this.client = client;
    });

    this.activatedRouter.params.subscribe( (params) => {
      this.cashier = params as IATMParams;
    });
  }

  doTransaction(type: boolean) {
    if (isNaN(this.amount) || this.amount < 5.0 || this.amount > 3000.0) {
      this.isValid = false;
    } else {
      this.isValid = true;
      this.transaction = {
        client: this.client.id,
        amount: this.amount,
        cashier: this.cashier.id,
        type: type,
      };
      this._transactionService.setTransaction(this.transaction);
      const transactionSub = this._transactionService.getTransaction().subscribe( (response) => {
        if(response !== null) {
          this.toastr.info(this._translateService.instant('successfulTransaction','Transaction Ok'))
        }
        else {
          this.toastr.error(this._translateService.instant('notTransaction','Transaction not Ok'))
        }
      })
      transactionSub.unsubscribe();
      this.router.navigate(['/main/QR']);
    }
  }

  decodeImg(photo: string): SafeResourceUrl {
    return this._cashierService.getDecodeImg(photo);
  }
}
