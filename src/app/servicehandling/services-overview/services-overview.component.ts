import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DeleteComponent } from 'src/app/core/delete/delete.component';
import { IndicatorEto } from 'src/app/servicehandling/to/IndicatorEto';
import { ServiceEto } from 'src/app/servicehandling/to/ServiceEto';
import { SortUtil } from 'src/app/shared/utils/SortUtil';
import { AddServiceComponent } from '../modals/service/add-service/add-service.component';
import { ModifyServiceComponent } from '../modals/service/modify-service/modify-service.component';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'cf-services-overview',
  templateUrl: './services-overview.component.html',
  styleUrls: ['./services-overview.component.scss']
})

export class ServicesOverviewComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'basePrice', 'indicators', 'locale', 'actions'];
  public dataSource: MatTableDataSource<ServiceEto>;
  public isSpinnerDisplayed = false;
  public subscription = new Subscription();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private translate: TranslateService,
    private serviceService: ServiceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.onSpinnerDisplayed();
    this.loadsAllServices();
  }

  private loadsAllServices() {
    this.serviceService.getAllServices();

    this.subscription.add(this.serviceService.servicesData.subscribe(
      (services) => {
        this.dataSource = new MatTableDataSource(services);
        this.setDataSourceSettings();
      }))
  }

  private onSpinnerDisplayed() {
    this.subscription.add(this.serviceService.spinnerData.subscribe((isSpinnerDisplayed: boolean) => {
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

  private prepareFilterPredicate(): (data: ServiceEto, filter: string) => boolean {
    return (data: ServiceEto, filter: string) => {
      let inIndicators: boolean = !!data.indicatorEtoList.find(indicator => indicator.name.toLocaleLowerCase().includes(filter));

      return data.name.toLocaleLowerCase().includes(filter) || inIndicators ||
        this.translate.instant("table." + data.locale).toLocaleLowerCase().includes(filter) || data.basePrice.toFixed().includes(filter);
    };
  }

  filterStatus(status: string) {
    if (status != "ALL") {
      this.dataSource.filter = this.translate.instant("table." + status).trim().toLowerCase();
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
        case "locale":
          return SortUtil.compare(this.translate.instant("services." + a.locale), this.translate.instant("services." + b.locale), isAsc);
        case "basePrice":
          return SortUtil.compare(a.basePrice, b.basePrice, isAsc);
        case "indicators":
          return SortUtil.compare(a.indicatorEtoList[0].name, b.indicatorEtoList[1].name, isAsc);
        default:
          return 0;
      }
    });
  }

  addService() {
    const dialogRef = this.dialog.open(AddServiceComponent, { height: '75%', width: '45%' });
  }

  modifyService(service: ServiceEto) {
    const dialogRef = this.dialog.open(ModifyServiceComponent, { data: service, height: '55%', width: '45%' });
  }

  deleteService(service: ServiceEto) {
    const dialogRef = this.dialog.open(DeleteComponent, { height: '20%', width: '45%' });

    dialogRef.afterClosed().subscribe((isDecisionPositive: boolean) => {
      if (isDecisionPositive) {
        this.serviceService.deleteService(service.id);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
