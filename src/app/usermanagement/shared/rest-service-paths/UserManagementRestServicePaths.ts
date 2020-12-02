import { BackendApiServicePath } from 'src/app/pricing/rest-service-paths/BackendApiServicePath';

export class UserManagementRestServicePaths{

    public static FIND_ALL_USERS() {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/users';
    }

    public static USER_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/user';
    }

    public static USER_PATH_WITH_ID(userId: number) {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/user/' + userId;
    }

    public static FIND_ALL_ACCOUNTS() {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/users/accounts';
    }

    public static FIND_ALL_USERS_BY_ROLE(roleId: number) {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/users/role/' + roleId;
    }

    public static ACCOUNT_PATH_WITH_ID(userId: number) {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/user/' + userId + '/account';
    }

    public static ACCOUNT_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/user/account';
    }

    public static ROLE_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/role';
    }

    public static ROLE_PATH_WTH_ID(roleId: number) {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/role/' + roleId;
    }

    public static FIND_ALL_ROLES_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/roles';
    }

    public static FIND_ALL_PERMISSONS_PATH() {
        return BackendApiServicePath.BACKEND_API() + 'user/v1/permissions';
    }
}