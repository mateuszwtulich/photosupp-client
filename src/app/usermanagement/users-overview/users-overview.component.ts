import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DeleteComponent } from 'src/app/core/delete/delete.component';
import { SortUtil } from 'src/app/shared/utils/SortUtil';
import { AddUserComponent } from '../modals/user/add-user/add-user.component';
import { ModifyUserComponent } from '../modals/user/modify-user/modify-user.component';
import { UsersService } from '../shared/services/users.service';
import { UserEto } from '../shared/to/UserEto';

@Component({
  selector: 'cf-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.scss']
})
export class UsersOverviewComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'surname', 'username', 'email', 'isActivated', 'role', 'actions'];
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
    this.loadsAllUsers();
  }

  private loadsAllUsers() {
    this.usersService.getAllUsers();

    this.subscription.add(this.usersService.usersData.subscribe(
      (users) => {
        this.dataSource = new MatTableDataSource(users);
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

  private prepareFilterPredicate(): (data: UserEto, filter: string) => boolean {
    return (data: UserEto, filter: string) => {
      return data.name.toLocaleLowerCase().includes(filter) || data.surname.toLocaleLowerCase().includes(filter) || 
      data.accountEto.username.toLocaleLowerCase().includes(filter) || data.accountEto.email.toLocaleLowerCase().includes(filter) ||
        this.translate.instant("users." + data.accountEto.isActivated).toLocaleLowerCase().includes(filter) || 
        data.roleEto.name.toLocaleLowerCase().includes(filter);
    };
  }

  filterStatus(status: string) {
    if (status != "ALL") {
      this.dataSource.filter = status.trim().toLowerCase();
    } else {
      this.dataSource.filter = "";
    }
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
        case "surname":
          return SortUtil.compare(a.surname, b.surname, isAsc);
        case "isActivated":
          return SortUtil.compare(this.translate.instant("users." + a.account.isActivated), this.translate.instant("users." + b.account.isActivated), isAsc);
        case "username":
          return SortUtil.compare(a.accountEto.username, b.accountEto.username, isAsc);
        case "email":
          return SortUtil.compare(a.accountEto.email, b.accountEto.email, isAsc);
        case "role":
          return SortUtil.compare(a.roleEto.name, b.roleEto.name, isAsc);
        default:
          return 0;
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, { height: '55%', width: '45%' });
  }

  modifyUser(user: UserEto) {
    const dialogRef = this.dialog.open(ModifyUserComponent, { data: user, height: '55%', width: '45%' });
  }

  deleteUser(user: UserEto) {
    const dialogRef = this.dialog.open(DeleteComponent, { height: '20%', width: '45%'});

    dialogRef.afterClosed().subscribe((isDecisionPositive: boolean) => {
      if(isDecisionPositive){
        this.usersService.deleteUser(user.id);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
