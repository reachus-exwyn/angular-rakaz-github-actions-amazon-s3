import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorGroupMappingFormComponent } from './sensor-group-mapping-form.component';

describe('SensorGroupMappingFormComponent', () => {
  let component: SensorGroupMappingFormComponent;
  let fixture: ComponentFixture<SensorGroupMappingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensorGroupMappingFormComponent]
    });
    fixture = TestBed.createComponent(SensorGroupMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
