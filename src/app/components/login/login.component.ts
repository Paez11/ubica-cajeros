import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IClient } from 'src/app/model/IClient';
//import {Toast} from 'bootstrap';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  dni:string
  @ViewChild('password') password!:ElementRef
  @ViewChild('email') email!:ElementRef

  client:IClient

  constructor(private clientS:ClientService) {

   }

  ngOnInit(): void {
    console.log(this.dni)
  }

  public auth():IClient{
    console.log(this.dni)
    this.client.dni = this.dni
    console.log(this.client)
    if(this.clientS.getByDni(this.dni)){
      this.showErrorToast();
      
      //close component and still in map
    }else if(this.client==null){
      //open modal register
    }
    return this.client
  }

  public sendMail(){
    console.log("Sended")    
  }

  public submit(){
    console.log("Logged")
  }

  public cancel(){
    console.log("Canceled")
  }

  showErrorToast(){
    const toastElement = document.getElementById('errorToast')
    //const toast = new Toast(toastElement)
    //toast.show()
    
  }
}
