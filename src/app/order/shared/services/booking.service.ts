import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ServiceHandlingRestServicePaths } from 'src/app/servicehandling/rest-service-paths/ServiceHandlingRestServicePaths';
import { LocalStorageService } from 'src/app/shared/cache/localStorage.service';
import { BookingEto } from '../to/BookingEto';
import { BookingEtoWithOrderNumber } from '../to/BookingEtoWithOrderNumber';
import { BookingTo } from '../to/BookingTo';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private subscription: Subscription = new Subscription();
  private bookingsDataSource: BehaviorSubject<BookingEto[]> = new BehaviorSubject([]);
  public bookingsData = this.bookingsDataSource.asObservable();
  private userBookingsDataSource: BehaviorSubject<BookingEto[]> = new BehaviorSubject([]);
  public userBookingsData = this.userBookingsDataSource.asObservable();
  private spinnerDataSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public spinnerData = this.spinnerDataSource.asObservable();
  private bookingDetailsDataSource: BehaviorSubject<BookingEto> = new BehaviorSubject(null);
  public bookingDetailsData = this.bookingDetailsDataSource.asObservable();

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private localStorage: LocalStorageService
  ) { }

  public getAllBookings() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<BookingEto[]>(`${ServiceHandlingRestServicePaths.FIND_ALL_BOOKINGS()}`).subscribe(
        (bookings: BookingEto[]) => {
          this.bookingsDataSource.next(bookings);
          this.spinnerDataSource.next(false);
          resolve(bookings);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public getAllBookingsOfUser() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      let userId = this.localStorage.getUserId();
      this.subscription.add(this.http.get<BookingEto[]>(`${ServiceHandlingRestServicePaths.FIND_ALL_BOOKINGS_BY_USER(userId)}`).subscribe(
        (bookings: BookingEto[]) => {
          this.userBookingsDataSource.next(bookings);
          this.spinnerDataSource.next(false);
          resolve(bookings);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public createUserBooking(bookingTo: BookingTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<BookingEto>(`${ServiceHandlingRestServicePaths.BOOKING_PATH()}`, bookingTo).subscribe(
        (booking: BookingEto) => {
          if (this.userBookingsDataSource.value) {
            const currentValue = this.userBookingsDataSource.value;
            const updatedValue = [...currentValue, booking];
            this.userBookingsDataSource.next(updatedValue);
          } else {
            this.userBookingsDataSource.next([booking]);
          }
          this.spinnerDataSource.next(false);
          resolve(booking);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public createBooking(bookingTo: BookingTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<BookingEto>(`${ServiceHandlingRestServicePaths.BOOKING_PATH()}`, bookingTo).subscribe(
        (booking: BookingEto) => {
          if (this.bookingsDataSource.value) {
            const currentValue = this.bookingsDataSource.value;
            const updatedValue = [...currentValue, booking];
            this.bookingsDataSource.next(updatedValue);
          } else {
            this.bookingsDataSource.next([booking]);
          }
          this.spinnerDataSource.next(false);
          resolve(booking);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public modifyBooking(bookingTo: BookingTo, id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<BookingEto>(`${ServiceHandlingRestServicePaths.BOOKING_PATH_WITH_ID(id.toFixed())}`, bookingTo).subscribe(
        (bookingEto: BookingEto) => {
          let updated = this.bookingsDataSource.value.filter(booking => booking.id != bookingEto.id);
          updated.push(bookingEto);
          this.bookingsDataSource.next(updated);
          this.bookingDetailsDataSource.next(bookingEto);
          this.spinnerDataSource.next(false);
          resolve(bookingEto);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteBooking(id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${ServiceHandlingRestServicePaths.BOOKING_PATH_WITH_ID(id.toFixed())}`).subscribe(
        () => {
          this.bookingsDataSource.next(this.bookingsDataSource.value.filter((booking) => booking.id != id));
          this.spinnerDataSource.next(false);
          resolve();
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public confirmBooking(id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      let userId = this.localStorage.getUserId();
      this.subscription.add(this.http.put<BookingEtoWithOrderNumber>(`${ServiceHandlingRestServicePaths.BOOKING_CONFIRM_PATH(id)}`, userId).subscribe(
        (booking: BookingEtoWithOrderNumber) => {
          this.spinnerDataSource.next(false);
          resolve(booking);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public getBookingById(id: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<BookingEto>(`${ServiceHandlingRestServicePaths.BOOKING_PATH_WITH_ID(id)}`).subscribe(
        (booking: BookingEto) => {
          this.bookingDetailsDataSource.next(booking);
          this.spinnerDataSource.next(false);
          resolve(booking);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}