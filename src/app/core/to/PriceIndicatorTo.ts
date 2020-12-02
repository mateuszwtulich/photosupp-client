
export class PriceIndicatorTo {
    indicatorId: number;
    bookingId: number;
    price: number;
    amount: number;

    constructor(theIndicatorId: number, theBookingId: number, thePrice: number, theAmount: number){
        this.indicatorId = theIndicatorId,
        this.bookingId = theBookingId,
        this.price = thePrice,
        this.amount = theAmount;
    }
}
