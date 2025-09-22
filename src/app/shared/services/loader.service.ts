import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoaderConfig {
  type?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ripple' | 'skeleton';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white' | 'light';
  text?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private configSubject = new BehaviorSubject<LoaderConfig>({
    type: 'spinner',
    size: 'medium',
    color: 'primary',
    text: '',
    overlay: true,
    fullScreen: false
  });

  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  public config$: Observable<LoaderConfig> = this.configSubject.asObservable();

  private activeRequests = 0;

  constructor() { }

  /**
   * Show loader with default or custom configuration
   */
  show(config?: LoaderConfig): void {
    if (config) {
      this.configSubject.next({ ...this.configSubject.value, ...config });
    }
    this.loadingSubject.next(true);
  }

  /**
   * Hide loader
   */
  hide(): void {
    this.loadingSubject.next(false);
  }

  /**
   * Show loader for HTTP requests
   */
  showForRequest(config?: LoaderConfig): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.show(config);
    }
  }

  /**
   * Hide loader for HTTP requests
   */
  hideForRequest(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.hide();
    }
  }

  /**
   * Show loader with specific text
   */
  showWithText(text: string, config?: Omit<LoaderConfig, 'text'>): void {
    this.show({ ...config, text });
  }

  /**
   * Show full screen loader
   */
  showFullScreen(text?: string, config?: Omit<LoaderConfig, 'fullScreen' | 'text'>): void {
    this.show({ ...config, text, fullScreen: true });
  }

  /**
   * Show inline loader (no overlay)
   */
  showInline(config?: Omit<LoaderConfig, 'overlay'>): void {
    this.show({ ...config, overlay: false });
  }

  /**
   * Get current loading state
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Get current configuration
   */
  getConfig(): LoaderConfig {
    return this.configSubject.value;
  }

  /**
   * Reset active requests counter
   */
  resetRequests(): void {
    this.activeRequests = 0;
    this.hide();
  }
}
