import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject, Observable } from 'rxjs';
import { Credentials } from '../to/Authorization';
import jwtDecode, * as jwt_decode from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';
import { CoreRestServicePaths } from 'src/app/core/rest-service-paths/CoreRestServicePaths';
import { BackendApiServicePath } from 'src/app/pricing/rest-service-paths/BackendApiServicePath';
import { LocalStorageService } from 'src/app/shared/cache/localStorage.service';

@Injectable({
    providedIn: 'root'
  })
  export class AuthenticationService {
    private spinnerDataSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public spinnerData = this.spinnerDataSource.asObservable();

    constructor(
        public router: Router,
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private snackbar: MatSnackBar,
        private permissionsService: NgxPermissionsService,
        private translate: TranslateService) {
  
    }
  
    public isAuthenticated(): boolean {
      let authenticated = false;
      if (this.localStorageService.isStorageInitialized()) {
        if (this.localStorageService.getUsername() && this.localStorageService.getTokenExp() <= new Date().getTime()) {
          authenticated = true;
        }
      }
      return authenticated;
    }
  
    public authenticate(credentials: Credentials): Promise<any> {
      return new Promise((resolve, reject) => {
        this.spinnerDataSource.next(true);
        this.login(credentials).subscribe((data: Response) => {
          const token: string = data.headers.get('Authorization');
          const decodedToken: object = jwtDecode(token);
          this.localStorageService.setToken(token);
          this.localStorageService.setAuthInfo(this.localStorageService.parseHeaderToAuthInfo(decodedToken));
          this.localStorageService.setBasicAuthority();
          this.localStorageService.setIsRequestToServer(false);
          this.permissionsService.addPermission(this.localStorageService.getAuthorities());
          this.spinnerDataSource.next(false);
          resolve();
        },
          (error) => {
            if (error.status == 403) {
              this.snackbar.open(this.translate.instant('login.error'));
              this.spinnerDataSource.next(false);
            }
            if(error.status != 403)
              this.snackbar.open(this.translate.instant('server.error'));
              this.spinnerDataSource.next(false);

              reject(error);
          });
      });
    }
  
    public login(credentials: Credentials): Observable<any> {
      return this.http.post(CoreRestServicePaths.AUTHENTICATE(),
        { username: credentials.username, password: credentials.password }, { observe: 'response' });
    }
  
    public logout(): void {
      if (this.isAuthenticated) {
        this.localStorageService.clearLocalStorage();
        this.permissionsService.flushPermissions();
        this.router.navigate(['home']);
      }
    }
  }
  