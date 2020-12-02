import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { RoleEto } from 'src/app/usermanagement/shared/to/RoleEto';
import { UserTo } from 'src/app/usermanagement/shared/to/UserTo';

@Component({
  selector: 'cf-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  public nameControl = new FormControl("", Validators.required);
  public surnameControl = new FormControl("", Validators.required);
  public emailControl = new FormControl("", [Validators.required, Validators.email]);
  public roleControl = new FormControl("", Validators.required);
  public roles: RoleEto[];
  public isSpinnerDisplayed: boolean;
  public subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.loadsAllRoles();
    this.onSpinnerDisplayed();
  }

  private loadsAllRoles() {
    this.userService.getAllRoles();

    this.subscription.add(this.userService.rolesData.subscribe(
      (roles) => {
        this.roles = roles;
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  addUser() {
    if (this.nameControl.valid && this.surnameControl.valid && this.emailControl.valid && this.roleControl.valid) {

      let userTo: UserTo = {
        name: this.nameControl.value,
        surname: this.surnameControl.value,
        roleId: this.roleControl.value.id,
        accountTo: {
          email: this.emailControl.value,
          password: this.makeStringValue(8)
        }
      };

      this.userService.createUserInManagement(userTo).then(() => {
          this.dialogRef.close();
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private makeStringValue(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
}