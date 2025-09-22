import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerAdminRoutingModule } from './customer-admin-routing.module';
import { CustomerAdminComponent } from './customer-admin.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CustomerFormComponent } from './modals/customer-form/customer-form.component';
import { ContentComponent } from './components/content/content.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { SensorGroupComponent } from './components/sensor-group/sensor-group.component';
import { SensorGroupingComponent } from './components/sensor-grouping/sensor-grouping.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AlertNotificationComponent } from './components/alert-notification/alert-notification.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentsComponent } from './components/payments/payments.component';
import { SensorGroupFormComponent } from './modals/sensor-group-form/sensor-group-form.component';
import { SensorGroupMappingFormComponent } from './modals/sensor-group-mapping-form/sensor-group-mapping-form.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { LocationPickerComponent } from './modals/location-picker/location-picker.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActionDropdownRendererComponent } from './components/action-dropdown-renderer/action-dropdown-renderer.component';
import { ConfigurationFormComponent } from './modals/configuration-form/configuration-form.component';
import { SubscriptionFormComponent } from './modals/subscription-form/subscription-form.component';
import { UpdateProfileComponent } from './modals/update-profile/update-profile.component';

@NgModule({
  declarations: [
    CustomerAdminComponent,
    HeaderComponent,
    SidenavComponent,
    CustomerFormComponent,
    ContentComponent,
    DashboardComponent,
    CustomerDetailsComponent,
    SensorGroupComponent,
    SensorGroupingComponent,
    SubscriptionsComponent,
    ReportsComponent,
    AlertNotificationComponent,
    ProfileComponent,
    PaymentsComponent,
    SensorGroupFormComponent,
    SensorGroupMappingFormComponent,
    LocationPickerComponent,
    ActionDropdownRendererComponent,
    ConfigurationFormComponent,
    SubscriptionFormComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    CustomerAdminRoutingModule,
    NgbModule,
    HttpClientModule,
    AgGridModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgSelectModule,
    FormsModule,
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerAdminModule { }
