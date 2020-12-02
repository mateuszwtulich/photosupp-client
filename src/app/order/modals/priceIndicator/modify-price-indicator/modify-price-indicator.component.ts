import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PriceIndicatorEto } from 'src/app/core/to/PriceIndicatorEto';
import { PriceIndicatorTo } from 'src/app/core/to/PriceIndicatorTo';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';

@Component({
  selector: 'cf-modify-price-indicator',
  templateUrl: './modify-price-indicator.component.html',
  styleUrls: ['./modify-price-indicator.component.scss']
})
export class ModifyPriceIndicatorComponent implements OnInit {
  public isSpinnerDisplayed = false;
  public priceIndicators: PriceIndicatorEto[] = [];
  private priceIndicatorToList: PriceIndicatorTo[];

  constructor(
    public dialogRef: MatDialogRef<ModifyPriceIndicatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PriceIndicatorEto[]) {
  }

  ngOnInit() {
    this.data.forEach(priceIndicator => {
      let pI = {
      price: priceIndicator.price,
        amount: priceIndicator.amount,
        indicatorEto: priceIndicator.indicatorEto,
        bookingId: priceIndicator.bookingId
      }
      this.priceIndicators.push(pI);
    });
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

  calculateTheExtraCost(): number {
    let sum = 0;
    this.priceIndicators.forEach(priceIndicator => sum += priceIndicator.price);
    return sum;
  }

  modifyPriceIndicators() {
    this.priceIndicatorToList = this.priceIndicators.map(priceIndicator => {
      return {
        indicatorId: priceIndicator.indicatorEto.id,
        bookingId: priceIndicator.bookingId,
        price: priceIndicator.price,
        amount: priceIndicator.amount
      }
    });
    
    this.dialogRef.close(this.priceIndicatorToList);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
