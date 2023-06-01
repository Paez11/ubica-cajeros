import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IClient } from '../model/IClient';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DTO_Client } from '../model/DTO_Client';
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private url: string = environment.api.url;

  public user: IClient;
  private userSubject: BehaviorSubject<IClient>;

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.userSubject = new BehaviorSubject<IClient>(this.user);
  }

  public setUser(user: IClient) {
    this.user = user;
    this.userSubject.next(this.user);
  }

  public getUserObservable(): Observable<IClient> {
    return this.userSubject.asObservable();
  }

  getAll(): Observable<IClient[]> {
    try {
      return this.http.get<IClient[]>(
        this.url + environment.api.endpoint.clientAll
      );
    } catch (error) {
      return (
        error +
        this.toastr.error(
          this.translate.instant('errorServer'),
          this.translate.instant('error')
        )
      );
    }
  }

  get(id: number): Observable<IClient> {
    return this.http.get<IClient>(
      this.url + environment.api.endpoint.clientbyid + '/' + id
    );
  }

  getByDni(dni: string): Observable<IClient> {
    if (!dni) {
      throw new Error('Data error.');
    }
    return this.http.get<IClient>(
      this.url + environment.api.endpoint.clientbydni + '/' + dni
    );
  }

  getNewPassword(dtoClient: DTO_Client): Observable<DTO_Client> {
    return this.http.put<DTO_Client>(
      this.url + environment.api.endpoint.newPassword + '/' + dtoClient.dni,
      dtoClient
    );
  }

  create(account, dni, password, email, id?): Observable<any> {
    if (!account || !dni || !password || !email) {
      throw new Error('Data error.');
    }

    let data: IClient = {
      account: account,
      dni: dni,
      password: password,
      email: email,
    };

    const endpoint = this.url + environment.api.endpoint.newclient;
    return this.http.post(endpoint, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  update(client: IClient): Observable<IClient> {
    return this.http.put<IClient>(this.url + environment.api.endpoint.clientbyid + '/' + client.id, client);
  }

  delete(id: number): Observable<IClient> {
    return this.http.delete<IClient>(
      this.url + environment.api.endpoint.clientbyid + '/' + id
    );
  }
}
