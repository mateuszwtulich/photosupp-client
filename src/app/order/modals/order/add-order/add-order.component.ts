import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import { BookingService } from 'src/app/order/shared/services/booking.service';
import { OrderService } from 'src/app/order/shared/services/order.service';
import { BookingEto } from 'src/app/order/shared/to/BookingEto';
import { OrderTo } from 'src/app/order/shared/to/OrderTo';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';

@Component({
  selector: 'cf-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  public isSpinnerDisplayed = false;
  public subscription = new Subscription();
  public coordinatorControl = new FormControl("", Validators.required);
  public userControl = new FormControl("", Validators.required);
  public bookingControl = new FormControl("");
  public priceControl = new FormControl("", Validators.required);
  public coordinators: UserEto[];
  public users: UserEto[];
  public bookings: BookingEto[];

  constructor(
    public dialogRef: MatDialogRef<AddOrderComponent>,
    private userService: UsersService,
    private bookingService: BookingService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadsAllData();
    this.onSpinnerDisplayed();
  }

  private loadsAllData() {
    Promise.all([
      this.userService.getAllUsers(),
      this.bookingService.getAllBookings()
    ]).then(() => {
      this.subscription.add(combineLatest([
        this.userService.usersData,
        this.bookingService.bookingsData,
      ]).subscribe(([users, bookings]) => {
        this.users = users.filter(user => user.roleEto.name == "USER");
        this.coordinators = users.filter(user => user.roleEto.name == "MANAGER");
        this.bookings = bookings;
      }))
    })
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  addOrder() {
    if (this.coordinatorControl.valid && this.userControl.valid && this.bookingControl.valid && this.priceControl.valid) {

      let orderTo: OrderTo = {
        coordinatorId: this.coordinatorControl.value.id,
        userId: this.userControl.value.id,
        bookingId: this.bookingControl.value.id,
        price: this.priceControl.value
      }

      this.orderService.createOrder(orderTo).then(() => {
        this.dialogRef.close();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
