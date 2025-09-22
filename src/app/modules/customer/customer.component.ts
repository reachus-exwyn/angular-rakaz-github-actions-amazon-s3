import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  selectedComponent = {
    link: 'dashboard',
    header: 'Hi Saeed'
  }; // default

  constructor() {
  }

  ngOnInit(): void {
  }

  onSidebarSelection(link: any) {
    console.log(link);
    this.selectedComponent = link;
  }

}
