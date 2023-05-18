import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ModalTransactionComponent } from '../modal-transaction/modal-transaction.component';
import { ModalTService } from '../../services/modal-t.service';
import { ICashier } from 'src/app/model/ICashier';
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit, AfterViewInit {
  cashierList: ICashier[];
  @ViewChild('tdetail') modal: ModalTransactionComponent;
  constructor(private _modalS: ModalTService) {}
  ngAfterViewInit(): void {
    this._modalS.modal = this.modal;
  }
  ngOnInit(): void {}
  updateCashierList(List: ICashier[]) {
    this.cashierList = [...List];
  }
}
