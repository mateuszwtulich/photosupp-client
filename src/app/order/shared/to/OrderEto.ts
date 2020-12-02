import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';
import { UserDetailsComponent } from 'src/app/usermanagement/user-details/user-details.component';
import { OrderStatus } from '../enum/OrderStatus';
import { BookingEto } from './BookingEto';

export class OrderEto {
    orderNumber: string;
    coordinator: UserEto;
    user: UserEto;
    status: OrderStatus;
    booking: BookingEto;
    price: number;
    createdAt: string;
}