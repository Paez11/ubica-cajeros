import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IClient } from '../model/IClient';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url:string = 'http://localhost:8080/api/client';

  public user: IClient;
  private userSubject: BehaviorSubject<IClient>;

  constructor(private http:HttpClient) { 
    this.userSubject = new BehaviorSubject<IClient>(this.user);
  }

  public setUser(user: IClient) {
    this.user = user;
    this.userSubject.next(this.user);
  }

  public getUserObservable(): Observable<IClient> {
    return this.userSubject.asObservable();
  }

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
