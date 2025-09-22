import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader-examples',
  templateUrl: './loader-examples.component.html',
  styleUrls: ['./loader-examples.component.scss']
})
export class LoaderExamplesComponent {

  constructor(private loaderService: LoaderService) { }

  // Spinner Examples
  showSpinnerSmall(): void {
    this.loaderService.show({
      type: 'spinner',
      size: 'small',
      color: 'primary',
      text: 'Small Spinner Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  showSpinnerMedium(): void {
    this.loaderService.show({
      type: 'spinner',
      size: 'medium',
      color: 'primary',
      text: 'Medium Spinner Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  showSpinnerLarge(): void {
    this.loaderService.show({
      type: 'spinner',
      size: 'large',
      color: 'primary',
      text: 'Large Spinner Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // Dots Examples
  showDots(): void {
    this.loaderService.show({
      type: 'dots',
      size: 'medium',
      color: 'primary',
      text: 'Dots Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // Pulse Examples
  showPulse(): void {
    this.loaderService.show({
      type: 'pulse',
      size: 'medium',
      color: 'primary',
      text: 'Pulse Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // Bars Examples
  showBars(): void {
    this.loaderService.show({
      type: 'bars',
      size: 'medium',
      color: 'primary',
      text: 'Bars Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // Ripple Examples
  showRipple(): void {
    this.loaderService.show({
      type: 'ripple',
      size: 'medium',
      color: 'primary',
      text: 'Ripple Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // Skeleton Examples
  showSkeleton(): void {
    this.loaderService.show({
      type: 'skeleton',
      size: 'medium',
      color: 'primary',
      text: 'Skeleton Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // Color Examples
  showPrimaryColor(): void {
    this.loaderService.show({
      type: 'spinner',
      size: 'medium',
      color: 'primary',
      text: 'Primary Color Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  showSecondaryColor(): void {
    this.loaderService.show({
      type: 'spinner',
      size: 'medium',
      color: 'secondary',
      text: 'Secondary Color Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  showWhiteColor(): void {
    this.loaderService.show({
      type: 'spinner',
      size: 'medium',
      color: 'white',
      text: 'White Color Loading...',
      overlay: true
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  showLightColor(): void {
    this.loaderService.show({
      type: 'spinner',
      size: 'medium',
      color: 'light',
      text: 'Light Color Loading...'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // Full Screen Example
  showFullScreen(): void {
    this.loaderService.showFullScreen('Full Screen Loading...', {
      type: 'spinner',
      size: 'large',
      color: 'primary'
    });
    setTimeout(() => this.loaderService.hide(), 3000);
  }

  // Inline Examples
  showInlineSpinner(): void {
    this.loaderService.showInline({
      type: 'spinner',
      size: 'small',
      color: 'primary',
      text: 'Inline Spinner'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  showInlineDots(): void {
    this.loaderService.showInline({
      type: 'dots',
      size: 'small',
      color: 'primary',
      text: 'Inline Dots'
    });
    setTimeout(() => this.loaderService.hide(), 2000);
  }

  // HTTP Request Simulation
  simulateHttpRequest(): void {
    this.loaderService.showForRequest({
      type: 'spinner',
      size: 'medium',
      color: 'primary',
      text: 'Making API Request...'
    });
    
    // Simulate HTTP request
    setTimeout(() => {
      this.loaderService.hideForRequest();
    }, 2000);
  }
}
