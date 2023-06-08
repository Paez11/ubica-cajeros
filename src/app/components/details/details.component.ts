import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { CashierService } from 'src/app/services/cashier.service';
import { ClientService } from 'src/app/services/client.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
 @Input() public cashiers: ICashier[] = [];

  private clientSubscription: Subscription;
  private cashierSubscription: Subscription;

  constructor(
    private _cashierS: CashierService,
    private _clientS: ClientService,
    private _toastrSevice: ToastrService,
    private _translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clientSubscription = this._clientS
      .getUserObservable()
      .subscribe(() => {
        this.setData();
      });
  }

  async setData(): Promise<void> {
    let mapComponent = document.querySelector('map');
    if (!mapComponent) {
      // MyComponent hasn't finished loading yet, wait for it to appear
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.initializeMyComponent(); // Recursively call this function until the component is found
    } else {
      return new Promise((resolve) => {
        // MyComponent has finished loading, initialize it
        const componentInstance = mapComponent['map'];
        componentInstance.ngOnInit();
        resolve();
      });
    }
  }

  initializeMyComponent(): void | PromiseLike<void> {
    try {
      this.cashiers = [];
      this.cashierSubscription = this._cashierS
        .getCashiersByRadius(
          this._clientS.user?.id,
          this._clientS.user?.lat,
          this._clientS.user?.lng,
          this._clientS.user?.distance
        )
        .subscribe((cashiers) => {
          this.cashiers.push(...cashiers);
        });
    } catch (error) {
      this._toastrSevice.info(this._translateService.instant("gpsError", "GPS Error" ));
    }
  }

  openTransaction(cashier: ICashier) {
    this.router.navigate(['/main/transaction', cashier]);
  }

  ngOnDestroy() {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
    if (this.cashierSubscription) {
      this.cashierSubscription.unsubscribe();
    }
  }

  decodeImg(photo: string): SafeResourceUrl {
    return this._cashierS.getDecodeImg(photo);
  }
}
