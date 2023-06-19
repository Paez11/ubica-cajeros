import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private _translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  changePassword() {
    this._clientService.user.password = this.newPassword;
    this._clientService.update(this._clientService.user).subscribe(
      () => {
        this._clientService.setUser(this._clientService.user);
        this._toastr.success(this._translate.instant('changedPass'));
        this.router.navigate(['/main/map']);
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
