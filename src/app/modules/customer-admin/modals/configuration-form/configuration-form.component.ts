import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';

@Component({
  selector: 'app-configuration-form',
  templateUrl: './configuration-form.component.html',
  styleUrls: ['./configuration-form.component.scss'],
})
export class ConfigurationFormComponent implements OnInit {
  customerAdminTypeForm!: FormGroup;
  unitForm!: FormGroup;
  customerAdminTypes: {id: number, customer_type: string}[] = [];
  units: {id: number, unit_name: string}[] = [];

  selectedCustomerAdminTypes: number[] = [];
  selectedUnits: number[] = [];
  userId: number = 0;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private customerAdminService: CustomerAdminService,
    private toastService: ToastService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.customerAdminTypeForm = this.fb.group({
      customerAdminType: ['', Validators.required],
    });

    this.unitForm = this.fb.group({
      unit: ['', Validators.required],
    });
    this.userId = this.appStateService.getUser().user.id;

    this.getCustomerAdminTypes();
  }

  getCustomerAdminTypes() {
    this.customerAdminService.getCustomerTypes().subscribe({
      next: (res: any) => {
        if (res.success) {
          if (Array.isArray(res.data)) {
            this.customerAdminTypes = res.data.map((item: any) => {
              return {id: item.id, customer_type: item.customer_type};
            });
          } else {
            this.customerAdminTypes = [];
          }
        } else {
          this.toastService.showError('Customer Admin Type fetching failed');
          this.customerAdminTypes = [];
        }
      },
      error: (error) => {
        console.error("Error fetching customer admin types:", error);
        this.toastService.showError('Customer Admin Type fetching failed');
        this.customerAdminTypes = [];
      }
    })
  }


  // Add Customer Admin Type
  addCustomerAdminType() {
    const control = this.customerAdminTypeForm.get('customerAdminType');
    control?.markAsTouched(); // Mark as touched so error shows up

    if (control?.invalid) {
      return; // Do nothing if invalid (e.g., empty)
    }

    const value = control?.value.trim();

    if (value && !this.customerAdminTypes.includes(value)) {
      
      this.customerAdminService
        .createCustomerType({ customer_type: value, created_by: this.userId })
        .subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.customerAdminTypes = [...this.customerAdminTypes, {id: res.data.id, customer_type: value}];
            this.toastService.showSuccess(
              'Customer Admin Type created successfully'
            );
          } else {
            this.toastService.showError('Customer Admin Type creation failed');
          }
        });
      control?.reset(); // Clear input
    }
    else{
      this.toastService.showError('Customer Admin Type already exists');
    }
  }


    // Delete selected Customer Types
  deleteSelectedCustomerTypes() {
    const ids = this.selectedCustomerAdminTypes;//.map((item) => item.id);

    if (ids.length === 0) {
      this.toastService.showError('Please select at least one item to delete');
      return;
    }

    this.customerAdminService
      .deleteCustomerType(ids)
      .subscribe((res: any) => {
        if (res.success) {
          this.toastService.showSuccess(
            'Customer Admin Types deleted successfully'
          );
          // Remove deleted items from the list
          this.customerAdminTypes = this.customerAdminTypes.filter(
            (item) => !ids.includes(item.id)
          );
          this.selectedCustomerAdminTypes = this.selectedCustomerAdminTypes.filter(
            (id) => !ids.includes(id)
          );
          
        } else {
          this.toastService.showError('Customer Admin Types deletion failed');
        }
      });
  }

  close() {
    this.activeModal.dismiss();
  }
}
