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
  notFoundPhoto: SafeResourceUrl = './assets/icons/image-not-found.png';
  cashiersSubs: Subscription;

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
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      photo: ['', [Validators.required]],
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
      this.notFoundPhoto = './assets/icons/image-not-found.png';
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

    this.cashier = {
      id: elem.id,
      address: elem.address,
      cp: elem.cp,
      locality: elem.locality,
      latitude: elem.lattitude,
      longitude: elem.longitude,
      balance: elem.balance,
      photo: elem.photo,
      available: elem.available,
    };
  }

  decodeImg(photo: string): SafeResourceUrl {
    return this._cashierService.getDecodeImg(photo);
  }

  createCashier() {
    this.cashier = {
      id: null,
      address: this.formCashier.value.address,
      cp: this.formCashier.value.cp,
      locality: this.formCashier.value.locality,
      latitude: this.formCashier.value.lattitude,
      longitude: this.formCashier.value.longitude,
      balance: this.formCashier.value.balance,
      photo: this.formCashier.value.photo,
      available: this.formCashier.value.available,
    };

    try {
      this._cashierService
        .createOrUpdate(this.cashier)
        .subscribe((response) => {
          if (response.response === 1) {
            this._toastrService.info(
              this._translateService.instant('cashierCreated', 'ATM insert')
            );
          }
        });
    } catch (error) {
      this._toastrService.error(
        this._translateService.instant('serviceError', 'Error service')
      );
    }
  }

  updateCashier() {}

  deleteCashier() {
    try {
      if (this.cashier.id) {
        this._cashierService.remove(this.cashier.id).subscribe((result) => {
          if (result) {
            this._toastrService.info(
              this._translateService.instant('deleteCashier', 'Delete cashier')
            );
            this.formCashier.reset();
            this.cashiersSubs.unsubscribe();
            this.refreshCashiersTable();
          } else {
            this._toastrService.info(
              this._translateService.instant(
                'cashierNotFound',
                'Cashier not found'
              )
            );
          }
        });
      } else {
        this._toastrService.info(
          this._translateService.instant('cashierIdMissing', 'Missing ID')
        );
      }
    } catch (error) {
      this._toastrService.error(
        this._translateService.instant('serviceError', 'Error service')
      );
    }
  }

  resetForm() {
    this.noDisponible = true;
    this.formCashier.reset();
  }

  changeImage() {
    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (event: any) => {
      const selectedFile = event.target.files[0];
      console.log('Nueva imagen seleccionada:', selectedFile);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result; // Aquí tienes acceso al contenido del archivo seleccionado
        // Puedes utilizar el contenido del archivo como necesites en tu aplicación
        console.log('Contenido del archivo:', fileContent);
        this.atmPhoto = fileContent;
        this.notFoundPhoto = fileContent;
      };
      reader.readAsDataURL(selectedFile);
    });
    inputElement.click();
  }
}
