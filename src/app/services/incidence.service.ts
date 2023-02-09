import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DTOIncidence } from '../model/DTOIncidence';

@Injectable({
  providedIn: 'root'
})
export class IncidenceService {

  constructor(private http:HttpClient) { }

  createIncidence(client, cashier, message):Observable<any> {
    if(!client || !cashier || !message) {
      throw new Error("Data error.");
    }

    let data:DTOIncidence = {
      client:client,
      cashier:cashier,    
      message:message
    }
    const endpoint = environment.api.url+environment.api.endpoint.transactions;
    return this.http.post(endpoint, data, {
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
