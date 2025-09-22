import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show and hide loader', () => {
    service.show();
    expect(service.isLoading()).toBe(true);
    
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should show loader with custom config', () => {
    const config = { type: 'dots', size: 'large', color: 'secondary' };
    service.show(config);
    
    expect(service.isLoading()).toBe(true);
    expect(service.getConfig()).toEqual(jasmine.objectContaining(config));
  });

  it('should handle multiple requests', () => {
    service.showForRequest();
    service.showForRequest();
    expect(service.isLoading()).toBe(true);
    
    service.hideForRequest();
    expect(service.isLoading()).toBe(true);
    
    service.hideForRequest();
    expect(service.isLoading()).toBe(false);
  });

  it('should show loader with text', () => {
    service.showWithText('Loading...');
    expect(service.isLoading()).toBe(true);
    expect(service.getConfig().text).toBe('Loading...');
  });

  it('should reset requests', () => {
    service.showForRequest();
    service.showForRequest();
    expect(service.isLoading()).toBe(true);
    
    service.resetRequests();
    expect(service.isLoading()).toBe(false);
  });
});
