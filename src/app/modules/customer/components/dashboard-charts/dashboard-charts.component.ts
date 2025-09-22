import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.scss']
})
export class DashboardChartsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  @Input() chartOptions: Highcharts.Options = {};
  @Input() chartType!: 'area' | 'column' | 'pie' | 'bar';
  constructor() {}

  ngOnInit(): void {} 
}


