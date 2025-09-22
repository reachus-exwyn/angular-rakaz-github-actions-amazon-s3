import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import * as dayjs from 'dayjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SuperAdminService } from '../../services/super-admin.service';
import { GridApi } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import { ActionDropdownRendererComponent } from '../action-dropdown-renderer/action-dropdown-renderer.component';
import { ShareReportComponent } from '../../modals/share-report/share-report.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @ViewChild('picker', { static: false }) picker!: DaterangepickerDirective;
  @ViewChild('viewDeviceParameterModal', { static: true }) viewDeviceParameterModal!: TemplateRef<any>;
  @ViewChild('viewDeviceParameterModal', { static: true }) modalTemplate!: TemplateRef<any>;
  reportForm: FormGroup;
  alwaysShowCalendars: boolean = false;
  reportTypes: { id: number; reporttype: string,selected:boolean }[] = [
    { id: 0, reporttype: 'Select Report Type',selected:false },
    { id: 1, reporttype: 'Device Report',selected:true },
    { id: 2, reporttype: 'Customer Admin Report',selected:false },
    { id: 3, reporttype: 'Audit Logs',selected:false },
  ];
  selectedReportType: any;
  selected: any = null; // model for date range picker
  startDate: string = '';
  endDate: string = '';
  formSubmitted = false;
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
  };
  invalidDates: moment.Moment[] = [
    moment().add(2, 'days'),
    moment().add(3, 'days'),
    moment().add(5, 'days'),
  ];
  customerAdmins: { id: number; customer_admin_name: string }[] = [];
  selectedCustomerAdmin: any;
  pageSize = 10; // or bind this from user selection
  pageSizeSelector = [10, 20, 50, 100];
  rowHeight = 40; // default row height (or whatever you use)
  gridApi!: GridApi<any>;

  columnDefs: ColDef[] = [];
  columnDefsParameter: ColDef[] = [];
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  rowData: any[] = [];
  SearchPlaceHolder: string = 'Search';
  deviceInterval: any;
  customerAdminInterval: any;
  parameters:any[] = [];
  sensorParameters: any[] = [];
  rowDataParameter: any[] = [];
  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private modalService: NgbModal
  ) {
    this.reportForm = this.fb.group({
      reportType: [''],
      customerAdmin: [''],
      dateRange: [''],
    });
  }
  ngOnInit(): void {
    this.getCustomerAdmins();
  }

  openDatePicker() {
    this.picker.open();
  }

  onInputChange(event: any) {
    console.log('', event.target.value);
    // Check if the input field is empty (or value is cleared)
    if (!event.target.value) {
      this.selected = null; // Reset the date range
      delete this.selected.range;
    }
  }

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };

  // Method triggered on datesUpdated event
  updateDateRange(event: any) {
    if (event.startDate && event.endDate) {
      this.startDate = event.startDate.format('YYYY-MM-DD HH:mm:ss');
      this.endDate = event.endDate.format('YYYY-MM-DD HH:mm:ss');
    }
  }

  getCustomerAdmins(search: string = '') {
    let data = {
      page: 1,
      limit: 1000,
      search: search,
    };
    this.superAdminService
      .getCustomerAdminsForReport(data)
      .subscribe((res: any) => {
        this.customerAdmins = [
          { id: 0, customer_admin_name: 'All' },
          ...res.results.data,
        ];
      });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    // Wait a tick to let DOM render
    setTimeout(() => {
      document.querySelectorAll('.edit-action').forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const rowNode = this.getRowFromElement(el);
          console.log('Edit clicked for row', rowNode?.data);
        });
      });

      document.querySelectorAll('.delete-action').forEach((el) => {
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
    if (this.gridApi) {
      if(this.selectedReportType == 1) {
        this.getDevicesReport(filterValue);
      } else if(this.selectedReportType == 2) {
        this.getCustomerAdminReport(filterValue);
      }
    } else {
      console.warn('Grid API not available yet.');
    }
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

  onSubmit(event: Event) {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;
    const action = submitter?.value;
    let data: {
      start_date?: string;
      end_date?: string;
      reportType: number;
      customer_id?: number;
      page?: number;
      limit?: number;
    }={
      reportType: this.reportForm.value['reportType'],
      page: 1,
      limit: 100,
    }
    if (action == 'save') {
      if (
        this.reportForm.value['dateRange'].startDate &&
        this.reportForm.value['dateRange'].endDate
      ) {
        const startDate = dayjs(
          this.reportForm.value['dateRange'].startDate
        ).format('YYYY-MM-DD HH:mm:ss');
        const endDate = dayjs(
          this.reportForm.value['dateRange'].endDate
        ).format('YYYY-MM-DD HH:mm:ss');    
       
        data['start_date'] = startDate;
        data['end_date'] = endDate;
      }

      

      if(this.selectedReportType == 1 || this.selectedReportType == 3) {
        
        if (this.reportForm.value['customerAdmin'] != 0) {
          data['customer_id'] = this.reportForm.value['customerAdmin'];
        }
      }
    
     let apiCall:any;

     switch(this.selectedReportType) {
      case 1:
        apiCall = this.superAdminService.getDevicesReport(data);
        break;
      case 2:
        apiCall = this.superAdminService.getCustomerAdminReport(data);
        break;
      case 3:
        //apiCall = this.superAdminService.getAuditLogs(data);
        break;
     }
      apiCall.subscribe((res: any) => {
        console.log(res);
        this.rowData = res.result.data;
        this.gridApi.setRowCount(this.rowData.length);
      });

    } else if (action == 'share') {
      console.log('share');
      this.openShareReportComponentModal();
    }
  }

  getCustomerAdminReport(filterValue: string) {
    let data = {
      page: 1,
      limit: 100,
      search: filterValue,
    };
    this.superAdminService.getCustomerAdminReport(data).subscribe((res: any) => {
      console.log(res);
      this.rowData = res.result.data;
      this.gridApi.setRowCount(this.rowData.length);
    });
  }
  getDevicesReport(filterValue: string) {
    let data = {
      page: 1,
      limit: 100,
      search: filterValue,
    };  
    this.superAdminService.getDevicesReport(data).subscribe((res: any) => {
      console.log(res);
      this.rowData = res.result.data;
      this.gridApi.setRowCount(this.rowData.length);
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reportForm.get(field);
    return !!(
      control &&
      (control.touched || this.formSubmitted) &&
      control.invalid
    );
  }

  hideAdminsAndDatePicker() {
    console.log(this.selectedReportType);
    clearInterval(this.deviceInterval);
    clearInterval(this.customerAdminInterval);
    const devicePlaceholders: string[] = [
      'Search by Device ID',
      'Search by Customer Admin Name',
      'Search by Device Name',
      'Search by Sensor Type',
      'Search by Device Model',
      'Search by Device Make',
    ];

    const customerAdminPlaceholders: string[] = [
      'Search by Customer Admin Name',
      'Search by Customer Admin ID',
      'Search by Customer Admin Type',
      'Search by Organization Name',
      'Search by Contact Person Name',
    ];
    switch(this.selectedReportType) {      
      case 1:       
        this.deviceInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * devicePlaceholders.length);
        this.SearchPlaceHolder = devicePlaceholders[randomIndex];
      }, 2000);
        this.columnDefs = [
          { field: 'deviceId', headerName: 'Device ID' },
          { field: 'customer_admin_name', headerName: 'Customer Admin Name' },
          { field: 'deviceName', headerName: 'Device Name' },
          { field: 'sensor_type_name', headerName: 'Sensor Type' },
          { field: 'devicemodel', headerName: 'Device Model' },
          { field: 'devicemake', headerName: 'Device Make' },
          { field: 'Status', headerName: 'Status' },
          {
            headerName: 'Action',
            width: 80,
            cellRenderer: (params: any) => {
              const span = document.createElement('span');
              span.innerHTML = `<i class="bi bi-eye" style="cursor:pointer; font-size:18px; color:#4725a7 !important;"></i>`;
              span.addEventListener('click', () => {
                this.columnDefsParameter= [
                  { field: 'parameter', headerName: 'Sensor Measure'},
                  { field: 'min_threshold', headerName: 'Min Threshold Limit' },
                  { field: 'max_threshold', headerName: 'Max Threshold Limit' },
                ]
                this.parameters = JSON.parse(params.data.parameters);
                this.sensorParameters = this.parameters;
                this.rowDataParameter = this.parameters;
                console.log(this.rowDataParameter);
                this.openViewDeviceParameterModal();
              });
              return span;
            },
            cellClass: 'no-select',
          },
        ];
        break;
      case 2:
        this.customerAdminInterval = setInterval(() => {
          const randomIndex = Math.floor(Math.random() * customerAdminPlaceholders.length);
          this.SearchPlaceHolder = customerAdminPlaceholders[randomIndex];
        }, 2000);
        this.columnDefs = [
          { field: 'customer_id', headerName: 'Customer Admin ID' },
          { field: 'customer_admin_name', headerName: 'Customer Admin Name' },
          { field: 'cust_admin_type', headerName: 'Customer Admin Type' },
          { field: 'organization_name', headerName: 'Organization Name' },
          { field: 'contact_person_name', headerName: 'Contact Person Name' },
          { field: 'contact_number', headerName: 'Contact Number' },
          { field: 'email', headerName: 'Email' },
          { field: 'currency', headerName: 'Currency' },
          { field: 'address', headerName: 'Plot No, Street Name' },
          { field: 'city_name', headerName: 'City' },
          { field: 'state_name', headerName: 'State' },
          { field: 'country_name', headerName: 'Country'}
        ];
        break;
      case 3:
        this.columnDefs = [
          { field: 'adminId', headerName: 'Customer Admin ID' },
        ];
        break;
    }
  }

  openShareReportComponentModal(){
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');
  
    const modalRef = this.modalService.open(ShareReportComponent, {
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

    openViewDeviceParameterModal(){
    console.log('Opening modal, viewDeviceParameterModal:', this.viewDeviceParameterModal);
    console.log('Opening modal, modalTemplate:', this.modalTemplate);
    console.log('Parameters:', this.parameters);
    console.log('Modal service:', this.modalService);
    
    // Wait for the next tick to ensure ViewChild is initialized
    setTimeout(() => {
      let templateToUse = this.viewDeviceParameterModal || this.modalTemplate;
      
      if (!templateToUse) {
        console.error('Modal template reference is undefined after timeout');
        return;
      }

      try {
        console.log('About to open modal with template:', templateToUse);
        const modalRef = this.modalService.open(templateToUse, {
          centered: true,
          backdrop: true,
          size: 'xl',
        });

        console.log('Modal opened successfully:', modalRef);
        console.log('Modal element:', modalRef.componentInstance);

        modalRef.result
          .then((result) => {
            console.log('View Device Parameter modal closed with result:', result);
          })
          .catch((error) => {
            console.error('View Device Parameter modal closed with error:', error);
          });
      } catch (error) {
        console.error('Error opening modal:', error);
      }
    }, 0);

  }

  searchParameter(event: any) {
    const searchValue = event.target.value;    
    if (this.parameters && this.parameters.length > 0) {
      this.sensorParameters = this.parameters.filter((parameter: any) => 
        parameter.parameter && parameter.parameter.toLowerCase().includes(searchValue.toLowerCase())
      );
      this.rowDataParameter = this.sensorParameters;  
      this.gridApi.setRowCount(this.rowDataParameter.length);
      // The grid will automatically update when sensorParameters changes due to the binding
    }
  }

  getParameterColumnDefs(): ColDef[] {
    return [
      { field: 'name', headerName: 'Parameter Name' },
      { field: 'value', headerName: 'Value' },
      { field: 'unit', headerName: 'Unit' },
      { field: 'timestamp', headerName: 'Timestamp' }
    ];
  }

  testModal() {
    console.log('Test button clicked in modal!');
    alert('Modal is working!');
  }
}
