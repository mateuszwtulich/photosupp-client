import { BookingEto } from 'src/app/order/shared/to/BookingEto';

export class CalendarEvent {
    groupId: string;
    id: string;
    type: string;
    title: string;
    start: string;
    end: string;
    color: string;
    textColor: string;

    constructor(booking:  Partial<BookingEto> = {}){
        this.groupId = booking.userEto.id.toString();
        this.id = booking.id.toString();
        this.type = booking.confirmed.toString();
        this.title = booking.name;
        this.start = booking.start;
        this.end = booking.end;
        this.textColor = booking.confirmed ? 'white' : 'black';
        this.color = booking.confirmed ? '#86a3b7' : '#e9f0f3';
    }
}