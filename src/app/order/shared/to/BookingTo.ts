import { PriceIndicatorTo } from 'src/app/core/to/PriceIndicatorTo';
import { AddressTo } from './AddressTo';

export class BookingTo{
    name: string;
    description: string;
    serviceId: number;
    addressTo: AddressTo;
    userId: number;
    start: string;
    end: string;
    priceIndicatorToList: PriceIndicatorTo[];
}