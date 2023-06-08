import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { DTOTransaction } from '../model/DTOTransaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  //private url:string = "http://localhost:8080/api/transactions";

  private transaction:DTOTransaction;
  private transactionSubject: BehaviorSubject<DTOTransaction>;

  constructor(private http:HttpClient) { 
    this.transactionSubject = new BehaviorSubject<DTOTransaction>(this.transaction);
  }

  createTransaction(client, cashier, type, amount) :Observable<DTOTransaction> {
    if(!client || !cashier || type==undefined || !amount || amount<0) {
      throw new Error("Data error.");
    }

    let data:DTOTransaction = {
      client:client,
      cashier:cashier,
      type:type,
      amount:amount
    }

    const endpoint = environment.api.url+environment.api.endpoint.transactions;
    return this.http.post<DTOTransaction>(endpoint, data, {
        headers: { 'Content-Type': 'application/json' }
    });
  }

  setTransaction(transaction:DTOTransaction){
    this.transactionSubject.next(transaction);
  }

  getTransaction():Observable<DTOTransaction>{
    return this.transactionSubject.asObservable();
  }
}
