import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { UsersService } from '../shared/services/users.service';
import { UserEto } from '../shared/to/UserEto';
import { UserTo } from '../shared/to/UserTo';

@Component({
  selector: 'cf-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  public isSpinnerDisplayed = false;
  public passwordForm: FormGroup;
  public emailForm: FormGroup;
  public hide: boolean;
  public matcher: MyErrorStateMatcher;
  public user: UserEto;
  public userControl: FormControl;
  private subscritpion: Subscription = new Subscription();

  constructor(
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    public dialog: MatDialog,
    private userService: UsersService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.isSpinnerDisplayed = true;
    this.hide = true;

    this.createsForms();
    this.getLoggedUser();
    this.onSpinnerDisplayed();
  }

  private onSpinnerDisplayed(){
    this.subscritpion.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  private createsForms() {
    this.userControl = new FormControl('', Validators.required);

    this.passwordForm = this._formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords })

    this.emailForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', Validators.email]
    }, { validator: this.checkEmails })

    this.matcher = new MyErrorStateMatcher();
  }

  private getLoggedUser() {
    this.userService.getLoggedUser().then(() => {
      this.subscritpion.add(this.userService.loggedUserData.subscribe((userEto: UserEto) => {
        this.userControl = new FormControl(userEto);
        this.user = userEto;
      }))
    })
  }

  getErrorMessage1st() {
    if (this.emailForm.controls['email'].hasError('required')) {
      return this.translate.instant('registration.email-null');
    }

    return this.emailForm.controls['email'].hasError('email') ? this.translate.instant('registration.email-invalid') : '';
  }

  getErrorMessage2nd() {
    if (this.emailForm.controls['confirmEmail'].hasError('required')) {
      return this.translate.instant('registration.email-null');
    }

    return this.emailForm.controls['confirmEmail'].hasError('email') ? this.translate.instant('registration.email-invalid') : '';
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  checkEmails(group: FormGroup) {
    let email = group.get('email').value;
    let confirmEmail = group.get('confirmEmail').value;

    return email === confirmEmail ? null : { notSame: true }
  }

  ngOnDestroy() {
    this.subscritpion.unsubscribe();
  }

  modifyAccount() {
    const dialogRef = this.dialog.open(UserDetailsModifyDialog, { data: this.userControl.value, height: '31%', width: '50%' });
    dialogRef.afterClosed().subscribe((userTo: UserTo) => {
      if (!!userTo) {
        this.userService.modifyUser(userTo, this.user.id);
      }
    })
  }

  changePassword(){
    let userTo: UserTo = {
      roleId: this.user.roleEto.id,
      accountTo: {
        email: this.user.accountEto.email,
        password: this.passwordForm.get('password').value
      },
      name: this.user.name,
      surname: this.user.surname
    }

    this.userService.modifyAccount(userTo, this.user.id).then(() => {
      this.authService.logout();
    })
  }

  changeEmail(){
    let userTo: UserTo = {
      roleId: this.user.roleEto.id,
      accountTo: {
        email: this.emailForm.get('email').value,
        password: this.user.accountEto.password
      },
      name: this.user.name,
      surname: this.user.surname
    }

    this.userService.modifyAccount(userTo, this.user.id).then(() => {
      this.authService.logout();
    })
  }
}

@Component({
  selector: 'user-details-modify-dialog',
  templateUrl: 'user-details-modify-dialog.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsModifyDialog implements OnInit {
  isSpinnerDisplayed = false;
  subscription = new Subscription();
  nameControl = new FormControl("", Validators.required);
  surnameControl = new FormControl("", Validators.required);

  constructor(
    public dialogRef: MatDialogRef<UserDetailsModifyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserEto) { }

  ngOnInit(): void {
    this.nameControl.setValue(this.data.name);
    this.surnameControl.setValue(this.data.surname);
  }

  modifyUser() {
    if (this.nameControl.valid && this.surnameControl.valid) {
      this.dialogRef.close({
        roleId: this.data.roleEto.id,
        accountTo: {
          username: this.data.accountEto.username,
          password: this.data.accountEto.password
        },
        name: this.nameControl.value,
        surname: this.surnameControl.value
      })
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
