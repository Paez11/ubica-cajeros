import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MapService } from 'src/app/services/map.service';
import { CashierService } from 'src/app/services/cashier.service';
import { ICashier } from 'src/app/model/ICashier';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  @Output() searchLocation = new EventEmitter<{ lat: number, lng: number }>();
  @Output() streetChange = new EventEmitter<string>();

  streetControl = new FormControl();
  searchList:string[] = [];
  filteredStreets:Observable<string[]>;
  
  @Output() street:string;

  constructor(private _cashierService:CashierService, private http: HttpClient, private _mapService:MapService){
    
  }
  ngOnInit(): void {
    this._cashierService.getAll()
    .pipe(
      map( (values:ICashier[]) => {
          values.forEach(e => 
            this.searchList.push(e.address)
          );
        }
      )
    )
    .subscribe();

    // Initialize filteredStreets with an observable that maps the search input to a filtered array of streets
    this.filteredStreets = this.streetControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  search(){
    if(this.street==""){
      //algo
      console.log("no hay calle o codigo postal");
    }
  }

  onSubmit(){
    this._mapService.setStreet(this.street);
    this._mapService.searchByPostalCode(this.street);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.searchList.filter(street => street.toLowerCase().includes(filterValue));
  }
}
