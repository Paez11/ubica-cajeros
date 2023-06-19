import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class AdminPanelComponent implements OnInit, AfterContentInit {

  @ViewChild('photo', { static: false }) imageRef: ElementRef;

  cashierList: ICashier[];
  cashier: ICashier;
  user: IClient;
  atmPhoto: SafeResourceUrl;
  notFoundPhoto: SafeResourceUrl;
  cashiersSubs: Subscription;
  selectedValue: string;
  displayedColumns: string[];
  noDisponible: boolean = false;
  deleteBtn: boolean = true;
  updateBtn: boolean = true;
  newBtn: boolean = true;
  resetBtn: boolean = true;
  chooseIdFlag: boolean = false;
  auxPhoto: SafeResourceUrl;

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
      id: [''],
      address: ['', [Validators.required]],
      cp: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      lattitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      photo: [''],
      available: ['', [Validators.required]],
    });
  }

  ngAfterContentInit(): void {
    if (this.noDisponible && !this.chooseIdFlag){
      let filledFields: any;
      this.formCashier.valueChanges.subscribe(() => { //Escucha cambios en los campos
        filledFields = Object.keys(this.formCashier.controls) //Matriz con claves de todos los campos
          .filter((key) => key !== 'id') //filtra el campo a excluir
          .every((key) => this.formCashier.get(key).valid && //verifica si todos los campos restantes son válidos y tienen un valor
            (this.formCashier.get(key).value !== '' || this.formCashier.get(key).value !== null));

        if (filledFields) { //Todos los campos, excepto id, están llenos
          this.newBtn = false;
        } else { //Al menos uno de los campos, excepto id, no está lleno
          this.resetBtn = false;
        }
      });
    }

    this.notFoundPhoto = './assets/icons/image-not-found.png';
    this.noDisponible = true;
    document.getElementById('idInput').setAttribute('disabled', 'true');
    this.user = this._clientService.user;
    this.refreshCashiersTable();
  }

  ngOnInit(): void {
    
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
    this.chooseIdFlag = true;
    this.setDisabledBtn(false);

    const photo: HTMLImageElement = this.imageRef.nativeElement;
    const src = photo.src;

    if (elem.photo) {
      this.noDisponible = false;
      this.atmPhoto = this._cashierService.getDecodeImg(elem.photo);
    } else {
      this.noDisponible = true;
      this.notFoundPhoto = './assets/icons/image-not-found.png';
    }
    
    this.formCashier.patchValue({
      id: elem.id,
      address: elem.address,
      cp: elem.cp,
      locality: elem.locality,
      lattitude: elem.lattitude,
      longitude: elem.longitude,
      balance: elem.balance,
      available: elem.available,
      //photo: this.auxPhoto
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
      available: elem.available,
    };
  }

  decodeImg(photo: string): SafeResourceUrl {
    return this._cashierService.getDecodeImg(photo);
  }

  createOrUpdateCashier() {
    const photo: HTMLImageElement = this.imageRef.nativeElement;
    const src = photo.src;
    let auxImg: SafeResourceUrl;

    if(this.auxPhoto === null || this.atmPhoto === undefined){
      auxImg = null;
    } else {
      auxImg = (this.atmPhoto as string).substring(23);
    }
    
    this.cashier = {
      id: this.formCashier.value.id,
      address: this.formCashier.value.address,
      cp: this.formCashier.value.cp,
      locality: this.formCashier.value.locality,
      lattitude: this.formCashier.value.lattitude,
      longitude: this.formCashier.value.longitude,
      balance: this.formCashier.value.balance,
      photo: auxImg as string,
      available: this.formCashier.value.available,
    };

    if (this.formCashier.value.id === '') {
      this.cashier.id = null;
    }

    try {
      if (this.formCashier.valid) {
        this._cashierService.createOrUpdate(this.cashier).subscribe((response) => {
          if (response.response === 1) {
            this._toastrService.info(this._translateService.instant("cashierCreated", "Cashier insert"));
            this.resetForm();
            this.cashiersSubs.unsubscribe();
            this.refreshCashiersTable();
            this.setDisabledBtn(true);
          } else {
            this._toastrService.info(this._translateService.instant("cashierNotCreated", "cashier not created"));
          }
        });
      } else {
        this._toastrService.info(this._translateService.instant("emptyFields", "Empty fields"));
      }
    } catch (error) {
      this._toastrService.error(
        this._translateService.instant('serviceError', 'Error service')
      );
    }
  }

  deleteCashier() {
    try {
      if (this.cashier.id) {
        this._cashierService.remove(this.cashier.id).subscribe((response) => {
          if (response) {
            this._toastrService.info(
              this._translateService.instant('deleteCashier', 'Delete cashier')
            );
            this.resetForm();
            this.cashiersSubs.unsubscribe();
            this.refreshCashiersTable();
            this.setDisabledBtn(true);
          } else {
            this._toastrService.info(this._translateService.instant('cashierNotFound', 'Cashier not found'));
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
    this.chooseIdFlag = false;
    this.noDisponible = true;
    this.formCashier.reset();
    this.setDisabledBtn(true);
    this.notFoundPhoto = './assets/icons/image-not-found.png';
    this.formCashier.value.photo = './assets/icons/image-not-found.png';
  }

  changeImage() {
    const inputElement: HTMLInputElement = document.createElement('input');
    //let fileName: File;
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (event: any) => {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      const fileName: File = event.target.files[0];
      reader.onload = (e: any) => {
        const fileContent = e.target.result; // Aquí tienes acceso al contenido del archivo seleccionado
        this.atmPhoto = fileContent;
        this.notFoundPhoto = fileContent;
        if(fileName.name.includes('image-not-found.png')) {
          console.log('si')

          this.auxPhoto = null;
        } else {
          this.auxPhoto = this.atmPhoto;
        }

      };
      reader.readAsDataURL(selectedFile);
    });
    inputElement.click();
  }

  setDisabledBtn(status: boolean) {
    this.deleteBtn = status;
    this.updateBtn = status;
    this.newBtn = status;
    this.resetBtn = status;
  }
}
