import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { DeleteComponent } from 'src/app/core/delete/delete.component';
import { ApplicationPermission } from 'src/app/shared/utils/ApplicationPermission';
import { SortUtil } from 'src/app/shared/utils/SortUtil';
import { AddBookingComponent } from '../modals/booking/add-booking/add-booking.component';
import { ModifyBookingComponent } from '../modals/booking/modify-booking/modify-booking.component';
import { BookingService } from '../shared/services/booking.service';
import { BookingEto } from '../shared/to/BookingEto';

@Component({
  selector: 'cf-bookings-overview',
  templateUrl: './bookings-overview.component.html',
  styleUrls: ['./bookings-overview.component.scss']
})

export class BookingsOverviewComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'service', 'address', 'user', 'confirmed', 'predictedPrice', 'start', 'end', 'actions'];
  public dataSource: MatTableDataSource<BookingEto>;
  public isSpinnerDisplayed = false;
  private subscription = new Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private permissionsService: NgxPermissionsService,
    private bookingService: BookingService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.onSpinnerDisplayed();
    this.loadsBooking();
  }

  private loadsBooking() {
    this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_SUPER).then((result) => {
      if (result) {
        this.loadsAllBookings();
      } else {
        this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_ORDERS).then((result) => {
          if (result) {
            this.loadsAllBookings();
          } else {
            this.permissionsService.hasPermission(ApplicationPermission.AUTH_USER).then((result) => {
              if (result) {
                this.loadsUserBookings();
              }
            })
          }
        })
      }
    })
  }

  private loadsUserBookings() {
    this.bookingService.getAllBookingsOfUser();

    this.subscription.add(this.bookingService.userBookingsData.subscribe(
      (bookings) => {
        this.dataSource = new MatTableDataSource(bookings);
        this.setDataSourceSettings();
      }));
  }

  private loadsAllBookings() {
    this.bookingService.getAllBookings();

    this.subscription.add(this.bookingService.bookingsData.subscribe(
      (bookings) => {
        this.dataSource = new MatTableDataSource(bookings);
        this.setDataSourceSettings();
      }));
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.bookingService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
      this.isSpinnerDisplayed = isSpinnerDisplayed;
    }));
  }

  private setDataSourceSettings() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.prepareFilterPredicate();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private prepareFilterPredicate(): (data: BookingEto, filter: string) => boolean {
    return (data: BookingEto, filter: string) => {
      return data.userEto.name.toLocaleLowerCase().includes(filter) || data.userEto.surname.toLocaleLowerCase().includes(filter) ||
        (data.confirmed ? this.translate.instant("bookings.confirmed").toLocaleLowerCase() == filter :
          this.translate.instant("bookings.unconfirmed").toLocaleLowerCase() == filter) || data.start.includes(filter) ||
        data.end.includes(filter) || data.predictedPrice.toFixed().includes(filter) || data.serviceEto.name.toLocaleLowerCase().includes(filter) ||
        data.addressEto.city.toLocaleLowerCase().includes(filter) || data.addressEto.street.toLocaleLowerCase().includes(filter) ||
        data.addressEto.buildingNumber.toLocaleLowerCase().includes(filter) || data.name.toLocaleLowerCase().includes(filter);
    };
  }

  filterStatus(status: string) {
    if (status != "all") {
      this.dataSource.filter = this.translate.instant("bookings." + status).trim().toLowerCase();
    } else {
      this.dataSource.filter = "";
    }
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSource.data = data;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "name":
          return SortUtil.compare(a.name, b.name, isAsc);
        case "coordinator":
          return SortUtil.compare(a.serviceEto.name, b.serviceEto.name, isAsc);
        case "user":
          return SortUtil.compare(a.userEto.surname, b.userEto.surname, isAsc);
        case "address":
          return SortUtil.compare(a.addressEto.city, b.addressEto.city, isAsc);
        case "isConfirmed":
          return SortUtil.compare(
            this.translate.instant("bookings." + a.confirmed),
            this.translate.instant("bookings." + b.confirmed), isAsc);
        case "predictedPrice":
          return SortUtil.compare(a.predictedPrice, b.predictedPrice, isAsc);
        case "start":
          return SortUtil.compare(a.start, b.start, isAsc);
        case "end":
          return SortUtil.compare(a.end, b.end, isAsc);
        default:
          return 0;
      }
    });
  }

  navigateToBookingDetails(id: number) {
    let currentHeadLink = this.router.url.substring(0, this.router.url.indexOf("o"));

    this.router.navigateByUrl(currentHeadLink + "orders/booking/details/" + id.toFixed());
  }

  addBooking() {
    const dialogRef = this.dialog.open(AddBookingComponent, { height: '80%', width: '45%' });
  }

  modifyBooking(booking: BookingEto) {
    const dialogRef = this.dialog.open(ModifyBookingComponent, { data: booking, height: '80%', width: '45%' });
  }

  deleteBooking(booking: BookingEto) {
    const dialogRef = this.dialog.open(DeleteComponent, { height: '22%', width: '45%' });

    dialogRef.afterClosed().subscribe((isDecisionPositive: boolean) => {
      if (isDecisionPositive) {
        this.bookingService.deleteBooking(booking.id);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
