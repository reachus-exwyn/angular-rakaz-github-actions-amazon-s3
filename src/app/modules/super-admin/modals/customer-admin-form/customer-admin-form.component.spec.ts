import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAdminFormComponent } from './customer-admin-form.component';

describe('CustomerAdminFormComponent', () => {
  let component: CustomerAdminFormComponent;
  let fixture: ComponentFixture<CustomerAdminFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAdminFormComponent]
    });
    fixture = TestBed.createComponent(CustomerAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
