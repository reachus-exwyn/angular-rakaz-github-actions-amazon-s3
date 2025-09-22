import { Component, inject, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
//import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  model: NgbDateStruct | undefined;
  tipContent = 'I am a tooltip';
  selectedParameter: string = 'Pm25';
  parameterList: string[] = ['Pm25', 'Pm10', 'NO2'];
  recentReadings = [
  { name: 'Ozone', value: 145, max: 100 },
  { name: 'SulfurDioxide', value: 54, max: 40 },
  { name: 'Nitrogendioxide', value: 43, max: 25 },
  { name: 'Pm10', value: 43, max: 45 },
  { name: 'Pm25', value: 43, max: 45 }
];
parameterChartOptions: { [key: string]: Highcharts.Options } = {
  Pm25: {
    chart: { type: 'area', backgroundColor: 'transparent' },
    title: { text: '' },
    xAxis: {
      categories: ['25 Mar', '26 Mar', '27 Mar', '28 Mar', '29 Mar', '30 Mar', '31 Mar', '1 Apr'],
      title: { text: 'Dates' }
    },
    yAxis: {
      title: { text: 'Values' },
      min: 0,
      max: 30
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>Pm25 Reading: <b>${this.y}</b>`;
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
      area: {
        marker: { enabled: true, radius: 3 },
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(100, 160, 255, 0.5)'],
            [1, 'rgba(255,255,255,0)']
          ]
        }
      }
    },
    series: [{
      type: 'area',
      name: 'Pm25 Reading',
      color: '#4652f1',
      data: [13, 20, 19, 18, 17, 16, 19, 18]
    }]
  },

  Pm10: {
    chart: { type: 'area', backgroundColor: 'transparent' },
    title: { text: '' },
    xAxis: {
      categories: ['25 Mar', '26 Mar', '27 Mar', '28 Mar', '29 Mar', '30 Mar', '31 Mar', '1 Apr'],
      title: { text: 'Dates' }
    },
    yAxis: {
      title: { text: 'Values' },
      min: 0,
      max: 30
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>Pm25 Reading: <b>${this.y}</b>`;
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
      area: {
        marker: { enabled: true, radius: 3 },
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(100, 160, 255, 0.5)'],
            [1, 'rgba(255,255,255,0)']
          ]
        }
      }
    },
    series: [{
      type: 'area',
      name: 'Pm25 Reading',
      color: '#4652f1',
      data: [22, 24, 20, 18, 19, 21, 20, 23]
    }]
  },

  NO2: {
chart: { type: 'area', backgroundColor: 'transparent' },
    title: { text: '' },
    xAxis: {
      categories: ['25 Mar', '26 Mar', '27 Mar', '28 Mar', '29 Mar', '30 Mar', '31 Mar', '1 Apr'],
      title: { text: 'Dates' }
    },
    yAxis: {
      title: { text: 'Values' },
      min: 0,
      max: 30
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>Pm25 Reading: <b>${this.y}</b>`;
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    plotOptions: {
      area: {
        marker: { enabled: true, radius: 3 },
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(100, 160, 255, 0.5)'],
            [1, 'rgba(255,255,255,0)']
          ]
        }
      }
    },
    series: [{
      type: 'area',
      name: 'Pm25 Reading',
      color: '#4652f1',
      data: [8, 15, 11, 13, 12, 14, 10, 1]
    }]
  }
};
warningDetailsChartOptions: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Warning Details' },
  xAxis: {
    categories: [
      '26/03/2025, 07:13:47 PM',
      '29/03/2025, 02:41:33 AM',
      '01/04/2025, 07:40:47 PM'
    ],
    title: { text: 'Date' }
  },
  yAxis: {
    min: 0,
    title: { text: 'No of Warning' }
  },
  tooltip: {
    formatter: function () {
      return `<b>${this.x}</b><br/>No of Warnings: <b>${this.y}</b>`;
    }
  },
  series: [{
    type: 'column',
    name: 'No of Warnings',
    color: '#5040B6',
    data: [3, 4, 4]
  }]
};
breachedParameterChartOptions: Highcharts.Options = {
  chart: { type: 'pie' },
  title: { text: 'Breached Parameter' },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: { enabled: false },
      showInLegend: true
    }
  },
  series: [{
    type: 'pie',
    name: 'Breached',
    data: [
      ['Nitrogendioxide', 10],
      ['Pm25', 12],
      ['Biochemical', 5],
      ['Pm10', 8],
      ['Ph', 3],
      ['Phosphate', 4],
      ['TDS', 6],
      ['DO', 7],
      ['SulfurDioxide', 5],
      ['Nitrate', 2],
      ['Ozone', 6]
    ]
  }]
};

today = inject(NgbCalendar).getToday();


	date: { year: number; month: number } = { year: 0, month: 0 };
  ngOnInit(): void {
    this.model = this.today;
  }

  getBarWidth(param: { value: number; max: number }): number {
    return Math.min((param.value / param.max) * 100, 100);
  }

}
