import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CalendarEvent } from '../to/CalendarEvent';
import { Router } from '@angular/router';
import { SchedulerService } from '../services/scheduler.service';
import { BookingEto } from 'src/app/order/shared/to/BookingEto';
import { DatePipe } from '@angular/common';
import { NgxPermissionsService } from 'ngx-permissions';
import { BookingService } from 'src/app/order/shared/services/booking.service';
import { LocalStorageService } from 'src/app/shared/cache/localStorage.service';
import { ApplicationPermission } from 'src/app/shared/utils/ApplicationPermission';

@Component({
  selector: 'cf-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  public isSpinnerDisplayed = false;
  public calendarEvents: CalendarEvent[];
  public textColor: string;
  private subscritpion: Subscription = new Subscription();
  private bookings: BookingEto[];
  private myBookings: BookingEto[];

  public calendarOptions: CalendarOptions;

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private schedulerService: SchedulerService,
    private datePipe: DatePipe,
    private permissionService: NgxPermissionsService,
    private bookingService: BookingService,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.subscritpion.add(this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.calendarOptions.locale = event.lang;
    }));

    this.createsCalendarOptions();
    this.loadsBookings();
    this.checkIfPlanning();
  }

  private createsCalendarOptions() {
    this.calendarOptions = {
      eventClick: this.eventClicked.bind(this),
      initialView: 'dayGridMonth',
      selectable: true,
      select: this.selectedFields.bind(this),
      unselectAuto: false,
      weekends: true,
      locale: "pl",
      firstDay: 1,
      aspectRatio: 1.75,
      eventTextColor: 'black',
    };
  }

  private loadsBookings() {
    this.bookingService.getAllBookings();

    this.subscritpion.add(this.bookingService.bookingsData.subscribe((bookings) => {
      this.bookings = bookings.map(booking => {
        let endDate = new Date(booking.end);
        endDate.setDate(endDate.getDate() + 1);
    
        booking.end = this.transformDate(endDate);
        return booking;
      });

      this.myBookings = this.bookings.filter(booking => booking.userEto.id == this.localStorage.getUserId())

      this.loadCalendarEvents(this.bookings);
    }));
  }

  filterEvents(type: string) {
    if(type == "ALL"){
      this.loadCalendarEvents(this.bookings);
    } else if(type == "MINE"){
      this.loadCalendarEvents(this.myBookings);
    } else if(type == "confirmed"){
      this.loadCalendarEvents(this.bookings.filter(booking => booking.confirmed == true))
    } else if(type == "unconfirmed"){
      this.loadCalendarEvents(this.bookings.filter(booking => booking.confirmed == false))
    }
  }

  private loadCalendarEvents(bookings: BookingEto[]) {
    this.calendarEvents = bookings.map(booking => new CalendarEvent(booking))

    this.calendarOptions.events = this.calendarEvents;
    this.calendarOptions.events.push({
      daysOfWeek: [0], //Sundays and saturdays
      rendering: "background",
      color: "#ff9f89",
      display: 'background',
      overLap: false,
      allDay: true
    })
  }

  private checkIfPlanning() {
    if (this.router.url !== '/client/order/planning') {
      this.calendarOptions.selectable = false;
    }
  }

  private selectedFields(info) {
    let booking = new BookingEto();

    let endDate = new Date(info.endStr);
    endDate.setDate(endDate.getDate() - 1);

    booking.start = this.transformDate(info.startStr);
    booking.end = this.transformDate(endDate);

    this.schedulerService.datesDataSource.next(booking);
  }

  private transformDate(date: Date): string {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  eventClicked(arg) {
    let isMine = !!this.myBookings.find(booking => booking.userEto.id == arg.event._def.groupId) ? true : false;

    this.permissionService.hasPermission(ApplicationPermission.A_CRUD_SUPER).then((result) => {
      if (result) {
        this.navigateToDetailsByRole("/manager", arg);
      } else {
        this.permissionService.hasPermission(ApplicationPermission.A_CRUD_BOOKINGS).then((result) => {
          if (result) {
            this.navigateToDetailsByRole("/manager", arg);
          } else {
            this.permissionService.hasPermission(ApplicationPermission.AUTH_USER).then((result) => {
              if (result && isMine) {
                this.navigateToDetailsByRole("/client", arg);
              }
            })
          }
        })
      }
    })
  }

  navigateToDetailsByRole(url: string, arg) {
    this.router.navigateByUrl(url + "/orders/booking/details/" + arg.event.id);
  }

  ngOnDestroy(){
    this.subscritpion.unsubscribe();
  }
}
