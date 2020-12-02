export interface Credentials {
    username: string;
    password: string;
}

export interface AuthInfo {
    username: string;
    authorities: Authority[];
    userId: number;
    tokenExp: number;
}

export interface Authority {
    authority: string;
}