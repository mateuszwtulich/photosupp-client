import { IndicatorEto } from './IndicatorEto';

export class ServiceEto {
    id: number;
    name: string;
    description: string;
    locale: string;
    basePrice: number;
    indicatorEtoList: IndicatorEto[];

    constructor(theName: string, theDescription: string, theLocale: string, theBasePrice: number, theIndicators: IndicatorEto[]){
        this.name = theName;
        this.description = theDescription;
        this.locale = theLocale;
        this.basePrice = theBasePrice;
        this.indicatorEtoList = theIndicators;
    }
}