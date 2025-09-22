import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserFormComponent } from './modals/user-form/user-form.component';
import { SuperAdminComponent } from './super-admin.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from './components/content/content.component';
import { CustomerAdminDetailsComponent } from './components/customer-admin-details/customer-admin-details.component';
import { SensorParameterManagementComponent } from './components/sensor-parameter-management/sensor-parameter-management.component';
import { DeviceDetailsComponent } from './components/device-details/device-details.component';
import { DeviceMappingComponent } from './components/device-mapping/device-mapping.component';
import { ReportComponent } from './components/report/report.component';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ActionDropdownRendererComponent } from './components/action-dropdown-renderer/action-dropdown-renderer.component'; 
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAdminFormComponent } from './modals/customer-admin-form/customer-admin-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { SensorFormComponent } from './modals/sensor-form/sensor-form.component';
import { ConfigurationFormComponent } from './modals/configuration-form/configuration-form.component';
import { DeviceFormComponent } from './modals/device-form/device-form.component';
import { DeviceMappingFormComponent } from './modals/device-mapping-form/device-mapping-form.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ShareReportComponent } from './modals/share-report/share-report.component';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]); 

@NgModule({
  declarations: [
   HeaderComponent,
    SidenavComponent,
    UserFormComponent,
    SuperAdminComponent,
    ContentComponent,
    CustomerAdminDetailsComponent,
    SensorParameterManagementComponent,
    DeviceDetailsComponent,
    DeviceMappingComponent,
    ReportComponent,
    ActionDropdownRendererComponent,
    CustomerAdminFormComponent,
    SensorFormComponent,
    ConfigurationFormComponent,
    DeviceFormComponent,
    DeviceMappingFormComponent,
    ShareReportComponent
  ],
  imports: [
    CommonModule,
    
    SuperAdminRoutingModule,
    RouterModule,
    NgbModule,
    HttpClientModule,
    AgGridModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgSelectModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
    
    
    
    
  ]
})
export class SuperAdminModule { }
