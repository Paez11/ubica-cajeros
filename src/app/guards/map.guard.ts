import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { TransactionService } from '../services/transaction.service';

@Injectable({
  providedIn: 'root'
})
export class MapGuard implements CanActivate {
  
  constructor(private _transactionService: TransactionService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      let result = false;
      this._transactionService.getTransaction().subscribe(val => val === undefined ? result = false : result = true);
      return result;
  }
}
