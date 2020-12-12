import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ServiceHandlingRestServicePaths } from '../rest-service-paths/ServiceHandlingRestServicePaths';
import { ServiceEto } from '../to/ServiceEto';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { IndicatorEto } from '../to/IndicatorEto';
import { IndicatorTo } from '../to/IndicatorTo';
import { ServiceTo } from '../to/ServiceTo';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private subscription: Subscription = new Subscription();
  private servicesDataSource: BehaviorSubject<ServiceEto[]> = new BehaviorSubject([]);
  public servicesData = this.servicesDataSource.asObservable();
  private indicatorsDataSource: BehaviorSubject<IndicatorEto[]> = new BehaviorSubject([]);
  public indciatorsData = this.indicatorsDataSource.asObservable();
  private spinnerDataSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public spinnerData = this.spinnerDataSource.asObservable();

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private translate: TranslateService
    ) { }

  public getAllServices() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
    this.subscription.add(this.http.get<ServiceEto[]>(`${ServiceHandlingRestServicePaths.FIND_ALL_SERVICES()}`).subscribe(
      (services: ServiceEto[]) => {
        this.spinnerDataSource.next(false);
        this.servicesDataSource.next(services);
        resolve(services);
      },
      (e) => {
        this.snackbar.open(this.translate.instant('server.error'))
        reject();
      }))
    })
  }

  public getAllIndicators() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
    this.subscription.add(this.http.get<IndicatorEto[]>(`${ServiceHandlingRestServicePaths.FIND_ALL_INDICATORS()}`).subscribe(
      (indicators: IndicatorEto[]) => {
        this.spinnerDataSource.next(false);
        this.indicatorsDataSource.next(indicators);
        resolve(indicators);
      },
      (e) => {
        this.snackbar.open(this.translate.instant('server.error'))
        reject();
      }))
    })
  }

  public createIndicator(indicatorTo: IndicatorTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<IndicatorEto>(`${ServiceHandlingRestServicePaths.INDICATOR_PATH()}`, indicatorTo).subscribe(
        (indicator: IndicatorEto) => {
          if (this.indicatorsDataSource.value) {
            const currentValue = this.indicatorsDataSource.value;
            const updatedValue = [...currentValue, indicator];
            this.indicatorsDataSource.next(updatedValue);
          } else {
            this.indicatorsDataSource.next([indicator]);
          }
          this.spinnerDataSource.next(false);
          resolve(indicator);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public modifyIndicator(indicatorTo: IndicatorTo, id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<IndicatorEto>(`${ServiceHandlingRestServicePaths.INFICATOR_PATH_WITH_ID(id)}`, indicatorTo).subscribe(
        (indicatorEto: IndicatorEto) => {
          let updated = this.indicatorsDataSource.value.filter(indicator => indicator.id != indicatorEto.id);
          updated.push(indicatorEto);
          this.indicatorsDataSource.next(updated);
          this.spinnerDataSource.next(false);
          resolve(indicatorEto);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteIndicator(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${ServiceHandlingRestServicePaths.INFICATOR_PATH_WITH_ID(id)}`).subscribe(
        () => {
          this.indicatorsDataSource.next(this.indicatorsDataSource.value.filter((indicator) => indicator.id != id));
          this.spinnerDataSource.next(false);
          resolve();
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public createService(serviceTo: ServiceTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<ServiceEto>(`${ServiceHandlingRestServicePaths.SERVICE_PATH()}`, serviceTo).subscribe(
        (service: ServiceEto) => {
          if (this.servicesDataSource.value) {
            const currentValue = this.servicesDataSource.value;
            const updatedValue = [...currentValue, service];
            this.servicesDataSource.next(updatedValue);
          } else {
            this.servicesDataSource.next([service]);
          }
          this.spinnerDataSource.next(false);
          resolve(service);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public modifyService(serviceTo: ServiceTo, id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<ServiceEto>(`${ServiceHandlingRestServicePaths.SERVICE_PATH_WITH_ID(id)}`, serviceTo).subscribe(
        (serviceEto: ServiceEto) => {
          let updated = this.servicesDataSource.value.filter(service => service.id != serviceEto.id);
          updated.push(serviceEto);
          this.servicesDataSource.next(updated);
          this.spinnerDataSource.next(false);
          resolve(serviceEto);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteService(id: number) {
    return new Promise<void>((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${ServiceHandlingRestServicePaths.SERVICE_PATH_WITH_ID(id)}`).subscribe(
        () => {
          this.servicesDataSource.next(this.servicesDataSource.value.filter((service) => service.id != id));
          this.spinnerDataSource.next(false);
          resolve();
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
