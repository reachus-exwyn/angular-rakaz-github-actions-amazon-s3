import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './shared/guards/login.guard';
import { SuperAdminGuard } from './shared/guards/super-admin.guard';
import { CustomerAdminGuard } from './shared/guards/customer-admin.guard';
import { CustomerGuard } from './shared/guards/customer.guard';
import { LoaderExamplesComponent } from './shared/components/loader-examples/loader-examples.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./modules/super-admin/super-admin.module').then(m => m.SuperAdminModule),
    canActivate: [SuperAdminGuard]
  },
  {
    path: 'customer-admin',
    loadChildren: () => import('./modules/customer-admin/customer-admin.module').then(m => m.CustomerAdminModule),
    canActivate: [CustomerAdminGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule),
    canActivate: [CustomerGuard]
  },
  {
    path: 'loader-examples',
    component: LoaderExamplesComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
