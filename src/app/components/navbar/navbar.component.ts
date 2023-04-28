import { Component, Input, OnInit } from '@angular/core';
import { ICashier } from 'src/app/model/ICashier';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
@Input() cashierList: ICashier[];
  constructor() { }

  ngOnInit(): void {
  }

}
