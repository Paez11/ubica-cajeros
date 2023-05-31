import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  newPassword: string;
  constructor(
    private _clientService: ClientService,
    private _toastr: ToastrService,
    private _translate: TranslateService
  ) {}

  ngOnInit(): void {}

  changePassword() {
    this._clientService.user.password = this.newPassword;
    this._clientService.update(this._clientService.user).subscribe(
      () => {
        this._clientService.setUser(this._clientService.user);
      },
      (error: HttpErrorResponse) => {
        this._toastr.error(
          this._translate.instant('errorServer'),
          this._translate.instant('error')
        );
      }
    );
  }
}
