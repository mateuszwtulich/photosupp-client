import { NumberValueAccessor } from '@angular/forms';
import { PriceIndicatorTo } from './PriceIndicatorTo';

export class CalculateTo {
    serviceId: number;
    start: string;
    end: string;
    priceIndicators: PriceIndicatorTo[];

    constructor(theServiceId: number, theStart: string, theEnd: string, thePriceIndicators: PriceIndicatorTo[]){
        this.serviceId = theServiceId;
        this.start = theStart;
        this.end = theEnd;
        this.priceIndicators = thePriceIndicators;
    }
}