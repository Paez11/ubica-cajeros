import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, fromEvent, map } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { CashierService } from 'src/app/services/cashier.service';
import { ClientService } from 'src/app/services/client.service';
import { FormsModule } from '@angular/forms';

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
  cashiersSubs: Subscription;
  selectedValue: string;

  displayedColumns: string[];
  noDisponible: boolean = false;

  clickCashier$ = fromEvent<PointerEvent>(document, 'click');

  public formCashier: FormGroup;

  constructor(
    private _cashierService: CashierService,
    private _clientService: ClientService,
    private formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    private _translateService: TranslateService
  ) {
    this.formCashier = this.formBuilder.group({
      id: ['', [Validators.required]],
      address: ['', [Validators.required]],
      cp: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      lattitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      photo: ['', [Validators.required]],
      available: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.user = this._clientService.user;
    this.refreshCashiersTable();
  }

  refreshCashiersTable() {
    this.cashiersSubs = this._cashierService
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
      lattitude: elem.lattitude,
      longitude: elem.longitude,
      balance: elem.balance,
      available: elem.available
    });

    this.cashier = {
      id: elem.id,
      address: elem.address,
      cp: elem.cp,
      locality: elem.locality,
      lattitude: elem.lattitude,
      longitude: elem.longitude,
      balance: elem.balance,
      photo: elem.photo,
      available: elem.available
    }
  }

  decodeImg(photo: string): SafeResourceUrl {
    return this._cashierService.getDecodeImg(photo);
  }

  createOrUpdateCashier() {
    console.log(this.selectedValue)

    this.cashier = {
      id: this.formCashier.value.id,
      address: this.formCashier.value.address,
      cp: this.formCashier.value.cp,
      locality: this.formCashier.value.locality,
      lattitude: this.formCashier.value.lattitude,
      longitude: this.formCashier.value.longitude,
      balance: this.formCashier.value.balance,
      photo: this.formCashier.value.photo,
      available: this.formCashier.value.available
    }

    if(this.formCashier.value.id === "") {
      this.cashier.id = null;
      this.cashier.available = false;
    }

    try {
      this._cashierService.createOrUpdate(this.cashier).subscribe( (response) => {
        if(response.response === 1) {
          this._toastrService.info(this._translateService.instant("cashierCreated", "Cashier insert"));
          this.formCashier.reset();
          this.cashiersSubs.unsubscribe();
          this.refreshCashiersTable();  
        } else {
          this._toastrService.info(this._translateService.instant("cashierNotCreated", "cashier not created"));
        }
      });
    } catch (error) {
      this._toastrService.error(this._translateService.instant("serviceError", "Error service"));  
    }
  }

  deleteCashier() {
    try {
      if (this.cashier.id) {
        this._cashierService.remove(this.cashier.id).subscribe( (response) => {
          if(response) {
            this._toastrService.info(this._translateService.instant("deleteCashier", "Delete cashier"));
            this.formCashier.reset();
            this.cashiersSubs.unsubscribe();
            this.refreshCashiersTable();
          } else {
            this._toastrService.info(this._translateService.instant("cashierNotFound", "Cashier not found"));
          }
        });
      } else {
        this._toastrService.info(this._translateService.instant("cashierIdMissing", "Missing ID"));
      }
    } catch(error) {
        this._toastrService.error(this._translateService.instant("serviceError", "Error service"));
    }
  }

  onSelectedChange() {
    console.log(this.selectedValue)  
  }
}