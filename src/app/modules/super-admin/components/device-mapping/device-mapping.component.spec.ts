import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMappingComponent } from './device-mapping.component';

describe('DeviceMappingComponent', () => {
  let component: DeviceMappingComponent;
  let fixture: ComponentFixture<DeviceMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceMappingComponent]
    });
    fixture = TestBed.createComponent(DeviceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
