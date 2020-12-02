import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { combineLatest, Subscription } from 'rxjs';
import { DeleteComponent } from 'src/app/core/delete/delete.component';
import { ApplicationPermission } from 'src/app/shared/utils/ApplicationPermission';
import { SortUtil } from 'src/app/shared/utils/SortUtil';
import { AddOrderComponent } from '../modals/order/add-order/add-order.component';
import { ModifyOrderComponent } from '../modals/order/modify-order/modify-order.component';
import { OrderService } from '../shared/services/order.service';
import { OrderEto } from '../shared/to/OrderEto';


@Component({
  selector: 'cf-orders-overview',
  templateUrl: './orders-overview.component.html',
  styleUrls: ['./orders-overview.component.scss']
})

export class OrdersOverviewComponent implements OnInit {
  public displayedColumns: string[] = ['orderNumber', 'coordinator', 'user', 'status', 'booking', 'price', 'createdAt'];
  public dataSource: MatTableDataSource<OrderEto>;
  public isSpinnerDisplayed = false;
  private subscription = new Subscription();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private translate: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    private orderService: OrderService,
    private permissionsService: NgxPermissionsService
  ) { }

  ngOnInit(): void {
    this.onSpinnerDisplayed();
    this.loadsOrders();
  }

  private loadsOrders() {
    this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_SUPER).then((result) => {
      if (result) {
        this.loadsAllOrders();
      } else {
        this.permissionsService.hasPermission(ApplicationPermission.A_CRUD_ORDERS).then((result) => {
          if (result) {
            this.loadsAllOrders();
          } else {
            this.permissionsService.hasPermission(ApplicationPermission.AUTH_USER).then((result) => {
              if (result) {
                this.loadsUserOrders();
              }
            })
          }
        })
      }
    })
  }

  private loadsUserOrders() {
    this.orderService.getOrdersOfUser();

    this.subscription.add(this.orderService.userOrdersData.subscribe(
      (orders) => {
        this.dataSource = new MatTableDataSource(orders);
        this.setDataSourceSettings();
      }))
  }

  private loadsAllOrders() {
    this.displayedColumns.push('actions');
    this.orderService.getAllOrders();

    this.subscription.add(this.orderService.ordersData.subscribe(
      (orders) => {
        this.dataSource = new MatTableDataSource(orders);
        this.setDataSourceSettings();
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.orderService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
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

  private prepareFilterPredicate(): (data: OrderEto, filter: string) => boolean {
    return (data: OrderEto, filter: string) => {
      return data.user.name.toLocaleLowerCase().includes(filter) || data.user.surname.toLocaleLowerCase().includes(filter) ||
        this.translate.instant("orders." + data.status).toLocaleLowerCase().includes(filter) || data.price.toFixed().includes(filter) ||
        data.orderNumber.toLocaleLowerCase().includes(filter) || data.createdAt.toLocaleLowerCase().includes(filter) ||
        data.coordinator.name.toLocaleLowerCase().includes(filter) || data.coordinator.surname.toLocaleLowerCase().includes(filter) ||
        (data.booking ? data.booking.name.toLocaleLowerCase().includes(filter) : this.translate.instant("orders.booking-null").toLocaleLowerCase().includes(filter))
    };
  }

  filterStatus(status: string) {
    if (status != "ALL") {
      this.dataSource.filter = this.translate.instant("orders." + status).trim().toLowerCase();
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
        case "orderNumber":
          return SortUtil.compare(a.user.surname, b.user.surname, isAsc);
        case "coordinator":
          return SortUtil.compare(a.coordinator.surname, b.coordinator.surname, isAsc);
        case "user":
          return SortUtil.compare(a.user.surname, b.user.surname, isAsc);
        case "status":
          return SortUtil.compare(a.status, b.status, isAsc);
        case "booking":
          return SortUtil.compare(a.booking ? a.booking.name : "", b.booking ? b.booking.name : "", isAsc);
        case "price":
          return SortUtil.compare(a.price, b.price, isAsc);
        case "createdAt":
          return SortUtil.compare(a.createdAt, b.createdAt, isAsc);
        default:
          return 0;
      }
    });
  }

  navigateToOrderDetails(orderNumber: string) {
    let currentHeadLink = this.router.url.substring(0, this.router.url.indexOf("o"));

    this.router.navigateByUrl(currentHeadLink + "orders/details/" + orderNumber);
  }

  navigateToBookingDetails(id: number) {
    let currentHeadLink = this.router.url.substring(0, this.router.url.indexOf("o"));

    this.router.navigateByUrl(currentHeadLink + "orders/booking/details/" + id.toFixed());
  }

  addOrder() {
    const dialogRef = this.dialog.open(AddOrderComponent, { height: '55%', width: '40%' });
  }

  modifyOrder(order: OrderEto) {
    const dialogRef = this.dialog.open(ModifyOrderComponent, { data: order, height: '55%', width: '45%' });
  }

  deleteOrder(order: OrderEto) {
    const dialogRef = this.dialog.open(DeleteComponent, { height: '22%', width: '45%' });

    dialogRef.afterClosed().subscribe((isDecisionPositive: boolean) => {
      if (isDecisionPositive) {
        this.orderService.deleteOrder(order.orderNumber);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
