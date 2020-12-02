import { UserEto } from 'src/app/usermanagement/shared/to/UserEto';

export class CommentEto {
    id: number;
    content: string;
    orderNumber: string;
    userEto: UserEto;
    createdAt: string;
}