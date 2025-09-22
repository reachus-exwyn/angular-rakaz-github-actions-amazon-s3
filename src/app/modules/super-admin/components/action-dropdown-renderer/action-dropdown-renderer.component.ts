import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAdminFormComponent } from '../../modals/customer-admin-form/customer-admin-form.component';
import { SuperAdminService } from '../../services/super-admin.service';
import Swal from 'sweetalert2';
import { DeviceFormComponent } from '../../modals/device-form/device-form.component';

export interface ActionDropdownRendererParams extends ICellRendererParams {
  staticLabel?: string;
  onActionCompleted?: (eventType: string, rowData: any) => void;
}

@Component({
  selector: 'app-action-dropdown-renderer',
  templateUrl: './action-dropdown-renderer.component.html',
  styleUrls: ['./action-dropdown-renderer.component.scss']
})

export class ActionDropdownRendererComponent{
  params!: ActionDropdownRendererParams;
  dropdownPlacement: 'top-start' | 'bottom-start' = 'top-start';
  constructor(private modalService: NgbModal, private superAdminService: SuperAdminService) {}
  agInit(params: ActionDropdownRendererParams): void {
    this.params = params;
  }
  onClick(event: MouseEvent): void {
    // Prevent AG Grid from closing or stealing focus
    event.stopPropagation();
  }
  refresh(): boolean {
    return false;
  }

  edit() {   
    console.log(this.params.staticLabel);
    switch(this.params.staticLabel){
      case 'customerAdmin':
        this.getCustomerAdminById(this.params);
        break;
      case 'device':
        this.getDeviceById(this.params);
        break;
    }
  }


  delete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this customer admin?',//'You will not be able to recover this record!',
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
        console.log('Delete confirmed for:', this.params.data);
        let obs = null;
        switch(this.params.staticLabel){
          case 'customerAdmin':
            obs = this.superAdminService.deleteCustomerAdmin(this.params.data.id);
            break;
          case 'device':
            obs = this.superAdminService.deleteDevice(this.params.data.id);
            break;
        }
        if(obs){
          obs.subscribe((res: any) => {
              if (res.success) {
                Swal.fire('Deleted!', 'The record has been deleted.', 'success');
                this.params.onActionCompleted?.('delete', this.params.data);
              }else{
                Swal.fire('Failed!', 'The record has not been deleted.', 'error');
              }
            });
        }        
      }
    });
  }
  
  openModal(type: 'edit', formData?: any,component: any = CustomerAdminFormComponent) {
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');

    const modalRef = this.modalService.open(component, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'custom-modal-class',
    });

    modalRef.componentInstance.mode = type;
    modalRef.componentInstance.data = formData || null;

    modalRef.result
      .then((result: any) => {
        if (result === 'saved') {
          console.log('Customer admin created/updated.');
          this.params.onActionCompleted?.('edit', this.params.data);
        }
        // Remove scroll lock
        document.body.classList.remove('modal-open-scroll-lock');
      })
      .catch(() => {
        // Remove scroll lock even on dismiss
        document.body.classList.remove('modal-open-scroll-lock');
      });
  }

  getCustomerAdminById(params: any){
    this.superAdminService.getCustomerAdminById(params.data.id).subscribe((res: any) => {
      console.log(res.data);      
     this.openModal('edit', res.data,CustomerAdminFormComponent);
    });

  }

  getDeviceById(params: any){
    this.superAdminService.getDeviceById(params.data.id).subscribe((res: any) => {
      console.log(res.data);      
     this.openModal('edit', res.data,DeviceFormComponent);
    });

  }
}
