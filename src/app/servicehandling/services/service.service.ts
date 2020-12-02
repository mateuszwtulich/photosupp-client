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

//   fuelIndicatorPL = {
//     id: 3,
//     name: "Odległość od Częstochowy",
//     description: "Proszę podać liczbę kilometrów Państwa lokalizacji od Częstochowy",
//     locale: "pl",
//     baseAmount: 20,
//     doublePrice: 20
//   }

//   fuelIndicatorEN = {
//     id: 4,
//     name: "Distance from Czestochowa",
//     description: "Kindly provide number of kilometers to your localization from Czestochowa",
//     locale: "en",
//     baseAmount: 20,
//     doublePrice: 20
//   }

//   fotoIndicators: IndicatorEto[] = [{
//     id: 1,
//     name: "Szacowna liczba zdjęć",
//     description: "Dla foto takiej proponujemy taką liczbę itp",
//     locale: "pl",
//     baseAmount: 50,
//     doublePrice: 200
//   },
// {
//   id: 2,
//   name: "Predicted number of photos",
//   description: "For this kind of service we propose the number",
//   locale: "en",
//   baseAmount: 50,
//   doublePrice: 200
// },
//   this.fuelIndicatorPL,
//   this.fuelIndicatorEN
//   ]

//   filmIndicators: IndicatorEto[] = [{
//     id: 5,
//     name: "Szacowna liczba filmów",
//     description: "Dla filmu takiego proponujemy taką liczbę filmów",
//     locale: "pl",
//     baseAmount: 1,
//     doublePrice: 150
//   },
// {
//   id: 6,
//   name: "Predicted number of clips",
//   description: "For this kind of service we propose the number",
//   locale: "en",
//   baseAmount: 1,
//   doublePrice: 150
// },
// {
//   id: 7,
//   name: "Szacowna liczba minut dla filmu",
//   description: "Dla filmu takiego typu proponujemy taką liczbę minut",
//   locale: "pl",
//   baseAmount: 2,
//   doublePrice: 40
// },
// {
//   id: 8,
// name: "Predicted number of minutes for each clip",
// description: "For this kind of service we propose the number",
// locale: "en",
// baseAmount: 2,
// doublePrice: 40
// },
//   this.fuelIndicatorPL,
//   this.fuelIndicatorEN
//   ]
  
//   services: ServiceEto[] = [];
//   servicesStored: ServiceEto[] = [{
//     id: 1,
//     name: "foto",
//     description: "opis",
//     locale: "pl",
//     basePrice: 300,
//     indicators: this.fotoIndicators
//   },
// {
//   id: 2,
//   name: "Photo",
//   description: "Description",
//   locale: "en",
//   basePrice: 300,
//   indicators: this.fotoIndicators
// },
// {
//   id: 3,
//   name: "film",
//   description: "opis filmu",
//   locale: "pl",
//   basePrice: 600,
//   indicators: this.filmIndicators
// },
// {
//   id: 4,
// name: "Film",
// description: "Description",
// locale: "en",
// basePrice: 600,
// indicators: this.filmIndicators
// }];

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
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
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
