import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationFormComponent } from '../../modals/configuration-form/configuration-form.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  selectedComponent = {
    link: '',
    header: ''
  };
  @Output() linkSelected = new EventEmitter<{link: string, header: string}>();
  activeState:string = '';  
  navLinks = [
    {
      icon: 'bi-person-badge',
      tooltip: 'Customer Admin Details',
      link: 'customer-admin-details',
      header: 'Customer Admin Details',
      active: 'active'
    },
    {
      icon: 'bi-sliders',
      tooltip: 'Sensor Parameter Management',
      link: 'sensor-parameter-management',
      header: 'Sensor Parameter Management',
      active: 'inactive'
    },
    {
      icon: 'bi-cpu',
      tooltip: 'Device Details',
      link: 'device-details',
      header: 'Device Details',
      active: 'inactive'
    },
    {
      icon: 'bi-diagram-3',
      tooltip: 'Device Mapping',
      link: 'device-mapping',
      header: 'Device Mapping',
      active: 'inactive'
    },
    {
      icon: 'bi-bar-chart-line',
      tooltip: 'Report',
      link: 'report',
      header: 'Report',
      active: 'inactive'
    }
  ];
  constructor(private modalService: NgbModal, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.selectedComponent = this.navLinks[0];
  }
  navigateTo(link: any) {
    this.linkSelected.emit({link: link.link, header: link.header});
    this.selectedComponent = link;  
    this.navLinks.forEach(item => {
      item.active = 'inactive';
      if(item.link === link.link){
        item.active = 'active';
      }
    });
    
  }

  openConfigurationModal(){
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');
  
    const modalRef = this.modalService.open(ConfigurationFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'custom-modal-class',
    });

    modalRef.result
      .then((result) => {
        console.log('Configuration modal closed with result:', result);
      })
      .catch((error) => {
        console.error('Configuration modal closed with error:', error);
      });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
