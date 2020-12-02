import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ServiceService } from 'src/app/servicehandling/services/service.service';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { BasicRole } from '../../shared/utils/ApplicationPermission';

@Component({
  selector: 'cf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public emailFormControl: FormControl;
  public nameFormControl: FormControl;
  public surnameFormControl: FormControl;
  public passwordForm: FormGroup;
  public isSpinnerDisplayed = false;

  public hide: boolean;
  subscritpion: Subscription = new Subscription();
  public matcher: MyErrorStateMatcher;
  @ViewChild('formField1') formField1: MatFormField;
  @ViewChild('formField2') formField2: MatFormField;

  constructor(
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    private userService: UsersService,
    private snackbar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.createsForms();
    this.subscritpion.add(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.changeHintLabel();
    }));
  }

  private createsForms() {
    this.hide = true;
    this.nameFormControl = new FormControl('', Validators.required);
    this.surnameFormControl = new FormControl('', Validators.required);
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);

    this.passwordForm = this._formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords })

    this.matcher = new MyErrorStateMatcher();
  }

  ngAfterViewInit(): void {
    this.changeHintLabel();
  }

  private changeHintLabel() {
    this.formField1.hintLabel = this.translate.instant('registration.hint');
    this.formField2.hintLabel = this.translate.instant('registration.hint')
  }

  getErrorMessage() {
    if (this.emailFormControl.hasError('required')) {
      return this.translate.instant('registration.email-null');
    }

    return this.emailFormControl.hasError('email') ? this.translate.instant('registration.email-invalid') : '';
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  register() {
    if (this.nameFormControl.valid && this.surnameFormControl.valid && this.passwordForm.valid && this.emailFormControl.valid) {
      this.isSpinnerDisplayed = true;

      let userTo = {
        name: this.nameFormControl.value,
        surname: this.surnameFormControl.value,
        accountTo: {
          password: this.passwordForm.get('password').value,
          email: this.emailFormControl.value,
        },
        roleId: BasicRole.getClientRoleId()
      }

      this.subscritpion.add(this.userService.createUser(userTo).subscribe((userEto) => {
        this.snackbar.open(this.translate.instant('registration.check-mailbox'));
        this.isSpinnerDisplayed = false;
      },
        (e) => {
          this.snackbar.open(this.translate.instant('registration.error' + " " + e.error.message));
          this.isSpinnerDisplayed = false;
        }))
    }
  }

  ngOnDestroy() {
    this.subscritpion.unsubscribe();
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}