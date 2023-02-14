import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IClient } from '../model/IClient';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url:string = 'http://localhost:8080/api/client';

  public user: IClient;

  constructor(private http:HttpClient) { }

  getClient(): IClient {
    return this.user;
  }

  getAll():Observable<IClient[]>{
    return this.http.get<IClient[]>(this.url);
  }

  get(id:number):Observable<IClient>{
    return this.http.get<IClient>(this.url+'/'+id);
  }

  create(client:IClient):Observable<IClient>{
    return this.http.post<IClient>(this.url, client);
  }

  update(client:IClient):Observable<IClient>{
    return this.http.put<IClient>(this.url, client);
  }

  delete(id:number):Observable<IClient>{
    return this.http.delete<IClient>(this.url+'/'+id);
  }
}
