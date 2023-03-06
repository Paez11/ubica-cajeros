import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DTOTransaction } from 'src/app/model/DTOTransaction';
import { IClient } from 'src/app/model/IClient';
import { TransactionService } from 'src/app/services/transaction.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {
  _ready:boolean = false;
  base64QR:string;
  base64Image:SafeResourceUrl;
  transaction:DTOTransaction;
  client:IClient ={
    id:1,
    account: "EN43544T654",
    dni: "12345678L",
    password: "1234",
  };

  timeLeft: number = 600000;
  timer:any;
  private transactionSubscription: Subscription;

  constructor(private transactionS:TransactionService, 
    private router:Router) { 
    transactionS.getTransaction().subscribe(data =>{
      this.transaction=data;
    });
  }

  ngOnInit(): void {
    this.getQR(this.transaction.type,this.transaction.cashier,this.transaction.amount);
    //this.getQR(true,1,5);
  }

  getQR(type:boolean,id:number,amount:number){
    this.transactionS.createTransaction(this.client.id,id,type,amount).subscribe(transaction =>{
      this.transaction=transaction;
      console.log(transaction)
      console.log(transaction.securityCode.length)
      this.base64QR =transaction.securityCode;
      this._ready=true;
    })

    const timeout = setTimeout(() =>{
      this.router.navigate(['/main']);
    },this.timeLeft);
    setInterval(() => {
      this.timeLeft = this.timeLeft - 1000; // reduce the time left by 1 second
      this.timer = this.transform(this.timeLeft);
    }, 1000)
  }

  transform(value: number): string {
    const minutes = `0${new Date(value).getMinutes()}`.slice(-2);
    const seconds = `0${new Date(value).getSeconds()}`.slice(-2);
    return `${minutes}:${seconds}`;
  }

  ngOnDestroy(){
    if(this.transactionSubscription){
      this.transactionSubscription.unsubscribe();
    }
  }
}
