import { Component } from '@angular/core';
import { SubscriptionFormComponent } from '../../modals/subscription-form/subscription-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { AppStateService } from '../../../../shared/services/app-state.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent{
  subscriptions: any[] = [];
  userId:number=0;
  organizationId:number=0;
  constructor(private modalService: NgbModal, private customerAdminService: CustomerAdminService, private appStateService: AppStateService) {


  }

  ngOnInit(): void {
    this.userId = this.appStateService.getUser().user.id;
    this.organizationId = this.appStateService.getUser().user.organization_id;
    this.getSubscriptions();
  }

  getSubscriptions() {
    this.customerAdminService.getSubscriptions({
        customer_id: this.appStateService.getUser().user?.id, 
        organization:this.appStateService.getUser().user.organization_id
    }).subscribe((res: any) => {
      this.subscriptions = res.data;
    });
  }

  openSubscriptionModal(type: 'create' | 'edit', formData?: any) {
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');

    const modalRef = this.modalService.open(SubscriptionFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'custom-modal-class',
    });

    modalRef.componentInstance.mode = type;
    modalRef.componentInstance.data = formData || null;

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          console.log('Subscription created/updated.');
          this.getSubscriptions();
        }
        // Remove scroll lock
        document.body.classList.remove('modal-open-scroll-lock');
      })
      .catch(() => {
        // Remove scroll lock even on dismiss
        document.body.classList.remove('modal-open-scroll-lock');
      });
  }

  deleteSubscription(subscription: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this subscription?',//'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      customClass: {
        popup: 'custom-swal',
        confirmButton: 'swal2-confirm ',
        cancelButton: 'swal2-cancel',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // 👉 Replace this with your actual delete API call
        console.log('Delete confirmed for:', subscription);
        let body = {
          id: subscription.id,
          modified_by: this.appStateService.getUser().user.id
        }
        let obs = this.customerAdminService.deleteSubscription(body);
        
        if(obs){
          obs.subscribe((res: any) => {
              if (res.success) {
                Swal.fire('Deleted!', 'The record has been deleted.', 'success');
                this.getSubscriptions();
              }else{
                Swal.fire('Failed!', 'The record has not been deleted.', 'error');
              }
            });
        }        
      }
    });
  }
}
