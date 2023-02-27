import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IClient } from 'src/app/model/IClient';
import {Toast} from 'bootstrap';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  dni:string
  password:string
  @ViewChild('email') email!:ElementRef

  toast:Toast

  client:IClient = {
    id: 0,
    name: '',
    account: '',
    dni: '',
    password: ''
  }

  constructor(private clientS:ClientService) {

   }

  ngOnInit(): void {
  }

  public auth():IClient{
    this.client.dni = this.dni
    this.client.password = this.password
    console.log(this.client)
    if(this.clientS.getByDni(this.dni)){
      
      
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
