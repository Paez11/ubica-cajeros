import { Component, OnInit, ViewChild } from '@angular/core';
import { ICashier } from 'src/app/model/ICashier';
import { CashierService } from 'src/app/services/cashier.service';
import { ClientService } from 'src/app/services/client.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{
  
  public cashiers:ICashier[] = [];
  
  constructor(private cashierS:CashierService, private transactionS:TransactionService, private clientS:ClientService) {
    console.log("client -->"+clientS.user)
  }

  ngOnInit() {
    this.clientS.getUserObservable().subscribe(() => {
      this.setData();
    });
  }

  async setData(): Promise<void> {
    let mapComponent = document.querySelector('map');
    if(!mapComponent){
      // MyComponent hasn't finished loading yet, wait for it to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.initializeMyComponent(); // Recursively call this function until the component is found
    } else {
      return new Promise(resolve => {
        // MyComponent has finished loading, initialize it
        const componentInstance = mapComponent['map'];
        componentInstance.ngOnInit();
        resolve();
      });
    }
  }

  initializeMyComponent(): void | PromiseLike<void> {
    try{
      this.cashiers=[];
      console.log(this.clientS.user);
      this.cashierS.getCashiersByRadius(this.clientS.user.id,this.clientS.user.lat,this.clientS.user.lng,this.clientS.user.distance).subscribe(cashiers =>{
        this.cashiers.push(...cashiers);
        console.log(this.cashiers)
        //this.cashierS.addItem(this.cashiers);
      });
    }catch(error){
      console.error(error);
    }
  }

  openModal(cashierId: number) {
    console.log("ENTRA")
    document.getElementById("launchModal")?.click();
    //this.transactionS.show();
  }
  /*
  ngAfterViewInit() {
    this.setData();
  }
  */
}


