export class SidenavTo {
    routerLink: string;
    icon: string;
    text: string;

    constructor(theRouterLink, theIcon, theText) {
        this.routerLink = theRouterLink;
        this.icon = theIcon;
        this.text = theText;
    }
}