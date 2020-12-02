import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/cache/localStorage.service';
import { OrderRestServicePaths } from '../rest-service-paths/OrderRestServicePaths';
import { CommentEto } from '../to/CommentEto';
import { CommentTo } from '../to/CommentTo';
import { MediaContentEto } from '../to/MediaContentEto';
import { MediaContentTo } from '../to/MediaContentTo';
import { OrderEto } from '../to/OrderEto';
import { OrderTo } from '../to/OrderTo';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private subscription: Subscription = new Subscription();
  private ordersDataSource: BehaviorSubject<OrderEto[]> = new BehaviorSubject([]);
  public ordersData = this.ordersDataSource.asObservable();
  private userOrdersDataSource: BehaviorSubject<OrderEto[]> = new BehaviorSubject([]);
  public userOrdersData = this.userOrdersDataSource.asObservable();
  private spinnerDataSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public spinnerData = this.spinnerDataSource.asObservable();
  private orderDetailsDataSource: BehaviorSubject<OrderEto> = new BehaviorSubject(null);
  public orderDetailsData = this.orderDetailsDataSource.asObservable();
  private commentsOrderDataSource: BehaviorSubject<CommentEto[]> = new BehaviorSubject([]);
  public commentOrderData = this.commentsOrderDataSource.asObservable();
  private mediaContentOrderDataSource: BehaviorSubject<MediaContentEto[]> = new BehaviorSubject([]);
  public mediaContentOrderData = this.mediaContentOrderDataSource.asObservable();

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private localStorage: LocalStorageService,
  ) { }

  public getAllOrders() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<OrderEto[]>(`${OrderRestServicePaths.FIND_ALL_ORDERS()}`).subscribe(
        (orders: OrderEto[]) => {
          this.ordersDataSource.next(orders);
          this.spinnerDataSource.next(false);
          resolve(orders);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public getOrdersOfUser() {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      let userId = this.localStorage.getUserId();
      this.subscription.add(this.http.get<OrderEto[]>(`${OrderRestServicePaths.FIND_ALL_ORDERS_BY_USER(userId)}`).subscribe(
        (orders: OrderEto[]) => {
          this.userOrdersDataSource.next(orders);
          this.spinnerDataSource.next(false);
          resolve(orders);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'))
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public getOrderByOrderNumber(orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<OrderEto>(`${OrderRestServicePaths.ORDER_PATH_WITH_ORDER_NUMBER(orderNumber)}`).subscribe(
        (order: OrderEto) => {
          this.orderDetailsDataSource.next(order);
          this.spinnerDataSource.next(false);
          resolve(order);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public acceptOrder(orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<OrderEto>(`${OrderRestServicePaths.ACCEPT_ORDER_PATH(orderNumber)}`, {}).subscribe(
        (order: OrderEto) => {
          this.orderDetailsDataSource.next(order);
          this.spinnerDataSource.next(false);
          resolve(order);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public sendOrderToVerification(orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<OrderEto>(`${OrderRestServicePaths.SEND_TO_VERFICATION_ORDER_PATH(orderNumber)}`, {}).subscribe(
        (order: OrderEto) => {
          this.orderDetailsDataSource.next(order);
          this.spinnerDataSource.next(false);
          resolve(order);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public finishOrder(orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<OrderEto>(`${OrderRestServicePaths.FINISH_ORDER_PATH(orderNumber)}`, {}).subscribe(
        (order: OrderEto) => {
          this.orderDetailsDataSource.next(order);
          this.spinnerDataSource.next(false);
          resolve(order);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'));
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public getCommentsOfOrder(orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<CommentEto[]>(`${OrderRestServicePaths.FIND_ALL_COMMENTS_BY_ORDER_NUMBER(orderNumber)}`).subscribe(
        (comments: CommentEto[]) => {
          this.commentsOrderDataSource.next(comments);
          this.spinnerDataSource.next(false);
          resolve(comments);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'))
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public addComment(commentTo: CommentTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<CommentEto>(`${OrderRestServicePaths.COMMENT_PATH()}`, commentTo).subscribe(
        (comment: CommentEto) => {
          if (this.commentsOrderDataSource.value) {
            const currentValue = this.commentsOrderDataSource.value;
            const updatedValue = [...currentValue, comment];
            this.commentsOrderDataSource.next(updatedValue);
          } else {
            this.commentsOrderDataSource.next([comment]);
          }
          this.spinnerDataSource.next(false);
          resolve(comment);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'))
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteComment(id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${OrderRestServicePaths.COMMENT_PATH_WTIH_ID(id)}`).subscribe(
        () => {
          this.commentsOrderDataSource.next(this.commentsOrderDataSource.value.filter((comment) => comment.id != id));
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

  public getMediaContentOfOrder(orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.get<MediaContentEto[]>(`${OrderRestServicePaths.MEDIA_CONTENT_BY_ORDER_NUMBER(orderNumber)}`).subscribe(
        (mediaContent: MediaContentEto[]) => {
          this.mediaContentOrderDataSource.next(mediaContent);
          this.spinnerDataSource.next(false);
          resolve(mediaContent);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'))
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public addMediaContent(mediaContentTo: MediaContentTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<MediaContentEto>(`${OrderRestServicePaths.MEDIA_CONTENT_PATH()}`, mediaContentTo).subscribe(
        (mediaContent: MediaContentEto) => {
          if (this.mediaContentOrderDataSource.value) {
            const currentValue = this.mediaContentOrderDataSource.value;
            const updatedValue = [...currentValue, mediaContent];
            this.mediaContentOrderDataSource.next(updatedValue);
          } else {
            this.mediaContentOrderDataSource.next([mediaContent]);
          }
          this.spinnerDataSource.next(false);
          resolve(mediaContent);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error'))
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteMediaContent(id: number) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${OrderRestServicePaths.MEDIA_CONTENT_PATH_WTIH_ID(id)}`).subscribe(
        () => {
          this.mediaContentOrderDataSource.next(this.mediaContentOrderDataSource.value.filter((mediaContent) => mediaContent.id != id));
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

  public createOrder(orderTo: OrderTo) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.post<OrderEto>(`${OrderRestServicePaths.ORDER_PATH()}`, orderTo).subscribe(
        (order: OrderEto) => {
          if (this.ordersDataSource.value) {
            const currentValue = this.ordersDataSource.value;
            const updatedValue = [...currentValue, order];
            this.ordersDataSource.next(updatedValue);
          } else {
            this.ordersDataSource.next([order]);
          }
          this.spinnerDataSource.next(false);
          resolve(order);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public modifyOrder(orderTo: OrderTo, orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.put<OrderEto>(`${OrderRestServicePaths.ORDER_PATH_WITH_ORDER_NUMBER(orderNumber)}`, orderTo).subscribe(
        (orderEto: OrderEto) => {
          let updated = this.ordersDataSource.value.filter(order => order.orderNumber != orderEto.orderNumber);
          updated.push(orderEto);
          this.ordersDataSource.next(updated);
          this.spinnerDataSource.next(false);
          resolve(orderEto);
        },
        (e) => {
          this.snackbar.open(this.translate.instant('server.error') + ": " + e.error.message);
          this.spinnerDataSource.next(false);
          reject();
        }))
    })
  }

  public deleteOrder(orderNumber: string) {
    return new Promise((resolve, reject) => {
      this.spinnerDataSource.next(true);
      this.subscription.add(this.http.delete<void>(`${OrderRestServicePaths.ORDER_PATH_WITH_ORDER_NUMBER(orderNumber)}`).subscribe(
        () => {
          this.ordersDataSource.next(this.ordersDataSource.value.filter((order) => order.orderNumber != orderNumber));
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}