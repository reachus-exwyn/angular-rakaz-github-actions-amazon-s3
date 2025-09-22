import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.type).toBe('spinner');
    expect(component.size).toBe('medium');
    expect(component.color).toBe('primary');
    expect(component.text).toBe('');
    expect(component.overlay).toBe(false);
    expect(component.fullScreen).toBe(false);
  });

  it('should generate correct loader classes', () => {
    component.type = 'dots';
    component.size = 'large';
    component.color = 'secondary';
    
    const classes = component.loaderClasses;
    expect(classes).toContain('loader');
    expect(classes).toContain('loader-dots');
    expect(classes).toContain('loader-large');
    expect(classes).toContain('loader-secondary');
  });

  it('should generate correct overlay classes', () => {
    component.fullScreen = true;
    const classes = component.overlayClasses;
    expect(classes).toContain('loader-overlay');
    expect(classes).toContain('loader-fullscreen');
  });
});
