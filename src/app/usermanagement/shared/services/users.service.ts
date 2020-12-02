import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApplicationPermissions } from '../enum/ApplicationPermissions';
import { UserManagementRestServicePaths } from '../rest-service-paths/UserManagementRestServicePaths';
import { AccountEto } from '../to/AccountEto';
import { PermissionEto } from '../to/PermissionEto';
import { RoleEto } from '../to/RoleEto';
import { UserEto } from '../to/UserEto';
import { UserTo } from '../to/UserTo';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from 'src/app/shared/cache/localStorage.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountTo } from '../to/AccountTo';
import { RoleTo } from '../to/RoleTo';
import { UsermanagementRoutingModule } from '../../usermanagement-routing.module';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public subscription = new Subscription();
  private loggedUserDataSource: BehaviorSubject<UserEto> = new BehaviorSubject(null);
  public loggedUserData = this.loggedUserDataSource.asObservable();
  private spinnerDataSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public spinnerData = this.spinnerDataSource.asObservable();
  private usersDataSource: BehaviorSubject<UserEto[]> = new BehaviorSubject([]);
  public usersData = this.usersDataSource.asObservable();
  private rolesDataSource: BehaviorSubject<RoleEto[]> = new BehaviorSubject([]);
  public rolesData = this.rolesDataSource.asObservable();
  private permissionsDataSource: BehaviorSubject<PermissionEto[]> = new BehaviorSubject([]);
  public permissionsData = this.permissionsDataSource.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private localStorage: LocalStorageService,
    private translate: TranslateService,
  ) { }

  public getAllUsers() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<UserEto[]>(`${UserManagementRestServicePaths.FIND_ALL_USERS()}`).subscribe(
        (users: UserEto[]) => {
          this.spinnerDataSource.next(false);
          this.usersDataSource.next(users);
          resolve(users);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'))
          reject();
        }))
    })
  }

  public getAllPermissions() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<PermissionEto[]>(`${UserManagementRestServicePaths.FIND_ALL_PERMISSONS_PATH()}`).subscribe(
        (permissions: PermissionEto[]) => {
          this.spinnerDataSource.next(false);
          this.permissionsDataSource.next(permissions);
          resolve(permissions);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'))
          reject();
        }))
    })
  }

  public getAllRoles() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<RoleEto[]>(`${UserManagementRestServicePaths.FIND_ALL_ROLES_PATH()}`).subscribe(
        (roles: RoleEto[]) => {
          this.spinnerDataSource.next(false);
          this.rolesDataSource.next(roles);
          resolve(roles);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'))
          reject();
        }))
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public createUser(userTo: UserTo) {
    return this.http.post(UserManagementRestServicePaths.USER_PATH(), userTo).pipe(
      map((userEto: UserEto) => userEto));
  }

  public modifyUser(userTo: UserTo, userId: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<UserEto>(`${UserManagementRestServicePaths.USER_PATH()}/${userId}`, userTo).subscribe(
        (user: UserEto) => {
          this.loggedUserDataSource.next(user);
          this.snackBar.open(this.translate.instant('users.modified'))
          this.spinnerDataSource.next(false);
          resolve(user);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'))
          this.spinnerDataSource.next(false);
        }))
    })
  }

  public modifyAccount(userTo: UserTo, userId: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<AccountEto>(`${UserManagementRestServicePaths.ACCOUNT_PATH_WITH_ID(userId)}`, userTo.accountTo).subscribe(
        (accountEto: AccountEto) => {
          this.loggedUserDataSource.value.accountEto = accountEto;
          this.snackBar.open(this.translate.instant('users.check-mailbox'))
          this.spinnerDataSource.next(false);
          resolve(accountEto);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public modifyUserInManagement(userTo: UserTo, userId: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<UserEto>(`${UserManagementRestServicePaths.USER_PATH()}/${userId}`, userTo).subscribe(
        (userEto: UserEto) => {
          let updated = this.usersDataSource.value.filter(user => user.id != userEto.id);
          updated.push(userEto);
          this.usersDataSource.next(updated);
          this.spinnerDataSource.next(false);
          resolve(userEto);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'))
          this.spinnerDataSource.next(false);
        }))
    })
  }

  
  public modifyAccountInManagement(userTo: UserTo, userId: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<AccountEto>(`${UserManagementRestServicePaths.ACCOUNT_PATH_WITH_ID(userId)}`, userTo.accountTo).subscribe(
        (accountEto: AccountEto) => {
          this.usersDataSource.value.forEach(user => {
            if(user.accountEto.id == accountEto.id){
              user.accountEto = accountEto;
            }
          })
          this.usersDataSource.next(this.usersDataSource.value);
          this.spinnerDataSource.next(false);
          resolve(accountEto);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public createUserInManagement(userTo: UserTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<UserEto>(`${UserManagementRestServicePaths.USER_PATH()}`, userTo).subscribe(
        (user: UserEto) => {
          if (this.usersDataSource.value) {
            const currentValue = this.usersDataSource.value;
            const updatedValue = [...currentValue, user];
            this.usersDataSource.next(updatedValue);
          } else {
            this.usersDataSource.next([user]);
          }
          this.spinnerDataSource.next(false);
          resolve(user);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteUser(id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${UserManagementRestServicePaths.USER_PATH_WITH_ID(id)}`).subscribe(
        () => {
          this.usersDataSource.next(this.usersDataSource.value.filter((user) => user.id != id));
          this.spinnerDataSource.next(false);
          resolve();
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public changePassword(accountTo: AccountTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<void>(`${UserManagementRestServicePaths.ACCOUNT_PATH()}`, accountTo).subscribe(
        () => {
          this.snackBar.open(this.translate.instant('users.check-mailbox'))
          this.spinnerDataSource.next(false);
          resolve();
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public getLoggedUser() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      let userId = this.localStorage.getUserId();
      this.subscription.add(this.http.get<UserEto>(`${UserManagementRestServicePaths.USER_PATH()}/${userId}`).subscribe(
        (user: UserEto) => {
          this.loggedUserDataSource.next(user);
          this.spinnerDataSource.next(false);
          resolve(user);
        },
        (e) => {
          this.spinnerDataSource.next(false);
          this.snackBar.open(this.translate.instant('server.error'))
          reject();
        }))
    })
  }

  public createRole(roleTo: RoleTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<RoleEto>(`${UserManagementRestServicePaths.ROLE_PATH()}`, roleTo).subscribe(
        (role: RoleEto) => {
          if (this.rolesDataSource.value) {
            const currentValue = this.rolesDataSource.value;
            const updatedValue = [...currentValue, role];
            this.rolesDataSource.next(updatedValue);
          } else {
            this.rolesDataSource.next([role]);
          }
          this.spinnerDataSource.next(false);
          resolve(role);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public modifyRole(roleTo: RoleTo, id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<RoleEto>(`${UserManagementRestServicePaths.ROLE_PATH_WTH_ID(id)}`, roleTo).subscribe(
        (roleEto: RoleEto) => {
          let updated = this.rolesDataSource.value.filter(role => role.id != roleEto.id);
          updated.push(roleEto);
          this.rolesDataSource.next(updated);
          this.spinnerDataSource.next(false);
          resolve(roleEto);
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteRole(id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${UserManagementRestServicePaths.ROLE_PATH_WTH_ID(id)}`).subscribe(
        () => {
          this.rolesDataSource.next(this.rolesDataSource.value.filter((role) => role.id != id));
          this.spinnerDataSource.next(false);
          resolve();
        },
        (e) => {
          this.snackBar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

}
