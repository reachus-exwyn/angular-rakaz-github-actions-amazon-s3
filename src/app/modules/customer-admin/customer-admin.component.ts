import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-admin',
  templateUrl: './customer-admin.component.html',
  styleUrls: ['./customer-admin.component.scss']
})
export class CustomerAdminComponent implements OnInit {

  selectedComponent = {
    link: 'dashboard',
    header: 'Dashboard'
  }; // default
  //selectedHeader = 'Dashboard'; // default
  constructor() { }

  ngOnInit(): void {
  }

 
  onSidebarSelection(link: any) {
    console.log(link);
    this.selectedComponent = link;
  
  
  }


}
