import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService, LoaderConfig } from '../../services/loader.service';

@Component({
  selector: 'app-global-loader',
  templateUrl: './global-loader.component.html',
  styleUrls: ['./global-loader.component.scss']
})
export class GlobalLoaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  config: LoaderConfig = {};
  
  private loadingSubscription?: Subscription;
  private configSubscription?: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.loaderService.loading$.subscribe(
      loading => this.isLoading = loading
    );
    
    this.configSubscription = this.loaderService.config$.subscribe(
      config => this.config = config
    );
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
    this.configSubscription?.unsubscribe();
  }
}
