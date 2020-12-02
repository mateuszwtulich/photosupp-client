import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import { BookingService } from 'src/app/order/shared/services/booking.service';
import { OrderService } from 'src/app/order/shared/services/order.service';
import { BookingEto } from 'src/app/order/shared/to/BookingEto';
import { OrderEto } from 'src/app/order/shared/to/OrderEto';
import { OrderTo } from 'src/app/order/shared/to/OrderTo';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';

@Component({
  selector: 'cf-modify-order',
  templateUrl: './modify-order.component.html',
  styleUrls: ['./modify-order.component.scss']
})
export class ModifyOrderComponent implements OnInit {
  public isSpinnerDisplayed = false;
  public subscription = new Subscription();
  public coordinatorControl: FormControl;
  public userControl: FormControl;
  public bookingControl: FormControl;
  public priceControl: FormControl;
  public coordinators: UserEto[];
  public users: UserEto[];
  public bookings: BookingEto[];
  public selectedUser: UserEto;
  public selectedCoordinator: UserEto;
  public selectedBooking: BookingEto;

  constructor(
    public dialogRef: MatDialogRef<ModifyOrderComponent>,
    private userService: UsersService,
    private bookingService: BookingService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: OrderEto
  ) { }

  ngOnInit(): void {
    this.createControlls();
    this.loadsAllData();
    this.onSpinnerDisplayed();
  }

  private createControlls() {
    this.coordinatorControl = new FormControl(this.data.coordinator, Validators.required);
    this.userControl = new FormControl(this.data.user, Validators.required);
    this.bookingControl = new FormControl(this.data.booking);
    this.priceControl = new FormControl(this.data.price, Validators.required);
    this.selectedBooking = this.data.booking;
    this.selectedUser = this.data.user;
    this.selectedCoordinator = this.data.coordinator;
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

  modifyOrder() {
    if (this.coordinatorControl.valid && this.userControl.valid && this.priceControl.valid) {

      let bookingId = null;
      if(this.bookingControl.value){
        bookingId = this.bookingControl.value.id;
      }

      let orderTo: OrderTo = {
        coordinatorId: this.coordinatorControl.value.id,
        userId: this.userControl.value.id,
        bookingId: bookingId,
        price: this.priceControl.value
      }

      this.orderService.modifyOrder(orderTo, this.data.orderNumber).then(() => {
        this.dialogRef.close();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  compareFn(c1, c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
