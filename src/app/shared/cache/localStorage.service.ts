import { Injectable } from '@angular/core';
import { AuthInfo } from 'src/app/authentication/to/Authorization';
import { ApplicationPermission } from 'src/app/shared/utils/ApplicationPermission';

@Injectable({
    providedIn: 'root'
  })
  export class LocalStorageService {
  
    public getAuthInfo(): AuthInfo {
      return JSON.parse(localStorage.getItem('authInfo'));
    }
  
    public setAuthInfo(authInfo: string): void {
      localStorage.setItem('authInfo', authInfo);
    }
  
    public setToken(authToken: string): void {
      authToken = authToken.replace('Bearer ', '');
      localStorage.setItem('authToken', authToken);
    }
  
    public getUsername(): string {
      return JSON.parse(localStorage.getItem('authInfo')).username;
    }
  
    public getUserId(): number {
      return Number(JSON.parse(localStorage.getItem('authInfo')).userId);
    }
  
    public getTokenExp(): number {
      return JSON.parse(localStorage.getItem('authInfo')).tokenExp;
    }
  
    public setBasicAuthority() {
      const applicationPermission: ApplicationPermission[] = [];
  
      this.getAuthInfo().authorities.forEach(permission => applicationPermission.push(ApplicationPermission[permission.authority]))
      localStorage.setItem('authorities', JSON.stringify(applicationPermission));
    }
  
    public getAuthorities(): ApplicationPermission[] {
      return JSON.parse(localStorage.getItem('authorities'));
    }
  
    public getToken(): string {
      return localStorage.getItem('authToken');
    }
  
    public clearLocalStorage(): void {
      localStorage.clear();
    }
  
    public isStorageInitialized(): boolean {
      if (localStorage.getItem('authInfo') === undefined || localStorage.getItem('authInfo') === null) {
        return false;
      }
      return true;
    }

    public setIsRequestToServer(condition: boolean){
      localStorage.setItem('RequestToServer', JSON.stringify(condition));
    }

    public getIsRequestToServer(): boolean {
      return JSON.parse(localStorage.getItem('RequestToServer'));
    }
  
    public parseHeaderToAuthInfo(token: any): string {
      const authInfo: AuthInfo = {
        username: token.sub,
        authorities: token.authorities,
        userId: Number(token.userId),
        tokenExp: token.exp
      };
  
      return JSON.stringify(authInfo);
    }
  }
  