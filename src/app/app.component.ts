import { Component, OnInit } from '@angular/core';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rakaz-multi-modules-app';

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // Test toast on app initialization
    // setTimeout(() => {
    //   console.log('Testing toast from AppComponent...');
    //   this.toastService.showSuccess('App initialized successfully!', 'Welcome');
    // }, 1000);
  }
}
