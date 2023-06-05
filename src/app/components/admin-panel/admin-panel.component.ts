import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { fromEvent, map } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from 'src/app/services/cashier.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  cashierList: ICashier[];
  cashier: ICashier;
  user: IClient;
  atmPhoto: SafeResourceUrl;

  displayedColumns: string[];
  noDisponible: boolean = false;

  clickCashier$ = fromEvent<PointerEvent>(document, 'click');

  public formCashier: FormGroup;

  constructor(
    private _cashierService: CashierService,
    private _clientService: ClientService,
    private formBuilder: FormBuilder
  ) {
    this.formCashier = this.formBuilder.group({
      id: ['', [Validators.required]],
      address: ['', [Validators.required]],
      cp: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      photo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.user = this._clientService.user;
    this._cashierService
      .getAll()
      .pipe(
        map((data) => {
          this.cashierList = data;
          this.cashierList.sort((a, b) => a.id - b.id);
          this.cashierList.forEach((cashier, i) => {
            this.displayedColumns = ['id', 'locality'];
          });
        })
      )
      .subscribe();
  }

  chooseCashier(elem: any) {
    if (elem.photo) {
      this.noDisponible = false;
    } else {
      this.noDisponible = true;
    }
    this.atmPhoto = this._cashierService.getDecodeImg(elem.photo);
    this.formCashier.patchValue({
      id: elem.id,
      address: elem.address,
      cp: elem.cp,
      locality: elem.locality,
      latitude: elem.lattitude,
      longitude: elem.longitude,
      balance: elem.balance,
    });
  }

  decodeImg(photo: string): SafeResourceUrl {
    return this._cashierService.getDecodeImg(photo);
  }
}
