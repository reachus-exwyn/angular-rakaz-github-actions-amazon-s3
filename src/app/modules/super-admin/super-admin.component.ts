import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {
  selectedComponent = {
    link: 'customer-admin-details',
    header: 'Customer Admin Details'
  }; // default
  //selectedHeader = 'Customer Admin Details'; // default
  constructor() { }

  ngOnInit(): void {
  }

 
  onSidebarSelection(link: any) {
    console.log(link);
   
    this.selectedComponent = link;
  
  
  }



}
