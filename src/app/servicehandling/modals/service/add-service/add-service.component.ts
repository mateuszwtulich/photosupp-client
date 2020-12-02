import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ServiceService } from 'src/app/servicehandling/services/service.service';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { ServiceTo } from 'src/app/servicehandling/to/ServiceTo';

@Component({
  selector: 'cf-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  public nameControl = new FormControl("", Validators.required);
  public descriptionControl = new FormControl("", Validators.required);
  public nameSecondControl = new FormControl("", Validators.required);
  public descriptionSecondControl = new FormControl("", Validators.required);
  public indicatorsControl = new FormControl("");
  public indicators: IndicatorEto[];
  public basePriceControl = new FormControl("", Validators.required);
  public isSpinnerDisplayed = false;
  public locale: string;
  public secondLocale: string;
  public localeEn = "en";
  public localePl = "pl";
  public isLocaleEnabled: boolean;
  public subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<AddServiceComponent>,
    private serviceService: ServiceService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadsAllIndicators();
    this.onSpinnerDisplayed();
    this.locale = this.translateService.currentLang;

    if (this.locale == this.localePl) {
      this.secondLocale = this.localeEn;
    } else {
      this.secondLocale = this.localePl;
    }
  }

  private loadsAllIndicators() {
    this.serviceService.getAllIndicators();

    this.subscription.add(this.serviceService.indciatorsData.subscribe(
      (indicators) => {
        this.indicators = indicators;
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.serviceService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  public changeLocaleCondition() {
    this.isLocaleEnabled = !this.isLocaleEnabled;
  }

  addService() {
    if (this.nameControl.valid && this.descriptionControl.valid && this.basePriceControl.valid) {
      let indicatorsIds = [];
      
      if(this.indicatorsControl.value.length > 0){
        indicatorsIds = this.indicatorsControl.value.map(indicator => indicator.id);
      } 

      let serviceTo: ServiceTo = {
        name: this.nameControl.value,
        description: this.descriptionControl.value,
        basePrice: this.basePriceControl.value,
        indicatorsIds: indicatorsIds,
        locale: this.locale
      };

      this.serviceService.createService(serviceTo).then(() => {

        if (this.isLocaleEnabled) {
          let serviceSecondTo: ServiceTo = {
            name: this.nameSecondControl.value,
            description: this.descriptionSecondControl.value,
            basePrice: this.basePriceControl.value,
            indicatorsIds: indicatorsIds,
            locale: this.secondLocale
          };

          this.serviceService.createService(serviceSecondTo).then(() => {
            this.dialogRef.close();
          })
        } else {
          this.dialogRef.close();
        }
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
