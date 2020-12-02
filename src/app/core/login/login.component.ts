import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { Credentials } from 'src/app/authentication/to/Authorization';
import { ApplicationPermission } from '../../shared/utils/ApplicationPermission';

@Component({
  selector: 'cf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public hide: boolean;
  private credentials: Credentials;
  private subscription = new Subscription();
  public isSpinnerDisplayed = false;
  public passwordFormControl = new FormControl("", Validators.required);
  public usernameFormControl = new FormControl("", Validators.required);

  constructor(
    private authService: AuthenticationService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
  ) {
    this.hide = true;
  }

  ngOnInit(): void {
    this.subscription.add(this.authService.spinnerData.subscribe((isDisplayed) => {
      this.isSpinnerDisplayed = isDisplayed;
    }));
  }

  authenticate(): void {
    if (this.passwordFormControl.valid && this.usernameFormControl.valid) {
      this.isSpinnerDisplayed = true;
      this.credentials = {
        username: this.usernameFormControl.value,
        password: this.passwordFormControl.value,
      }
      this.authService.authenticate(this.credentials).then(() => {
        this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_SUPER).then((result) => {
          if (result) {
            this.router.navigate(['manager']);
          } else {
            Promise.all([
              this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_BOOKINGS),
              this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_ORDERS),
              this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_INDICATORS),
              this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_SERVICES)
            ]).then((result) =>
              result.find(r => r == true) ? this.router.navigate(['manager']) : this.router.navigate(['client']));
          }
        })
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
