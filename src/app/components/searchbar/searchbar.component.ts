import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CashierService } from 'src/app/services/cashier.service';


@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {

  streetControl = new FormControl();
  searchList:string[] = []; // This will be populated with street data from an API
  filteredStreets:Observable<string[]>;
  @Input() street:string;

  constructor(private cashierService:CashierService){
    // Initialize filteredStreets with an observable that maps the search input to a filtered array of streets
    this.filteredStreets = this.streetControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    console.log(this.filteredStreets);
  }

  search(){
    this.cashierService.getCashiersByAddress(this.street);
    console.log(this.street)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.searchList.filter(street => street.toLowerCase().includes(filterValue));
  }
}
