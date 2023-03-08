import { Injectable } from '@angular/core';
import { ModalTransactionComponent } from '../components/modal-transaction/modal-transaction.component';

@Injectable({
  providedIn: 'root'
})
export class ModalTService {
  private _modalT:ModalTransactionComponent;
  constructor() { }

  set modal(m:ModalTransactionComponent){
    this._modalT=m;
  }
  get modal(){
    return this._modalT;
  }
}
