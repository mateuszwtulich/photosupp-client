import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SchedulerService } from 'src/app/calendar/services/scheduler.service';
import { Combined } from 'src/app/core/to/Combined';
import { PriceIndicatorEto } from 'src/app/core/to/PriceIndicatorEto';
import { PriceIndicatorTo } from 'src/app/core/to/PriceIndicatorTo';
import { BookingService } from 'src/app/order/shared/services/booking.service';
import { BookingEto } from 'src/app/order/shared/to/BookingEto';
import { BookingTo } from 'src/app/order/shared/to/BookingTo';
import { ServiceService } from 'src/app/servicehandling/services/service.service';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { LocalStorageService } from 'src/app/shared/cache/localStorage.service';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { AccountEto } from 'src/app/usermanagement/shared/to/AccountEto';
import { RoleEto } from 'src/app/usermanagement/shared/to/RoleEto';
import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';

@Component({
  selector: 'cf-bookings-planning',
  templateUrl: './bookings-planning.component.html',
  styleUrls: ['./bookings-planning.component.scss']
})
export class BookingsPlanningComponent implements OnInit {
  public dateFormGroup: FormGroup;
  public firstFormGroup: FormGroup;
  public addressFormGroup: FormGroup;
  public booking: BookingEto;

  // fuelIndicatorPL = {
  //   id: 3,
  //   name: "Odległość od Częstochowy",
  //   description: "Proszę podać liczbę kilometrów Państwa lokalizacji od Częstochowy",
  //   locale: "pl",
  //   baseAmount: 20,
  //   doublePrice: 20
  // }

  // fuelIndicatorEN = {
  //   id: 4,
  //   name: "Distance from Czestochowa",
  //   description: "Kindly provide number of kilometers to your localization from Czestochowa",
  //   locale: "en",
  //   baseAmount: 20,
  //   doublePrice: 20
  // }

  // fotoIndicators: IndicatorEto[] = [{
  //   id: 1,
  //   name: "Szacowna liczba zdjęć",
  //   description: "Dla foto takiej proponujemy taką liczbę itp",
  //   locale: "pl",
  //   baseAmount: 50,
  //   doublePrice: 200
  // },
  // {
  //   id: 2,
  //   name: "Predicted number of photos",
  //   description: "For this kind of service we propose the number",
  //   locale: "en",
  //   baseAmount: 50,
  //   doublePrice: 200
  // },
  // this.fuelIndicatorPL,
  // this.fuelIndicatorEN
  // ]

  // filmIndicators: IndicatorEto[] = [{
  //   id: 5,
  //   name: "Szacowna liczba filmów",
  //   description: "Dla filmu takiego proponujemy taką liczbę filmów",
  //   locale: "pl",
  //   baseAmount: 1,
  //   doublePrice: 150
  // },
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
  //   name: "Predicted number of minutes for each clip",
  //   description: "For this kind of service we propose the number",
  //   locale: "en",
  //   baseAmount: 2,
  //   doublePrice: 40
  // },
  // this.fuelIndicatorPL,
  // this.fuelIndicatorEN
  // ]

  // services: ServiceEto[] = [];
  // servicesStored: ServiceEto[] = [{
  //   id: 1,
  //   name: "foto",
  //   description: "opis",
  //   locale: "pl",
  //   basePrice: 300,
  //   indicatorEtoList: this.fotoIndicators
  // },
  // {
  //   id: 2,
  //   name: "Photo",
  //   description: "Description",
  //   locale: "en",
  //   basePrice: 300,
  //   indicatorEtoList: this.fotoIndicators
  // },
  // {
  //   id: 3,
  //   name: "film",
  //   description: "opis filmu",
  //   locale: "pl",
  //   basePrice: 600,
  //   indicatorEtoList: this.filmIndicators
  // },
  // {
  //   id: 4,
  //   name: "Film",
  //   description: "Description",
  //   locale: "en",
  //   basePrice: 600,
  //   indicatorEtoList: this.filmIndicators
  // }];

  public bookingControl: FormControl;
  public priceIndicators: PriceIndicatorEto[];
  public selectedService: ServiceEto;
  public services: ServiceEto[];
  public servicesStored: ServiceEto[];
  public isSpinnerDisplayed = false;
  private subscription: Subscription = new Subscription();
  private user: UserEto;
  @ViewChild('stepper') stepper;

  @ViewChild(MatAccordion) accordion: MatAccordion;


  constructor(
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    private schedulerService: SchedulerService,
    private elementRef: ElementRef,
    private serviceService: ServiceService,
    private userService: UsersService,
    private bookingService: BookingService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.priceIndicators = [];

    this.createsForms();
    this.onLangChange();
    this.onDateChange();
    this.getAllServices();
    this.onSpinnerDisplayed();

    this.userService.getLoggedUser().then((user: UserEto) => {
      this.user = user;
    });
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.serviceService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  private getAllServices() {
    this.serviceService.getAllServices();
    this.subscription.add(this.serviceService.servicesData.subscribe((services: ServiceEto[]) => {
      this.servicesStored = services;
      this.filterServices(this.translate.currentLang);
    }))
  }

  private onLangChange() {
    this.subscription.add(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.filterServices(event.lang);
    }));
  }

  private onDateChange() {
    this.subscription.add(this.schedulerService.datesData.subscribe((booking: BookingEto) => {
      this.dateFormGroup.controls['dateCtrl'].setValue(booking);
    }));
  }

  private createsForms() {
    this.dateFormGroup = this._formBuilder.group({
      dateCtrl: ['', Validators.required]
    });
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.addressFormGroup = this._formBuilder.group({
      cityCtrl: ['', Validators.required],
      streetCtrl: ['', Validators.required],
      buildingNumberCtrl: ['', Validators.required],
      apartmentNumberCtrl: [''],
      postalCodeCtrl: ['', Validators.required],
      nameCtrl: ['', Validators.required],
      descriptionCtrl: ['']
    });
    this.bookingControl = new FormControl('', Validators.required);
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelectorAll('mat-step-header').forEach(item => {
      item.addEventListener('click', event => {
        if (event.currentTarget.ariaPosInSet - 1 == 4 && this.addressFormGroup.valid) {
          this.goToLastStep();
        }
      });
    });
  }

  filterServices(lang: string) {
    this.services = [];
    this.servicesStored.forEach(service => {
      if (service.locale == lang) {
        service.indicatorEtoList = service.indicatorEtoList.filter(indicator => indicator.locale == lang);
        this.services.push(service);
      }
    })
  }

  changeService(currentService: ServiceEto) {
    this.firstFormGroup.controls['firstCtrl'].setValue(
      this.services.find(service => currentService.basePrice == service.basePrice && currentService.locale != service.locale));
  }

  refreshIndicators(service: ServiceEto) {
    this.priceIndicators = [];

    service.indicatorEtoList.forEach(indicator => this.priceIndicators.push({
      indicatorEto: indicator,
      bookingId: null,
      price: 0,
      amount: indicator.baseAmount,
    }));
  }

  setService(service: ServiceEto) {
    this.refreshIndicators(service);
    this.firstFormGroup.controls['firstCtrl'].setValue(service);
  }


  formatLabel(value: number) {
    if (value >= 10) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  calculateTheIndicatorCost(i: number, indicator: IndicatorEto): string {
    this.priceIndicators[i].price = ((this.priceIndicators[i].amount / indicator.baseAmount - 1) * indicator.doublePrice)
    return this.priceIndicators[i].price.toFixed();
  }

  calculateThePredictedCost(): number {
    let sum = this.firstFormGroup.controls['firstCtrl'].value.basePrice;
    let startDate = new Date(this.bookingControl.value.start);
    let endDate = new Date(this.bookingControl.value.end);

    sum = sum * (endDate.getDay() - startDate.getDay() + 1);
    this.priceIndicators.forEach(priceIndicator => sum += priceIndicator.price);
    return sum;
  }

  goToLastStep() {
    this.booking = {
      id: null,
      name: this.addressFormGroup.controls['nameCtrl'].value,
      description: this.addressFormGroup.controls['descriptionCtrl'].value,
      addressEto: {
        id: 1,
        city: this.addressFormGroup.controls['cityCtrl'].value,
        street: this.addressFormGroup.controls['streetCtrl'].value,
        buildingNumber: this.addressFormGroup.controls['buildingNumberCtrl'].value,
        apartmentNumber: this.addressFormGroup.controls['apartmentNumberCtrl'].value,
        postalCode: this.addressFormGroup.controls['postalCodeCtrl'].value
      },
      serviceEto: this.firstFormGroup.controls['firstCtrl'].value,
      userEto: this.user,
      confirmed: false,
      predictedPrice: this.calculateThePredictedCost(),
      start: this.dateFormGroup.controls['dateCtrl'].value.start,
      end: this.dateFormGroup.controls['dateCtrl'].value.end,
      modificationDate: null,
      priceIndicatorEtoList: this.priceIndicators
    }

    this.bookingControl.setValue(this.booking);
  }

  ngOnDestroy() {
    this.schedulerService.datesDataSource.next(null);
    this.subscription.unsubscribe();
  }

  public createBooking() {
    if (this.bookingControl.valid) {
      let priceIndicatorToList = this.priceIndicators.map(priceIndicator => {
        return {
          indicatorId: priceIndicator.indicatorEto.id,
          bookingId: null,
          price: priceIndicator.price,
          amount: priceIndicator.amount
        }
      })

      let bookingTo: BookingTo = {
        name: this.bookingControl.value.name,
        description: this.bookingControl.value.description,
        addressTo: {
          city: this.bookingControl.value.addressEto.city,
          street: this.bookingControl.value.addressEto.street,
          buildingNumber: this.bookingControl.value.addressEto.buildingNumber,
          apartmentNumber: this.bookingControl.value.addressEto.apartmentNumber,
          postalCode: this.bookingControl.value.addressEto.postalCode
        },
        serviceId: this.bookingControl.value.serviceEto.id,
        userId: this.bookingControl.value.userEto.id,
        start: this.bookingControl.value.start,
        end: this.bookingControl.value.end,
        priceIndicatorToList: priceIndicatorToList
      }

      this.bookingService.createUserBooking(bookingTo).then((bookingEto: BookingEto) => {
        if (!!bookingEto) {
          this.router.navigateByUrl("/client/orders/booking/details/" + bookingEto.id.toFixed());
        }
      });
    }
  }
}
