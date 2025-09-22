import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SensorGroupMappingFormComponent } from '../../modals/sensor-group-mapping-form/sensor-group-mapping-form.component';
import { ActionDropdownRendererComponent } from 'src/app/modules/customer-admin/components/action-dropdown-renderer/action-dropdown-renderer.component';
import { AppStateService } from 'src/app/shared/services/app-state.service';

@Component({
  selector: 'app-sensor-grouping',
  templateUrl: './sensor-grouping.component.html',
  styleUrls: ['./sensor-grouping.component.scss'],
})
export class SensorGroupingComponent implements OnInit {
  //sgm.id,d.deviceId,c.customer_name,sg.sensor_group_name,s.sensortype,d.devicemake, d.devicemodel,sgm.fine_amount,sgm.penalty,sgm.penalty_per,
  //sgm.frequency,sgm.frequency_per,sgm.warning,sgm.warning_per,sgm.reset_type,d.device_latitude,d.device_longitude
  columnDefs: ColDef[] = [
    { headerName: 'Id', field: 'id', sortable: true, filter: true ,hide:true},
    {
      headerName: 'Device ID',
      field: 'deviceId',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Customer Name',
      field: 'customer_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Sensor Group Name',
      field: 'sensor_group_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Sensor Type',
      field: 'sensortype',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Make',
      field: 'devicemake',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Model',
      field: 'devicemodel',
      sortable: true,
      filter: true,
    },

    {
      headerName: 'Fine Amount',
      field: 'fine_amount',
      sortable: true,
      filter: true,
    },
    { headerName: 'Penalty Percentage', field: 'penalty', sortable: true, filter: true },
    {
      headerName: 'Penalty Duration',
      field: 'penalty_per',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Frequency Count',
      field: 'frequency',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Frequency Duration',
      field: 'frequency_per',
      sortable: true,
      filter: true,
    },
    { headerName: 'Warning Count', field: 'warning', sortable: true, filter: true },
    {
      headerName: 'Warning Duration',
      field: 'warning_per',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Reset By',
      field: 'reset_type',
      sortable: true,
      filter: true,
    },
    { headerName: 'Latitude', field: 'device_latitude', sortable: true, filter: true },
    {
      headerName: 'Longitude',
      field: 'device_longitude',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Action',
      cellRenderer: ActionDropdownRendererComponent,
      suppressNavigable: true,
      suppressKeyboardEvent: () => true, // ✅ blocks keyboard for this cell
      cellRendererParams: {
        suppressDoubleClickEdit: true,
        staticLabel: 'sensorGrouping',
        onActionCompleted: (eventType: string, rowData: any) => {
          if (eventType === 'edit' || eventType === 'delete') {
            this.getSensorGroupMappings();
          }
        },
      },
      cellClass: 'no-select',
    },
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  rowData: any[] = [];

  pageSize = 10;
  pageSizeSelector = [10, 10, 20];
  private gridApi!: GridApi;

  constructor(
    private modalService: NgbModal,
    private customerAdminService: CustomerAdminService,
    private toastService: ToastService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.getSensorGroupMappings();
  }

  getSensorGroupMappings()
  {
    const obj={
      organization_id:this.appStateService.getUser().user.organization_id
    }
    this.customerAdminService.getSensorGroupMappings(obj).subscribe((res: any) => {
      this.rowData = res.data;
      console.log(this.rowData);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onQuickFilterChanged(event: any) {
    const filterValue = event.target.value;
    if (this.gridApi) {
      // this.getSensorGrouping(filterValue);
    } else {
      console.warn('Grid API not available yet.');
    }
  }

  onPaginationChanged() {
    // pagination logic if needed
  }

  openSensorGroupingModal(type: string, formData?: any) {
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');

    const modalRef = this.modalService.open(SensorGroupMappingFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'custom-modal-class modal-1024px',
    });

    modalRef.componentInstance.mode = type;
    modalRef.componentInstance.data = formData || null;

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          console.log('Sensor group created/updated.');
          this.getSensorGroupMappings();
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
