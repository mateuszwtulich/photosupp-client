import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { PriceIndicatorTo } from 'src/app/core/to/PriceIndicatorTo';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { ServiceService } from 'src/app/servicehandling/services/service.service';

@Component({
  selector: 'cf-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit {
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public services: ServiceEto[];
  private servicesStored: ServiceEto[];
  public isSpinnerDisplayed = false;
  public priceIndicators: PriceIndicatorTo[];
  public selectedService: ServiceEto;
  public subscription: Subscription = new Subscription();

  @ViewChild('stepper') stepper;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    private serviceService: ServiceService) {
  }

  ngOnInit() {
    this.priceIndicators = [];

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.onSpinnerDisplayed();
    this.onLangChange();
    this.getServices();
  }

  private onSpinnerDisplayed(){
    this.subscription.add(this.serviceService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  private onLangChange() {
    this.subscription.add(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.priceIndicators = [];
      this.filterServices(event.lang);
      this.stepper.reset();
    }));
  }

  private getServices() {
    this.serviceService.getAllServices().then((services: ServiceEto[]) => {
      this.servicesStored = services;
      this.filterServices(this.translate.currentLang);
    })
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

  setService(service: ServiceEto) {
    this.refreshIndicators(service);
    this.firstFormGroup.controls['firstCtrl'].setValue(service);
  }

  private refreshIndicators(service: ServiceEto) {
    this.priceIndicators = [];

    service.indicatorEtoList.forEach(indicator => this.priceIndicators.push({
      indicatorId: indicator.id,
      bookingId: null,
      price: indicator.doublePrice,
      amount: indicator.baseAmount,
    }));
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
    this.priceIndicators.forEach(priceIndicator => sum += priceIndicator.price);
    return sum;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
