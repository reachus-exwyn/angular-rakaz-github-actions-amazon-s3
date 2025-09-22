import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAdminDetailsComponent } from './customer-admin-details.component';

describe('CustomerAdminDetailsComponent', () => {
  let component: CustomerAdminDetailsComponent;
  let fixture: ComponentFixture<CustomerAdminDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAdminDetailsComponent]
    });
    fixture = TestBed.createComponent(CustomerAdminDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
