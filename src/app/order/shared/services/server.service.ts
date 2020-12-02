import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/shared/cache/localStorage.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image';
  private readonly clientId = '5b4843a31687786';
  private spinnerDataSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public spinnerData = this.spinnerDataSource.asObservable();
  
    httpOptions = {
      headers: new HttpHeaders().set('Authorization', 'Client-ID ' + this.clientId)};
  
    constructor(
      private http: HttpClient,
      private localStorage: LocalStorageService
      ) { 
    }
  
    public addImage(imageFile: File): Observable<string> {
      this.spinnerDataSource.next(true);
      this.localStorage.setIsRequestToServer(true);
      let formData = new FormData();
      formData.append('image', imageFile, imageFile.name);
      return this.http.post<string>(this.IMGUR_UPLOAD_URL, formData, {headers: this.httpOptions.headers}).pipe(
        map((data) => {
          this.localStorage.setIsRequestToServer(false);
          this.spinnerDataSource.next(false);
          return data["data"].link; }));
    }
}