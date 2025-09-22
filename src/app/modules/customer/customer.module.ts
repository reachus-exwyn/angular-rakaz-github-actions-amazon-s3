import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { CustomerComponent } from './customer.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ContentComponent } from './components/content/content.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReportsComponent } from './components/reports/reports.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DashboardChartsComponent } from './components/dashboard-charts/dashboard-charts.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { UpdateProfileComponent } from './modals/update-profile/update-profile.component';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HeaderComponent,
    CustomerComponent,
    SidenavComponent,
    ContentComponent,
    DashboardComponent,
    ReportsComponent,
    ProfileComponent,
    NotificationComponent,
    DashboardChartsComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    NgbModule,
    HttpClientModule,
    AgGridModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgSelectModule,
    FormsModule,
    HighchartsChartModule,
    GoogleMapsModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#80FFA2',
      defaultBgColor: '#00ACFF',
      defaultBoColor : '#476EFF',
      checkedLabel: 'on',
      uncheckedLabel: 'off'
    })
  ]
})
export class CustomerModule { }
