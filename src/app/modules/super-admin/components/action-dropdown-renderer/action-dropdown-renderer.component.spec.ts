import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDropdownRendererComponent } from './action-dropdown-renderer.component';

describe('ActionDropdownRendererComponent', () => {
  let component: ActionDropdownRendererComponent;
  let fixture: ComponentFixture<ActionDropdownRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDropdownRendererComponent]
    });
    fixture = TestBed.createComponent(ActionDropdownRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
