import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BookingDetailsComponent } from 'src/app/order/booking-details/booking-details.component';
import { BookingEto } from 'src/app/order/shared/to/BookingEto';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  private subscription: Subscription = new Subscription();
  public datesDataSource: BehaviorSubject<BookingEto> = new BehaviorSubject(null);
  public datesData = this.datesDataSource.asObservable();

  constructor() { }
}
