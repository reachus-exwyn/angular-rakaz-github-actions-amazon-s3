import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import { ActionDropdownRendererComponent } from '../action-dropdown-renderer/action-dropdown-renderer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerFormComponent } from '../../modals/customer-form/customer-form.component';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent {

  pageSize = 10; // or bind this from user selection
  pageSizeSelector = [10, 20, 50, 100];
  rowHeight = 40; // default row height (or whatever you use)
  gridApi!: GridApi<any>;

  columnDefs: ColDef[] = [
    { field: 'customerId', headerName: 'Customer ID'},
    { field: 'customerName', headerName: 'Customer Name' },
    { field: 'planDetails', headerName: 'Plan Name' },
    { field: 'customerType', headerName: 'Customer Type' },
    { field: 'organization', headerName: 'Organization Name' },
    { field: 'contactPerson', headerName: 'Contact Person Name' },
    { field: 'contactNumber', headerName: 'Contact Number' },
    { field: 'email', headerName: 'Email' },
    { field: 'country', headerName: 'Country' },
    { field: 'currency', headerName: 'Currency' },
    { field: 'plotno', headerName: 'Plot No, Street Name' },
    { field: 'city', headerName: 'City' },
    { field: 'state', headerName: 'State' },    
    { field: 'vat_id', headerName: 'VAT ID' },
    {field : 'trade_license_id',headerName : 'Trade License ID'},
    {
      headerName: 'Action',
      cellRenderer: ActionDropdownRendererComponent,
      suppressNavigable: true,
      suppressKeyboardEvent: () => true, // ✅ blocks keyboard for this cell
      cellRendererParams: {
        suppressDoubleClickEdit: true,
        staticLabel: 'customerAdmin',
        onActionCompleted: (eventType: string, rowData: any) => {
          if (eventType === 'edit' || eventType === 'delete') {
            this.getCustomers();
          }
        }
      },
      cellClass: 'no-select',
    },
  ];
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  rowData: any[] = [];
userid: any;
organizationid: any;
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private customerAdminService: CustomerAdminService,
    private appStateService: AppStateService
  ) {}
  ngOnInit(): void {
    this.userid = this.appStateService.getUser().user.id;
    this.organizationid = this.appStateService.getUser().user.organization_id;
    this.getCustomers();
  }

  getCustomers(search: string = '') {
    const data = {
      page: 1,
      search: search,
      userid: this.userid,
      organization: this.organizationid
    };
    this.customerAdminService.getCustomers(data).subscribe((res: any) => {
      if (res.results.data.length > 0) {
        this.rowData = res.results.data.map((item: any) => ({
          id: item.id,
          customerId: item.customer_id,
          customerName: item.customer_name,
          customerType: item.customer_type_name,
          organization: item.organization_name || '',
          contactPerson: item.contact_person_name || '',
          contactNumber: item.contact_number || '',
          email: item.email || '',
          planDetails: item.plan_name || '',
          currency: item.currency || '',
          plotno: item.address || '',
          city: item.city_name || '',
          state: item.state_name || '',
          country: item.country_name || '',
          vat_id: item.vat_id || '-',
          trade_license_id: item.trade_license_id || '-',
        }));

        this.gridApi.setRowCount(this.rowData.length);        
      }
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
      this.getCustomers(filterValue);     
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

  openCustomerAdminModal(type: 'create' | 'edit', formData?: any) {
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');

    const modalRef = this.modalService.open(CustomerFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
      windowClass: 'custom-modal-class',
    });

    modalRef.componentInstance.mode = type;
    modalRef.componentInstance.data = formData || null;
    modalRef.componentInstance.modalRef = modalRef; // <-- pass reference to child

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          console.log('Customer admin created/updated.');
          this.getCustomers();
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
