import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ApplicationPermission } from 'src/app/shared/utils/ApplicationPermission';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuardService implements CanActivate {

  constructor(
    private permissionService: NgxPermissionsService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let hasPermission = true;
    switch (route.routeConfig.path) {
      case 'manager/user/overview': {
        this.permissionService.hasPermission([
          ApplicationPermission.A_CRUD_SUPER,
          ApplicationPermission.A_CRUD_USERS,
          ApplicationPermission.A_CRUD_ROLES
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
      case 'manager/services': {
        this.permissionService.hasPermission([
          ApplicationPermission.A_CRUD_SUPER,
          ApplicationPermission.A_CRUD_SERVICES,
          ApplicationPermission.A_CRUD_INDICATORS
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
      case 'manager/user/details': {
        this.permissionService.hasPermission([
          ApplicationPermission.AUTH_USER, ApplicationPermission.A_CRUD_SUPER
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
      case 'client/user/details': {
        this.permissionService.hasPermission([
          ApplicationPermission.AUTH_USER
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
      case 'manager/scheduler': {
        this.permissionService.hasPermission([
          ApplicationPermission.A_CRUD_SUPER,
          ApplicationPermission.A_CRUD_ORDERS,
          ApplicationPermission.A_CRUD_BOOKINGS,
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
      case 'client/scheduler': {
        this.permissionService.hasPermission([
          ApplicationPermission.AUTH_USER
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
      case 'manager':
      case 'manager/orders':
      case 'manager/orders/details/:orderNumber':
      case 'manager/orders/booking/details/:id': {
        this.permissionService.hasPermission([
          ApplicationPermission.A_CRUD_SUPER,
          ApplicationPermission.A_CRUD_ORDERS,
          ApplicationPermission.A_CRUD_BOOKINGS
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
      case 'client':
      case 'client/orders':
      case 'client/orders/details/:orderNumber':
      case 'client/orders/booking/details/:id': {
        this.permissionService.hasPermission([
          ApplicationPermission.AUTH_USER
        ]).then((perm) => {
          hasPermission = this.hasPermission(perm);
        });
        break;
      }
    }
    return hasPermission;
  }

  private hasPermission(hasPermission: boolean): boolean {
    if (!hasPermission) {
      this.router.navigateByUrl('home');
    }
    return hasPermission;
  }

}