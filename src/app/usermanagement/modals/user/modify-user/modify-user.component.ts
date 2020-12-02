import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { RoleEto } from 'src/app/usermanagement/shared/to/RoleEto';
import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';
import { UserTo } from 'src/app/usermanagement/shared/to/UserTo';

@Component({
  selector: 'cf-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})
export class ModifyUserComponent implements OnInit {
  public nameControl = new FormControl("", Validators.required);
  public surnameControl = new FormControl("", Validators.required);
  public emailControl = new FormControl("", [Validators.required, Validators.email]);
  public roleControl = new FormControl("", Validators.required);
  public roles: RoleEto[];
  public isSpinnerDisplayed: boolean;
  public subscription = new Subscription();
  public selectedRole: RoleEto;
  public isReady = false;

  constructor(
    public dialogRef: MatDialogRef<ModifyUserComponent>,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: UserEto
  ){}

  ngOnInit(): void {
    this.nameControl = new FormControl(this.data.name, Validators.required);
    this.surnameControl = new FormControl(this.data.surname, Validators.required);
    this.emailControl = new FormControl(this.data.accountEto.email, [Validators.required, Validators.email]);
    this.roleControl = new FormControl(this.data.roleEto, Validators.required);
    this.selectedRole = this.data.roleEto;

    this.loadsAllRoles();
    this.onSpinnerDisplayed();
  }

  private loadsAllRoles() {
    this.userService.getAllRoles();

    this.subscription.add(this.userService.rolesData.subscribe(
      (roles) => {
        this.roles = roles;
        this.isReady = true;
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  modifyUser() {
    if (this.nameControl.valid && this.surnameControl.valid && this.emailControl.valid && this.roleControl.valid) {

      let userTo: UserTo = {
        name: this.nameControl.value,
        surname: this.surnameControl.value,
        roleId: this.roleControl.value.id,
        accountTo: {
          email: this.emailControl.value,
          password: this.data.accountEto.password,
        }
      };

      this.userService.modifyUserInManagement(userTo, this.data.id).then(() => {

        if(!this.data.accountEto.email == this.emailControl.value){
          this.userService.modifyAccountInManagement(userTo, this.data.accountEto.id).then(() => {
            this.dialogRef.close();
          })
        } else {
          this.dialogRef.close();
        }
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
  
  compareFn(c1,c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
