import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { SidenavTo } from '../to/SidenavTo';

@Component({
  selector: 'cf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  filterNav: SidenavTo[];
  languages: string[];
  langDefault: string[] = ["pl", "en"];
  subscription: Subscription = new Subscription();

  homeNav = [ 
    new SidenavTo("home/calculate", "calculate", null),
    new SidenavTo("home", "account_box", null),
    new SidenavTo("home/login", "login", null)
  ];

  clientNav = [
    new SidenavTo("client", "home", null),
    new SidenavTo("client/order/planning", "book_online", null),
    new SidenavTo("client/orders", "list_alt", null),
    new SidenavTo("client/scheduler", "calendar_today", null),
    new SidenavTo("client/user/details", "account_circle", null),
  ];

  managerNav = [
    new SidenavTo("manager", "home", null),
    new SidenavTo("manager/orders", "list_alt", null),
    new SidenavTo("manager/services", "design_services", null),
    new SidenavTo("manager/scheduler", "calendar_today", null),
    new SidenavTo("manager/user/details", "account_circle", null),
    new SidenavTo("manager/user/overview", "supervised_user_circle", null),
  ]

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthenticationService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.onNavigationChange();
  }

  private onNavigationChange(){
    this.subscription.add(this.router.events.subscribe((arg: NavigationEnd) => {
      if(!!arg.url && arg.url.startsWith("/client")){
        this.filterNav = this.clientNav;
        this.refreshSidenavText();
      } else if(!!arg.url && arg.url.startsWith("/manager")){
        this.filterNav = this.managerNav;
        this.refreshSidenavText();
      } else if(!!arg.url && arg.url.startsWith("/home")){
        this.filterNav = this.homeNav;
        this.refreshSidenavText();
      }
    }));
  }

  navigateToHome() {
    if(window.location.pathname.startsWith("/client")){
      this.navigate("/client");
    } else if(window.location.pathname.startsWith("/manager")){
      this.navigate("/manager");
    } else {
      this.navigate("/home");
      this.filterNav = this.homeNav;
      this.refreshSidenavText();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscription.unsubscribe();
  }

  changeLanguage(lang: string){
    this.subscription.add(this.translate.use(lang).subscribe(() => {
      this.languages = this.langDefault;
      this.refreshSidenavText();
    }));
  }
  
  refreshSidenavText(): void {
    this.filterNav.forEach(nav => {
      nav.text = this.translate.instant('sidenav.' + nav.icon);
    });

    this.languages = this.langDefault.filter(lang => lang != this.translate.currentLang);
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    this.filterNav = this.homeNav;
    this.refreshSidenavText();
    this.router.navigateByUrl("/home");
    this.authService.logout();
  }

  getRouterLink(): boolean{
    return this.router.url.startsWith("/home");
  }
}