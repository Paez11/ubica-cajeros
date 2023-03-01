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

  constructor(private http:HttpClient) { }

  createTransaction(client, cashier, type, amount):Observable<any> {
    if(!client || !cashier || !type || !amount || amount<0) {
      throw new Error("Data error.");
    }

    let data:DTOTransaction = {
      client:client,
      cashier:cashier,
      type:type,
      amount:amount,
    }

    const endpoint = environment.api.url+environment.api.endpoint.transactions;
    return this.http.post(endpoint, data, {
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
