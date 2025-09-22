import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAdminComponent } from './customer-admin.component';

describe('CustomerAdminComponent', () => {
  let component: CustomerAdminComponent;
  let fixture: ComponentFixture<CustomerAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAdminComponent]
    });
    fixture = TestBed.createComponent(CustomerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
