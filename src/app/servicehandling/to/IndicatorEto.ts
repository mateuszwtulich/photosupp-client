export class IndicatorEto {
    id: number;
    name: string;
    description: string;
    locale: string;
    baseAmount: number;
    doublePrice: number;

    constructor(theName: string, theDescription: string, theLocale: string, theBaseAmount: number, theDoublePrice: number){
        this.name = theName;
        this.description = theDescription;
        this.locale = theLocale;
        this.baseAmount = theBaseAmount;
        this.doublePrice = theDoublePrice;
    }
}