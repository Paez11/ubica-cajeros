import { Component, OnInit } from '@angular/core';
import { ICashier } from 'src/app/model/ICashier';
import { CashierService } from 'src/app/services/cashier.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{
  
  public cashiers:ICashier[] = []
  
  constructor(private cashierS:CashierService) {
    this.cashierS.getAll().subscribe(e =>{
      this.cashiers.push(...e)
    });
  }

  ngOnInit() {
    
  }
}
