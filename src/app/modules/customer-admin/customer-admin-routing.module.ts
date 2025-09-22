import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAdminComponent } from './customer-admin.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerAdminRoutingModule { }
