import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorParameterManagementComponent } from './sensor-parameter-management.component';

describe('SensorParameterManagementComponent', () => {
  let component: SensorParameterManagementComponent;
  let fixture: ComponentFixture<SensorParameterManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensorParameterManagementComponent]
    });
    fixture = TestBed.createComponent(SensorParameterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
