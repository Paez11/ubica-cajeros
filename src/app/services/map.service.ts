import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICashier } from '../model/ICashier';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private url:string = "http://localhost:8080/api/cashiers";

  constructor(private http:HttpClient) { 
      
  }

  getAll():Observable<ICashier[]>{
    return this.http.get<ICashier[]>(this.url);
  }

  get(id:number):Observable<ICashier>{
    return this.http.get<ICashier>(this.url+'/'+id);
  }

  create(cashier:ICashier):Observable<ICashier>{
    return this.http.post<ICashier>(this.url, cashier);
  }

  update(cashier:ICashier):Observable<ICashier>{
    return this.http.put<ICashier>(this.url, cashier);
  }

  remove(id:number):Observable<ICashier>{
    return this.http.delete<ICashier>(this.url+'/'+id);
  }
}
