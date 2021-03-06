import { PriceIndicatorEto } from 'src/app/core/to/PriceIndicatorEto';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';
import { AddressEto } from './AddressEto';

export class BookingEto{
    id: number;
    name: string;
    description: string;
    serviceEto: ServiceEto;
    addressEto: AddressEto;
    userEto: UserEto;
    confirmed: boolean;
    predictedPrice: number;
    start: string;
    end: string;
    modificationDate: string;
    priceIndicatorEtoList: PriceIndicatorEto[];
}