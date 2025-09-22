import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @Input() selectedComponent: any = {
    link: '',
    header: ''
  };
  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedComponent);
  }
}