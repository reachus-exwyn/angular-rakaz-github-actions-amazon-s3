import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorGroupComponent } from './sensor-group.component';

describe('SensorGroupComponent', () => {
  let component: SensorGroupComponent;
  let fixture: ComponentFixture<SensorGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensorGroupComponent]
    });
    fixture = TestBed.createComponent(SensorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
