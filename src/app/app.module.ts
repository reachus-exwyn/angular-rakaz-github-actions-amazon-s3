import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'; 
import { ActionDropdownRendererComponent } from './modules/super-admin/components/action-dropdown-renderer/action-dropdown-renderer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastTestComponent } from './shared/components/toast-test/toast-test.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { GlobalLoaderComponent } from './shared/components/global-loader/global-loader.component';
import { LoaderExamplesComponent } from './shared/components/loader-examples/loader-examples.component';
import { HttpInterceptorService } from './shared/services/http-interceptor.service';
import { LoadingInterceptorService } from './shared/services/loading-interceptor.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]); 


@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    ToastTestComponent,
    LoaderComponent,
    GlobalLoaderComponent,
    LoaderExamplesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    AgGridModule,
    NgbDropdownModule,
    BrowserAnimationsModule,
    GoogleMapsModule,
    NgxDaterangepickerMd.forRoot(),
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
