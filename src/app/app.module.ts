import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { OrderModule } from './order/order.module';
import { CalendarModule } from './calendar/calendar.module';
import { PricingModule } from './pricing/pricing.module';
import {MatNativeDateModule} from '@angular/material/core';
import { ServicehandlingModule } from './servicehandling/servicehandling.module';
import { UsermanagementModule } from './usermanagement/usermanagement.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpBackend, HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Injector, APP_INITIALIZER } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './authentication/tokenInterceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    OrderModule,
    CalendarModule,
    PricingModule,
    ServicehandlingModule,
    UsermanagementModule,
    NgxPermissionsModule.forRoot(),
    MatNativeDateModule,
    MatSnackBarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpBackend]
      }
    })
    ],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  exports: [
    MatSnackBarModule, NgxPermissionsModule
  ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  export function HttpLoaderFactory(backend: HttpBackend) {
    return new TranslateHttpLoader(new HttpClient(backend));
}

function appInitializerFactory(translateService: TranslateService) {
  return () => {
    translateService.addLangs(['en', 'pl'])
    translateService.setDefaultLang('pl');
    console.info(`Successfully initialized language.'`);
    return translateService.use('pl').toPromise();
  };
}
