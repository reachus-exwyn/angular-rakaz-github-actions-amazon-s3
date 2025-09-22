import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDropdownRendererComponentComponent } from './action-dropdown-renderer.component';

describe('ActionDropdownRendererComponentComponent', () => {
  let component: ActionDropdownRendererComponentComponent;
  let fixture: ComponentFixture<ActionDropdownRendererComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDropdownRendererComponentComponent]
    });
    fixture = TestBed.createComponent(ActionDropdownRendererComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
