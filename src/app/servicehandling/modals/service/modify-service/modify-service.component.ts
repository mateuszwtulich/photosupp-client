import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ServiceService } from 'src/app/servicehandling/services/service.service';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { ServiceTo } from 'src/app/servicehandling/to/ServiceTo';
import { AddServiceComponent } from '../add-service/add-service.component';

@Component({
  selector: 'cf-modify-service',
  templateUrl: './modify-service.component.html',
  styleUrls: ['./modify-service.component.scss']
})
export class ModifyServiceComponent implements OnInit {
  public nameControl: FormControl;
  public descriptionControl: FormControl;
  public indicatorsControl: FormControl;
  public indicators: IndicatorEto[];
  public selectedIndicators: IndicatorEto[];
  public basePriceControl: FormControl;
  public isSpinnerDisplayed = false;
  public subscription = new Subscription();
  public isReady = false;

  constructor(
    public dialogRef: MatDialogRef<AddServiceComponent>,
    private serviceService: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data: ServiceEto
  ) { }

  ngOnInit(): void {
    this.descriptionControl = new FormControl(this.data.description, Validators.required);
    this.basePriceControl = new FormControl(this.data.basePrice, Validators.required);
    this.indicatorsControl = new FormControl(this.data.indicatorEtoList);
    this.selectedIndicators = this.data.indicatorEtoList;
    this.nameControl = new FormControl(this.data.name, Validators.required);

    this.loadsAllIndicators();
    this.onSpinnerDisplayed();
  }

  private loadsAllIndicators() {
    this.serviceService.getAllIndicators();

    this.subscription.add(this.serviceService.indciatorsData.subscribe(
      (indicators) => {
        this.indicators = indicators;
        this.isReady = true;
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.serviceService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  modifyService() {
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
        locale: this.data.locale
      };

      this.serviceService.modifyService(serviceTo, this.data.id).then(() => {
          this.dialogRef.close();
      })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  compareFn(c1,c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
