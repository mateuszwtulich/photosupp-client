import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';
import { PriceIndicatorEto } from 'src/app/core/to/PriceIndicatorEto';
import { PriceIndicatorTo } from 'src/app/core/to/PriceIndicatorTo';
import { BookingService } from 'src/app/order/shared/services/booking.service';
import { BookingTo } from 'src/app/order/shared/to/BookingTo';
import { ServiceService } from 'src/app/servicehandling/services/service.service';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';

@Component({
  selector: 'cf-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit {
  public nameControl = new FormControl("", Validators.required);
  public descriptionControl = new FormControl("");
  public cityControl = new FormControl("", Validators.required);
  public streetControl = new FormControl("", Validators.required);
  public buildingNumberControl = new FormControl("", Validators.required);
  public apartmentNumberControl = new FormControl("");
  public postalCodeControl = new FormControl("", Validators.required);
  public userControl = new FormControl("", Validators.required);
  public startDateControl = new FormControl("", Validators.required);
  public endDateControl = new FormControl("", Validators.required);
  public servicesControl = new FormControl("", Validators.required);
  public users: UserEto[];
  public services: ServiceEto[];
  public isSpinnerDisplayed: boolean;
  public subscription = new Subscription();
  private priceIndicatorToList: PriceIndicatorTo[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddBookingComponent>,
    private userService: UsersService,
    private serviceService: ServiceService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this.loadsAllData();
    this.onSpinnerDisplayed();
  }

  private loadsAllData() {
    Promise.all([
      this.userService.getAllUsers(),
      this.serviceService.getAllServices()
    ]).then(() => {
      this.subscription.add(combineLatest([
        this.userService.usersData,
        this.serviceService.servicesData,
      ]).subscribe(([users, services]) => {
        this.users = users;
        this.services = services;
      }))
    })
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.userService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  addBooking() {
    if (this.nameControl.valid && this.descriptionControl.valid && this.cityControl.valid && this.streetControl.valid &&
      this.buildingNumberControl.valid && this.postalCodeControl.valid && this.userControl.valid &&
      this.servicesControl.valid && this.startDateControl.valid && this.endDateControl.valid) {

      this.priceIndicatorToList = this.servicesControl.value.indicatorEtoList.map((indicator: IndicatorEto) => {
        return {
          bookingId: null,
          indicatorId: indicator.id,
          amount: indicator.baseAmount,
          price: 0
        }
      });

      let bookingTo: BookingTo = {
        name: this.nameControl.value,
        description: this.descriptionControl.value,
        addressTo: {
          city: this.cityControl.value,
          street: this.streetControl.value,
          buildingNumber: this.buildingNumberControl.value,
          apartmentNumber: this.apartmentNumberControl.value,
          postalCode: this.postalCodeControl.value
        },
        serviceId: this.servicesControl.value.id,
        userId: this.userControl.value.id,
        start: formatDate(new Date(this.startDateControl.value), "yyyy-MM-dd", 'en-GB'),
        end: formatDate(new Date(this.endDateControl.value), "yyyy-MM-dd", 'en-GB'),
        priceIndicatorToList: this.priceIndicatorToList
      }

      this.bookingService.createBooking(bookingTo).then(() => {
        this.dialogRef.close();
      });
    }
  }

  updateEndDate(event: MatDatepickerInputEvent<Date>) {
    if (this.endDateControl.value < event.value) {
      this.endDateControl.setValue(event.value);
    }
  }

  updateStartDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value < this.startDateControl.value) {
      this.startDateControl.setValue(event.value);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}