import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MapService } from 'src/app/services/map.service';
import { CashierService } from 'src/app/services/cashier.service';


@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {

  @Input() postalCode:string;
  @Output() searchLocation = new EventEmitter<{ lat: number, lng: number }>();

  streetControl = new FormControl();
  searchList:string[] = []; // This will be populated with street data from an API
  filteredStreets:Observable<string[]>;
  @Output() street:string;

  constructor(private cashierService:CashierService, private http: HttpClient, private mapService:MapService){
    // Initialize filteredStreets with an observable that maps the search input to a filtered array of streets
    this.filteredStreets = this.streetControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    console.log(this.filteredStreets);
  }

  search(){
    console.log(this.street)
    if(this.street==""){
      //algo
      console.log("no hay calle o codigo postal");
    }
  }

  onSubmit(){
    console.log("street -->",this.street)
    this.mapService.searchByPostalCode(this.street);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.searchList.filter(street => street.toLowerCase().includes(filterValue));
  }
}
