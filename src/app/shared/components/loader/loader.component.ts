import { Component, Input, OnInit } from '@angular/core';

export type LoaderType = 'spinner' | 'dots' | 'pulse' | 'bars' | 'ripple' | 'skeleton';
export type LoaderSize = 'small' | 'medium' | 'large';
export type LoaderColor = 'primary' | 'secondary' | 'white' | 'light';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() type: LoaderType = 'spinner';
  @Input() size: LoaderSize = 'medium';
  @Input() color: LoaderColor = 'primary';
  @Input() text: string = '';
  @Input() overlay: boolean = false;
  @Input() fullScreen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  get loaderClasses(): string {
    return `loader loader-${this.type} loader-${this.size} loader-${this.color}`;
  }

  get overlayClasses(): string {
    return `loader-overlay ${this.fullScreen ? 'loader-fullscreen' : ''}`;
  }
}
