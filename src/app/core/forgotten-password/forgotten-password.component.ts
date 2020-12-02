import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';

@Component({
  selector: 'cf-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss']
})
export class ForgottenPasswordComponent implements OnInit {
  public email: FormControl;
  public matcher: MyErrorStateMatcher;
  public passwordForm: FormGroup;
  public hide: boolean;
  public isSpinnerDisplayed = false;
  private subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private _formBuilder: FormBuilder,
    private userService: UsersService,
    ) {     
    this.email = new FormControl('', [Validators.required, Validators.email])
   }

  ngOnInit(): void {
    this.hide = true;
    this.createsForms();
    this.onSpinnerDisplayed();
  }

  private createsForms() {
    this.email = new FormControl('', [Validators.required, Validators.email]);

    this.passwordForm = this._formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords })

    this.matcher = new MyErrorStateMatcher();
  }
  
  private onSpinnerDisplayed(){
    this.subscription.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  changePassword(){
    if(this.passwordForm.valid && this.email.valid){
      let accountTo = {
        email: this.email.value,
        password: this.passwordForm.get('password').value
      }
      this.userService.changePassword(accountTo);
    }
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return this.translate.instant('registration.email-null');
    }

    return this.email.hasError('email') ? this.translate.instant('registration.email-invalid') : '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}