import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../shared/cache/localStorage.service';
import { ApplicationPermission } from '../shared/utils/ApplicationPermission';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor( private localStorageService: LocalStorageService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let jsonRequest: HttpRequest<any> = null;
        if (!this.localStorageService.getIsRequestToServer()) {

            if (this.localStorageService.isStorageInitialized()) {
                const scopeInfo: ScopePermissionInfo = {
                    userId: this.localStorageService.getAuthInfo().userId,
                    isAdmin: this.localStorageService.getAuthorities().includes(ApplicationPermission.A_CRUD_SUPER) ? true : false
                };

                jsonRequest = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${this.localStorageService.getToken()}`,
                        Scope: JSON.stringify(scopeInfo)
                    }
                }
                );
            } else {
                jsonRequest = request.clone({
                    setHeaders: {
                        Authorization: `Bearer `
                    }
                }
                );
            }
        } else {
            jsonRequest = request.clone({
                setHeaders: {
                    Authorization: `Client-ID 5b4843a31687786`
                }
            });
        }
        return next.handle(jsonRequest);
    }
}

export interface ScopePermissionInfo {
    userId: number;
    isAdmin: boolean;
}
