import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { PermissionEto } from 'src/app/usermanagement/shared/to/PermissionEto';
import { RoleTo } from 'src/app/usermanagement/shared/to/RoleTo';

@Component({
  selector: 'cf-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  public nameControl = new FormControl("", Validators.required);
  public descriptionControl = new FormControl("", Validators.required);
  public permissionsControl = new FormControl("", Validators.required);
  public permissions: PermissionEto[];
  public isSpinnerDisplayed = false;
  public subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<AddRoleComponent>,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.loadsAllPermissions();
    this.onSpinnerDisplayed();
  }

  private loadsAllPermissions() {
    this.userService.getAllPermissions();

    this.subscription.add(this.userService.permissionsData.subscribe(
      (permissions) => {
        this.permissions = permissions;
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  addRole() {
    if (this.nameControl.valid && this.descriptionControl.valid && this.permissionsControl.valid) {
      let permissionsIds = this.permissionsControl.value.map(permission => permission.id);

      let roleTo: RoleTo = {
        name: this.nameControl.value,
        description: this.descriptionControl.value,
        permissionIds: permissionsIds,
      };

      this.userService.createRole(roleTo).then(() => {
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
}