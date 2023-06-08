import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICashier } from 'src/app/model/ICashier';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  cashier: ICashier;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params) => {
      this.cashier = params[''];
    });
    
    console.log(this.cashier)
  }

}
