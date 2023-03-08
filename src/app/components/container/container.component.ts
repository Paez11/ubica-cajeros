import { Component,ViewChild,OnInit,AfterViewInit } from '@angular/core';
import { ModalTransactionComponent } from '../modal-transaction/modal-transaction.component';
import { ModalTService } from '../../services/modal-t.service';
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit,AfterViewInit{ 
  @ViewChild('tdetail') modal:ModalTransactionComponent;
  constructor(private modalS:ModalTService){
  
  }
  ngAfterViewInit(): void {
    console.log("COMPONENTE");
    console.log(this.modal);
    this.modalS.modal=this.modal;
  }
  ngOnInit(): void {

  }
 
}
