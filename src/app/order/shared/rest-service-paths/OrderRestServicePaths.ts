import { BackendApiServicePath } from 'src/app/pricing/rest-service-paths/BackendApiServicePath';

export class OrderRestServicePaths {

    public static FIND_ALL_ORDERS() {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/orders';
    }

    public static FIND_ALL_ORDERS_BY_USER(userId: number) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/orders/' + userId;
    }

    public static FIND_ALL_COMMENTS_BY_ORDER_NUMBER(orderNumber: string) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/' + orderNumber + '/comments';
    }

    public static MEDIA_CONTENT_BY_ORDER_NUMBER(orderNumber: string) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/' + orderNumber + '/mediaContent';
    }

    public static ORDER_PATH_WITH_ORDER_NUMBER(orderNumber: string) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/' + orderNumber;
    }

    public static ORDER_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order';
    }

    public static INFICATOR_PATH_WITH_ID(id: number) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/indicator/' + id;
    }

    public static COMMENT_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/comment';
    }

    public static COMMENT_PATH_WTIH_ID(id: number) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/comment/' + id;
    }

    public static MEDIA_CONTENT_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/mediaContent';
    }

    public static MEDIA_CONTENT_PATH_WTIH_ID(id: number) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/mediaContent/' + id;
    }

    public static FINISH_ORDER_PATH(orderNumber: string) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/' + orderNumber + "/finish";
    }

    public static ACCEPT_ORDER_PATH(orderNumber: string) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/' + orderNumber + "/accept";
    }

    public static SEND_TO_VERFICATION_ORDER_PATH(orderNumber: string) {
        return BackendApiServicePath.BACKEND_API() + 'order/v1/order/' + orderNumber + "/verification";
    }
}