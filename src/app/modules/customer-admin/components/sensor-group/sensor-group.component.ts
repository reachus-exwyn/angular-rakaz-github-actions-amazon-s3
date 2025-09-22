import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { SensorGroupFormComponent } from '../../modals/sensor-group-form/sensor-group-form.component';
import { AppStateService } from 'src/app/shared/services/app-state.service';
import { ColDef } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sensor-group',
  templateUrl: './sensor-group.component.html',
  styleUrls: ['./sensor-group.component.scss']
})
export class SensorGroupComponent implements OnInit {

  customerId: any;
  sensorGroups: any[] = [];
  sensorParameters: any[] = [];
  selectedSensor: any;
  //ag-grid
  pageSize = 10; // or bind this from user selection
  pageSizeSelector = [10, 20, 50, 100];
  rowHeight = 40; // default row height (or whatever you use)
  gridApi!: GridApi<any>;
  sensorGroupsList: any[] = [];
  columnDefs: ColDef[] = [
    { field: 'sensor_parameter_name', headerName: 'Parameter' },
    { field: 'unit', headerName: 'Units' },
    { field: 'min_threshold_limit', headerName: 'Min Threshold Limit' },
    { field: 'max_threshold_limit', headerName: 'Max Threshold Limit' }
  ];
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  rowData: any[] = [];
  selectedSensorGroup: any;
  constructor(private modalService: NgbModal, private customerAdminService: CustomerAdminService, private toastService: ToastService, private appStateService: AppStateService) {}
  ngOnInit(): void {
    this.getSensorGroups();
    this.customerId = this.appStateService.getUser().user.id;
  }

  getSensorGroups() {
    const obj={
      organization_id:this.appStateService.getUser().user.organization_id
    }
    this.customerAdminService.getSensorGroups(obj).subscribe((res: any) => {
      console.log(res);
      this.sensorGroups = res.data;
      this.sensorGroupsList = this.sensorGroups;
    });
  }

  openSensorGroupModal(type: 'create' | 'edit', formData?: any){
    // Add scroll lock class to body
   document.body.classList.add('modal-open-scroll-lock');
  
   const modalRef = this.modalService.open(SensorGroupFormComponent, {
     centered: true,
     backdrop: 'static',
     size: 'lg',
     windowClass: 'custom-modal-class modal-1024px',
   });
 
   console.log(formData);

   modalRef.componentInstance.mode = type;
   modalRef.componentInstance.data = formData || null;
 
   modalRef.result
     .then((result) => {
       if (result === 'saved') {
         console.log('Sensor created/updated.');
        this.getSensorGroups();
       }
       // Remove scroll lock
       document.body.classList.remove('modal-open-scroll-lock');
     })
     .catch(() => {
       // Remove scroll lock even on dismiss
       document.body.classList.remove('modal-open-scroll-lock');
     });
  }

  searchParameter(event: any) {
    const searchValue = event.target.value;    
    this.sensorParameters = this.selectedSensor.parameters.filter((parameter: any) => parameter.sensor_parameter_name.toLowerCase().includes(searchValue.toLowerCase()));
    this.rowData = this.sensorParameters;
    this.gridApi.setRowCount(this.rowData.length);
  }
  onPaginationChanged() {
    if (!this.gridApi) return;

    const currentPageSize = this.gridApi.paginationGetPageSize();
    const rowCount = this.gridApi.paginationGetRowCount();
    const rowsOnCurrentPage = Math.min(currentPageSize, rowCount);

    const baseRowCount =
      currentPageSize >= 20 ? currentPageSize + 10 : currentPageSize;
    const newHeight = baseRowCount * this.rowHeight + 100; // +100 for header, footer, etc.

    const gridDiv = document.querySelector('.ag-rakz-custom') as HTMLElement;
    if (gridDiv) {
      gridDiv.style.height = `${newHeight}px`;
    }
  }

  openViewModal(modal: TemplateRef<any>, sensor: any) {
    this.selectedSensor = sensor;
    this.selectedSensorGroup = sensor.sensor_group_name;
    this.sensorParameters = sensor.parameters;
    this.rowData = this.sensorParameters.sort((a: any, b: any) => a.id - b.id);
    //this.gridApi.setRowCount(this.rowData.length);
    this.modalService.open(modal, { centered: true, backdrop: 'static', size: 'lg', windowClass: 'custom-modal-class modal-900px' });
  } 

  deleteSensorGroup(sensor: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this sensor group?',//'You will not be able to recover this record!',
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
        console.log('Delete confirmed for:', sensor);
        let obs = null;
        let body = {modified_by:this.customerId};
        obs = this.customerAdminService.deleteSensorGroup(body,sensor.id);
        if(obs){
          obs.subscribe((res: any) => {
              if (res.success) {
                Swal.fire('Deleted!', 'The sensor group has been deleted.', 'success');
                this.getSensorGroups();
              }else{
                Swal.fire('Failed!', 'The sensor group has not been deleted.', 'error');
              }
            });
        }        
      }
    });
  }

  searchSensorGroup(event: any) {
    const searchValue = event.target.value;
    this.sensorGroups = this.sensorGroupsList.filter((sensor: any) => sensor.sensor_group_name.toLowerCase().includes(searchValue.toLowerCase()));
  }

}
