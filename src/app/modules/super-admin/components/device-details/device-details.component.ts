import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { ActionDropdownRendererComponent } from '../action-dropdown-renderer/action-dropdown-renderer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAdminFormComponent } from '../../modals/customer-admin-form/customer-admin-form.component';
import { HttpClient } from '@angular/common/http';
import { deviceTableData } from './device-details-table';
import { DeviceFormComponent } from '../../modals/device-form/device-form.component';
import { SuperAdminService } from '../../services/super-admin.service';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {
  pageSize = 10; // or bind this from user selection
  pageSizeSelector = [10, 20, 50, 100];
  rowHeight = 40; // default row height (or whatever you use)
  gridApi!: GridApi<any>;
  
    columnDefs: ColDef[] = [
      {field:'id', headerName:'ID', hide:true},
      { field: 'deviceId', headerName: 'Device ID' },
      { field: 'deviceName', headerName: 'Device Name' },
      { field: 'customerAdminName', headerName: 'Customer Admin Name' },
      { field: 'sensorType', headerName: 'Sensor Type' },
      { field: 'devicemake', headerName: 'Device Make' },
      { field: 'devicemodel', headerName: 'Device Model' },      
      { field: 'status', headerName: 'Status'},
      {
        headerName: 'Action',
        cellRenderer: ActionDropdownRendererComponent,
        suppressNavigable: true,
        suppressKeyboardEvent: () => true, // ✅ blocks keyboard for this cell
        cellRendererParams: {
          suppressDoubleClickEdit: true,
          staticLabel: 'device',
          onActionCompleted: (eventType: string, rowData: any) => {
            if (eventType === 'edit' || eventType === 'delete') {
              this.getDevices();
            }
          }
        },
        cellClass: 'no-select'
      }
    ];
    defaultColDef = {
      sortable: true,
      filter: false,
      resizable: true
    };
    
    rowData: any[] = [];
    
    
    constructor(private http: HttpClient, private modalService: NgbModal, private superAdminService: SuperAdminService) {}
    ngOnInit(): void {
     // this.rowData = deviceTableData;
     this.getDevices();
    } 

    getDevices(search: string = '') {
      const data = {
        page: 1,
        search: search,
      };
      this.superAdminService.getDevices(data).subscribe((res: any) => {
        if (res.results.data.length > 0) {
          this.rowData = res.results.data.map((item: any) => ({
            id: item.id,
            deviceId: item.deviceId,
            deviceName: item.deviceName,
            customerAdminName: item.customer_admin_name?item.customer_admin_name:'--',
            sensorType: item.sensor_type_name,
            devicemake: item.devicemake,
            devicemodel: item.devicemodel,
            status: item.customer_admin_name?'Assigned':'Unassigned',
          }));
  
          this.gridApi.setRowCount(this.rowData.length); 
          //this.gridApi.setColumnsVisible(['status'],false);       
        }
      });
    }

    onGridReady(params: any) {
      this.gridApi = params.api;
    
      // Wait a tick to let DOM render
      setTimeout(() => {
        document.querySelectorAll('.edit-action').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const rowNode = this.getRowFromElement(el);
            console.log('Edit clicked for row', rowNode?.data);
          });
        });
    
        document.querySelectorAll('.delete-action').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const rowNode = this.getRowFromElement(el);
            console.log('Delete clicked for row', rowNode?.data);
          });
        });
      }, 0);
    }
     // Helper to trace back row data
  getRowFromElement(element: Element): any {
    const rowEl = element.closest('.ag-row') as HTMLElement;
    const rowIndex = rowEl?.getAttribute('row-index');
    return this.gridApi?.getDisplayedRowAtIndex(Number(rowIndex));
  }
  
  
  
  onQuickFilterChanged(event: any) {
    const filterValue = event.target.value;
    const gridApi = (document.querySelector('ag-grid-angular') as any)?.api;
    if (gridApi) {
      gridApi.setQuickFilter(filterValue);
    }
  }

  onPaginationChanged() {
    if (!this.gridApi) return;
  
    const currentPageSize = this.gridApi.paginationGetPageSize();
    const rowCount = this.gridApi.paginationGetRowCount();
    const rowsOnCurrentPage = Math.min(currentPageSize, rowCount);
  
    const baseRowCount = currentPageSize >= 20 ? currentPageSize + 10 : currentPageSize;
    const newHeight = baseRowCount * this.rowHeight + 100; // +100 for header, footer, etc.
  
    const gridDiv = document.querySelector('.ag-rakz-custom') as HTMLElement;
    if (gridDiv) {
      gridDiv.style.height = `${newHeight}px`;
    }
  }
  openDeviceModal(type: 'create' | 'edit', formData?: any) {
     // Add scroll lock class to body
     document.body.classList.add('modal-open-scroll-lock');
  
     const modalRef = this.modalService.open(DeviceFormComponent, {
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
          this.getDevices();
           console.log('Device created/updated.');
         }
         // Remove scroll lock
         document.body.classList.remove('modal-open-scroll-lock');
       })
       .catch(() => {
         // Remove scroll lock even on dismiss
         document.body.classList.remove('modal-open-scroll-lock');
       });
  }
}
