import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMappingFormComponent } from './device-mapping-form.component';

describe('DeviceMappingFormComponent', () => {
  let component: DeviceMappingFormComponent;
  let fixture: ComponentFixture<DeviceMappingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceMappingFormComponent]
    });
    fixture = TestBed.createComponent(DeviceMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
