import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { ConfigurationFormComponent } from '../../modals/configuration-form/configuration-form.component';

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
      icon: 'bi-speedometer2',
      tooltip: 'Dashboard',
      link: 'dashboard',
      header: 'Dashboard',  
      active: 'active'
    },
    {
      icon: 'bi-people',
      tooltip: 'Customer Details',
      link: 'customer-details',
      header: 'Customer Details',
      active: 'inactive'
    },
    {
      icon: 'bi-sliders',
      tooltip: 'Sensor Group Management',
      link: 'sensor-group',
      header: 'Sensor Group Management',
      active: 'inactive'
    },
    {
      icon: 'bi-diagram-3',
      tooltip: 'Sensor Group Mapping',
      link: 'sensor-grouping',
      header: 'Sensor Group Mapping',
      active: 'inactive'
    },
    {
      icon: 'bi-journal-check',
      tooltip: 'Subscription',
      link: 'subscriptions',
      header: 'Subscription',
      active: 'inactive'
    },
    {
      icon: 'bi-credit-card-2-front',
      tooltip: 'Payment Details',
      link: 'payment-details',
      header: 'Payment Details',
      active: 'inactive'
    },
    {
      icon: 'bi-bar-chart-line',
      tooltip: 'Reports',
      link: 'reports',
      header: 'Reports',
      active: 'inactive'
    }
   
  ];

  bottomNavLinks = [
    { icon: 'bi-gear', tooltip: 'Configuration', link: 'configuration' , active: 'inactive' , header: 'Configuration', isRouterLink: false},
    { icon: 'bi-bell', tooltip: 'Notification', link: 'notification' , active: 'inactive' , header: 'Notification', isRouterLink: true},
    { icon: 'bi-person-circle', tooltip: 'Profile', link: 'profile' , active: 'inactive' , header: 'Profile', isRouterLink: true  }
  ];

  constructor(private modalService: NgbModal, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.selectedComponent = this.navLinks[0];
  }
  navigateTo(link: any) {
    console.log(link);
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
