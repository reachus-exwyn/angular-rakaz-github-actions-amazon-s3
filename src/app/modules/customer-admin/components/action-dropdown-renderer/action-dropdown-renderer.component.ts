import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerFormComponent } from '../../modals/customer-form/customer-form.component';
import { CustomerAdminService } from '../../services/customer-admin.service';
import Swal from 'sweetalert2';
import { SensorGroupMappingFormComponent } from '../../modals/sensor-group-mapping-form/sensor-group-mapping-form.component';
import { AppStateService } from 'src/app/shared/services/app-state.service';

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
  userId:any;
  constructor(private modalService: NgbModal, private customerAdminService: CustomerAdminService, private appStateService: AppStateService) {
    this.userId = this.appStateService.getUser().user.id;
  }
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
      case 'sensorGrouping':
        this.getSensorGroupMappingById(this.params);
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
            obs = this.customerAdminService.deleteCustomer(this.params.data.id);
            break;
          case 'device':
            obs = this.customerAdminService.deleteCustomer(this.params.data.id);
            break;
          case 'sensorGrouping':
            const obj = {
              deleted_by:this.userId
            }
            obs = this.customerAdminService.deleteSensorGroupMapping(this.params.data.id,obj);
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
  
  openModal(type: 'edit', formData?: any,component: any = CustomerFormComponent) {
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
    this.customerAdminService.getCustomerById(params.data.id).subscribe((res: any) => {
      console.log(res.data);      
     this.openModal('edit', res.data,CustomerFormComponent);
    });

  }

  getDeviceById(params: any){
    this.customerAdminService.getCustomerById(params.data.id).subscribe((res: any) => {
      console.log(res.data);      
     this.openModal('edit', res.data,CustomerFormComponent);
    });

  }

  getSensorGroupMappingById(params: any){
    this.customerAdminService.getSensorGroupMappingById(params.data.id).subscribe((res: any) => {
      console.log(res.data);      
     this.openModal('edit', res.data,SensorGroupMappingFormComponent);
    });
  }
}
