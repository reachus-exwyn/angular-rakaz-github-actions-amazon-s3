import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorGroupingComponent } from './sensor-grouping.component';

describe('SensorGroupingComponent', () => {
  let component: SensorGroupingComponent;
  let fixture: ComponentFixture<SensorGroupingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensorGroupingComponent]
    });
    fixture = TestBed.createComponent(SensorGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
