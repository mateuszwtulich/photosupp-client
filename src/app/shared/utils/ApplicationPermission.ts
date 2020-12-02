
export enum ApplicationPermission {
    A_CRUD_SUPER = 'A_CRUD_SUPER',
    A_CRUD_USERS = 'A_CRUD_USERS',
    A_CRUD_ROLES = 'A_CRUD_ROLES',
    A_CRUD_SERVICES = 'A_CRUD_SERVICES',
    A_CRUD_BOOKINGS = 'A_CRUD_BOOKINGS',
    A_CRUD_INDICATORS = 'A_CRUD_INDICATORS',
    A_CRUD_ORDERS = 'A_CRUD_ORDERS',
    AUTH_USER = 'AUTH_USER'
}

export class BasicRole {
    static getClientRoleId(): number{
        return 102;
    }
}

export class PermissionRules {
 static rules = [
    {
      permission: ApplicationPermission.A_CRUD_SUPER,
      relatedPermissions: [
        ApplicationPermission.A_CRUD_USERS,
        ApplicationPermission.A_CRUD_ROLES,
        ApplicationPermission.A_CRUD_SERVICES,
        ApplicationPermission.A_CRUD_BOOKINGS,
        ApplicationPermission.A_CRUD_INDICATORS,
        ApplicationPermission.A_CRUD_ORDERS,
        ApplicationPermission.AUTH_USER]
    }]

    static getRelatedPermission(permission: string) {

        const rule = PermissionRules.rules.find(r => r.permission === permission);
        return rule !=null ? rule.relatedPermissions : [];
    }
}