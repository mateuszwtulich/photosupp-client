import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DeleteComponent } from 'src/app/core/delete/delete.component';
import { SortUtil } from 'src/app/shared/utils/SortUtil';
import { AddRoleComponent } from '../modals/role/add-role/add-role.component';
import { ModifyRoleComponent } from '../modals/role/modify-role/modify-role.component';
import { ApplicationPermissions } from '../shared/enum/ApplicationPermissions';
import { UsersService } from '../shared/services/users.service';
import { PermissionEto } from '../shared/to/PermissionEto';
import { RoleEto } from '../shared/to/RoleEto';

@Component({
  selector: 'cf-roles-overview',
  templateUrl: './roles-overview.component.html',
  styleUrls: ['./roles-overview.component.scss']
})

export class RolesOverviewComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'permissions', 'actions'];
  public dataSource = new MatTableDataSource([]);
  public isSpinnerDisplayed = false;
  public subscription = new Subscription();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private translate: TranslateService,
    private usersService: UsersService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.onSpinnerDisplayed();
    this.loadsAllRoles();
  }

  private loadsAllRoles() {
    this.usersService.getAllRoles();

    this.subscription.add(this.usersService.rolesData.subscribe(
      (roles) => {
        this.dataSource = new MatTableDataSource(roles);
        this.setDataSourceSettings();
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.usersService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  private setDataSourceSettings() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.prepareFilterPredicate();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private prepareFilterPredicate(): (data: RoleEto, filter: string) => boolean {
    return (data: RoleEto, filter: string) => {
      let inPermissions: boolean = !!data.permissionEtoList
      .find(permission => this.translate.instant("permissions." + permission.name).toLocaleLowerCase().includes(filter));

      return data.name.toLocaleLowerCase().includes(filter) || data.description.toLocaleLowerCase().includes(filter) || inPermissions;
    };
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSource.data = data;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "name":
          return SortUtil.compare(a.name, b.name, isAsc);
        case "description":
          return SortUtil.compare(a.description, b.description, isAsc);
        case "permissions":
          return SortUtil.compare(this.translate.instant("permissions." + a.permissionEtoList[0].name), this.translate.instant("permissions." + b.permissionEtoList[0].name), isAsc);
        default:
          return 0;
      }
    });
  }

  addRole() {
    const dialogRef = this.dialog.open(AddRoleComponent, { height: '50%', width: '45%' });
  }

  modifyRole(role: RoleEto) {
    const dialogRef = this.dialog.open(ModifyRoleComponent, { data: role, height: '50%', width: '45%' });
  }

  deleteRole(role: RoleEto) {
    const dialogRef = this.dialog.open(DeleteComponent, { height: '20%', width: '45%'});

    dialogRef.afterClosed().subscribe((isDecisionPositive: boolean) => {
      if(isDecisionPositive){
        this.usersService.deleteRole(role.id);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
