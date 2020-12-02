import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { PermissionEto } from 'src/app/usermanagement/shared/to/PermissionEto';
import { RoleEto } from 'src/app/usermanagement/shared/to/RoleEto';
import { RoleTo } from 'src/app/usermanagement/shared/to/RoleTo';

@Component({
  selector: 'cf-modify-role',
  templateUrl: './modify-role.component.html',
  styleUrls: ['./modify-role.component.scss']
})
export class ModifyRoleComponent implements OnInit {
  public nameControl: FormControl;
  public descriptionControl: FormControl;
  public permissionsControl: FormControl;
  public permissions: PermissionEto[];
  public isSpinnerDisplayed = false;
  public subscription = new Subscription();
  public selectedPermissions: PermissionEto[];
  public isReady = false;

  constructor(
    public dialogRef: MatDialogRef<ModifyRoleComponent>,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: RoleEto
  ) { }

  ngOnInit(): void {
    this.descriptionControl = new FormControl(this.data.description, Validators.required);
    this.permissionsControl = new FormControl(this.data.permissionEtoList, Validators.required);
    this.selectedPermissions = this.data.permissionEtoList;
    this.nameControl = new FormControl(this.data.name, Validators.required);

    this.loadsAllPermissions();
    this.onSpinnerDisplayed();
  }

 
  private loadsAllPermissions() {
    this.userService.getAllPermissions();

    this.subscription.add(this.userService.permissionsData.subscribe(
      (permissions) => {
        this.permissions = permissions;
        this.isReady = true;
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  modifyRole() {
    if (this.nameControl.valid && this.descriptionControl.valid && this.permissionsControl.valid) {
      let permissionsIds = this.permissionsControl.value.map(permission => permission.id);

      let roleTo: RoleTo = {
        name: this.nameControl.value,
        description: this.descriptionControl.value,
        permissionIds: permissionsIds,
      };

      this.userService.modifyRole(roleTo, this.data.id).then(() => {
          this.dialogRef.close();
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
