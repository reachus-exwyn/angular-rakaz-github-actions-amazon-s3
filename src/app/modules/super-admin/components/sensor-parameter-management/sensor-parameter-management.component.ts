import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SensorFormComponent } from '../../modals/sensor-form/sensor-form.component';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ColDef, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-sensor-parameter-management',
  templateUrl: './sensor-parameter-management.component.html',
  styleUrls: ['./sensor-parameter-management.component.scss']
})
export class SensorParameterManagementComponent implements OnInit {
  sensorList: any[] = [];
  sensors: any[] = [];
  sensorParameters: any[] = [];
  selectedSensor: any;


  //ag-grid
  pageSize = 10; // or bind this from user selection
  pageSizeSelector = [10, 20, 50, 100];
  rowHeight = 40; // default row height (or whatever you use)
  gridApi!: GridApi<any>;

  columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Parameter' },
    { field: 'unit', headerName: 'Units' },
    { field: 'min_threshold', headerName: 'Min Threshold Limit' },
    { field: 'max_threshold', headerName: 'Max Threshold Limit' },
    { field: 'index_start', headerName: 'Index Start' },
    { field: 'index_end', headerName: 'Index End' },
    { field: 'parameter_length', headerName: 'Parameter Length' }
  ];
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  rowData: any[] = [];


  constructor(private modalService: NgbModal, private superAdminService: SuperAdminService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getSensors();
  }

  getSensors() {
    this.superAdminService.getSensors().subscribe((res: any) => {
      if(res.success) {
        this.sensors = res.data.map((sensor: any) => ({
          id: sensor.id,
          name: sensor.sensortype,
          image: sensor.sensortype === 'Noise' ? 'assets/noise-img.jpg' : sensor.sensortype === 'Water' ? 'assets/water-img.jpg' : sensor.sensortype === 'Air' ? 'assets/air-img.jpg' : 'assets/other-img.jpg',
          icon: sensor.sensortype === 'Noise' ? 'assets/noise-icon.png' : sensor.sensortype === 'Water' ? 'assets/water-icon.jpg' : sensor.sensortype === 'Air' ? 'assets/air-icon.jpg' : 'assets/other-icon.jpg',
          parameters: sensor.parameters.map((parameter: any) => ({
            id: parameter.id,
            name: parameter.sensorParameter,
            unit: parameter.unit,
            min_threshold: parameter.min_threshold_limit,
            max_threshold: parameter.max_threshold_limit,
            index_start: parameter.index_start,
            index_end: parameter.index_end,
            parameter_length: parseInt(parameter.index_end) - parseInt(parameter.index_start)
          }))
        }));

        this.sensorList = this.sensors;
        
      }else{
        this.toastService.showError(res.message);
      }
    });
  }

  searchSensor(event: any) {
    const searchValue = event.target.value;
    this.sensors = this.sensorList.filter((sensor: any) => sensor.name.toLowerCase().includes(searchValue.toLowerCase()));
  }

  openSensorModal(type: 'create' | 'edit', formData?: any) {
   // Add scroll lock class to body
   document.body.classList.add('modal-open-scroll-lock');
  
   const modalRef = this.modalService.open(SensorFormComponent, {
     centered: true,
     backdrop: 'static',
     size: 'lg',
     windowClass: 'custom-modal-class ',
   });
 
   modalRef.componentInstance.mode = type;
   modalRef.componentInstance.data = formData || null;
 
   modalRef.result
     .then((result) => {
       if (result === 'saved') {
         console.log('Sensor created/updated.');
         this.getSensors();
       }
       // Remove scroll lock
       document.body.classList.remove('modal-open-scroll-lock');
     })
     .catch(() => {
       // Remove scroll lock even on dismiss
       document.body.classList.remove('modal-open-scroll-lock');
     });
  }

  openViewModal(modal: TemplateRef<any>, sensor: any) {
    this.selectedSensor = sensor;
    this.sensorParameters = sensor.parameters;
    this.rowData = this.sensorParameters.sort((a: any, b: any) => a.id - b.id);
    //this.gridApi.setRowCount(this.rowData.length);
    this.modalService.open(modal, { centered: true, backdrop: 'static', size: 'lg', windowClass: 'custom-modal-class modal-900px' });
  }

  searchParameter(event: any) {
    const searchValue = event.target.value;    
    this.sensorParameters = this.selectedSensor.parameters.filter((parameter: any) => parameter.name.toLowerCase().includes(searchValue.toLowerCase()));
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

}
