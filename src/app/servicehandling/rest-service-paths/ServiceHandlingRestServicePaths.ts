import { BackendApiServicePath } from 'src/app/pricing/rest-service-paths/BackendApiServicePath';

export class ServiceHandlingRestServicePaths{

    public static FIND_ALL_CITIES() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/address/cities';
    }

    public static FIND_ALL_STREETS() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/address/streets';
    }

    public static FIND_ALL_BOOKINGS() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/bookings';
    }

    public static FIND_ALL_BOOKINGS_BY_USER(userId: number) {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/bookings/' + userId;
    }

    public static FIND_ALL_INDICATORS() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/indicators';
    }

    public static FIND_ALL_SERVICES() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/services';
    }

    public static BOOKING_PATH_WITH_ID(id: string) {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/booking/' + id;
    }

    public static BOOKING_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/booking';
    }

    public static INFICATOR_PATH_WITH_ID(id: number) {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/indicator/' + id;
    }

    public static INDICATOR_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/indicator';
    }

    public static SERVICE_PATH_WITH_ID(id: number) {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/service/' + id;
    }

    public static SERVICE_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/service';
    }

    public static BOOKING_CONFIRM_PATH(id: number) {
        return BackendApiServicePath.BACKEND_API() + 'service/v1/booking/' + id + '/confirm';
    }
}