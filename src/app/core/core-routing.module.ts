import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardSerice } from '../authentication/guards/authGuard.service';
import { PermissionsGuardService } from '../authentication/guards/permissionGuard.service';
import { SchedulerComponent } from '../calendar/scheduler/scheduler.component';
import { BookingDetailsComponent } from '../order/booking-details/booking-details.component';
import { OrderDetailsComponent } from '../order/order-details/order-details.component';
import { OrdersOverviewComponent } from '../order/orders-overview/orders-overview.component';
import { BookingsPlanningComponent } from '../pricing/bookings-planning/bookings-planning.component';
import { CalculateComponent } from '../pricing/calculate/calculate.component';
import { ServicesOverviewComponent } from '../servicehandling/services-overview/services-overview.component';
import { RolesOverviewComponent } from '../usermanagement/roles-overview/roles-overview.component';
import { UserDetailsComponent } from '../usermanagement/user-details/user-details.component';
import { UsersOverviewComponent } from '../usermanagement/users-overview/users-overview.component';
import { ClientPanelComponent } from './client-panel/client-panel.component';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManagerPanelComponent } from './manager-panel/manager-panel.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'manager', component: ManagerPanelComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'client', component: ClientPanelComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'home/login', component: LoginComponent },
    { path: 'client/order/planning', component: BookingsPlanningComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'client/scheduler', component: SchedulerComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/scheduler', component: SchedulerComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/orders', component: OrdersOverviewComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'client/orders', component: OrdersOverviewComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'client/orders/details/:orderNumber', component: OrderDetailsComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/orders/details/:orderNumber', component: OrderDetailsComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'client/orders/booking/details/:id', component: BookingDetailsComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/orders/booking/details/:id', component: BookingDetailsComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/services', component: ServicesOverviewComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'client/user/details', component: UserDetailsComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/user/details', component: UserDetailsComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/user/overview', component: UsersOverviewComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'manager/role/overview', component: RolesOverviewComponent, canActivate: [AuthGuardSerice, PermissionsGuardService] },
    { path: 'home/calculate', component: CalculateComponent },
    { path: 'home/login/forgotten-password', component: ForgottenPasswordComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule { }
