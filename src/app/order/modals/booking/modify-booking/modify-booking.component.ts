import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';
import { BookingService } from 'src/app/order/shared/services/booking.service';
import { BookingEto } from 'src/app/order/shared/to/BookingEto';
import { BookingTo } from 'src/app/order/shared/to/BookingTo';
import { ServiceService } from 'src/app/servicehandling/services/service.service';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { UsersService } from 'src/app/usermanagement/shared/services/users.service';
import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';
import { AddBookingComponent } from '../add-booking/add-booking.component';

@Component({
  selector: 'cf-modify-booking',
  templateUrl: './modify-booking.component.html',
  styleUrls: ['./modify-booking.component.scss']
})
export class ModifyBookingComponent implements OnInit {
  public nameControl: FormControl;
  public descriptionControl: FormControl;
  public cityControl: FormControl;
  public streetControl: FormControl;
  public buildingNumberControl: FormControl;
  public apartmentNumberControl: FormControl;
  public postalCodeControl: FormControl;
  public userControl: FormControl;
  public startDateControl: FormControl;
  public endDateControl: FormControl;
  public servicesControl: FormControl;
  public users: UserEto[];
  public services: ServiceEto[];
  public isSpinnerDisplayed: boolean;
  public subscription = new Subscription();
  public selectedService: ServiceEto;
  public selectedUser: UserEto;

  constructor(
    public dialogRef: MatDialogRef<AddBookingComponent>,
    private userService: UsersService,
    private serviceService: ServiceService,
    private bookingService: BookingService,
    @Inject(MAT_DIALOG_DATA) public data: BookingEto
  ) { }

  ngOnInit(): void {
    this.createControlls();
    this.loadsAllData();
    this.onSpinnerDisplayed();
  }

  private createControlls() {
    this.nameControl = new FormControl(this.data.name, Validators.required);
    this.descriptionControl = new FormControl(this.data.description);
    this.cityControl = new FormControl(this.data.addressEto.city, Validators.required);
    this.streetControl = new FormControl(this.data.addressEto.street, Validators.required);
    this.buildingNumberControl = new FormControl(this.data.addressEto.buildingNumber, Validators.required);
    this.apartmentNumberControl = new FormControl(this.data.addressEto.apartmentNumber);
    this.postalCodeControl = new FormControl(this.data.addressEto.postalCode, Validators.required);
    this.userControl = new FormControl(this.data.userEto, Validators.required);
    this.startDateControl = new FormControl(this.data.start, Validators.required);
    this.endDateControl = new FormControl(this.data.end, Validators.required);
    this.servicesControl = new FormControl(this.data.serviceEto, Validators.required);
    this.selectedService = this.data.serviceEto;
    this.selectedUser = this.data.userEto;
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

  modifyBooking() {
    if (this.nameControl.valid && this.descriptionControl.valid && this.cityControl.valid && this.streetControl.valid &&
      this.buildingNumberControl.valid && this.postalCodeControl.valid && this.userControl.valid &&
      this.servicesControl.valid  && this.startDateControl.valid && this.endDateControl.valid) {

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
        priceIndicatorToList: []
      }

      this.bookingService.modifyBooking(bookingTo, this.data.id).then(() => {
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

  compareFn(c1, c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
