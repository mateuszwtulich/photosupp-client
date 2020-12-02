import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardSerice implements CanActivate {
    constructor(public authServie: AuthenticationService, public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const authenticated = this.authServie.isAuthenticated();
        if (!authenticated) {
            this.router.navigate(['login']);
            return authenticated;
        }
        return authenticated;
    }

}