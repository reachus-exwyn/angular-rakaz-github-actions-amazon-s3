import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorFormComponent } from './sensor-form.component';

describe('SensorFormComponent', () => {
  let component: SensorFormComponent;
  let fixture: ComponentFixture<SensorFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensorFormComponent]
    });
    fixture = TestBed.createComponent(SensorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
