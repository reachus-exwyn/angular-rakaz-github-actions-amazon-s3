import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sensorTypes:any[] = [
    { id: 1, name: 'Air' },
    { id: 2, name: 'Water' },
    { id: 3, name: 'Temperature' },
    { id: 4, name: 'Humidity' }
  ];
  
  selectedSensorTypes: any[] = [1]; // Default selected "Air"

  customers = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Fahed' },
    { id: 2, name: 'Ahmed' },
    { id: 3, name: 'Mohamed' },
    { id: 4, name: 'Ali' },
    { id: 5, name: 'Omar' },
    { id: 6, name: 'Yousef' },
    { id: 7, name: 'Ahmed' } // duplicate from your list
  ];
  
  selectedCustomers: number[] = [1]; // Default selected "Fahed"

  groupedDeviceIds = [
    { id: 2324, name: '2324', group: 'Group A' },
    { id: 2325, name: '2325', group: 'Group A' },
    { id: 3001, name: '3001', group: 'Group B' },
    { id: 3002, name: '3002', group: 'Group B' },
    { id: 4001, name: '4001', group: 'Group C' }
  ];
  
  selectedDeviceIds: number[] = []; // Default none selected

  
  model: NgbDateStruct | undefined;
  tipContent = 'I am a tooltip';
  constructor() { }

  ngOnInit(): void {
  }

}
