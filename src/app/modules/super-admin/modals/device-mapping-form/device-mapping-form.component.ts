import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-device-mapping-form',
  templateUrl: './device-mapping-form.component.html',
  styleUrls: ['./device-mapping-form.component.scss']
})
export class DeviceMappingFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;
  selectedAdmin: any;
  selectedDevice: any;
  deviceMappingForm!: FormGroup;
  formSubmitted = false;
  customerAdminList: any[] = [];
  deviceList: any[] = [];
  deviceMappingList: any[] = [];
  deviceMappingDetails: any[] = [];
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private superAdminService: SuperAdminService, private toastr: ToastService) { }

  ngOnInit(): void {
    this.deviceMappingForm = this.fb.group({
      customerAdminName: ['', [Validators.required]], 
      deviceId: ['', [Validators.required]] 
    });

    this.getDeviceMappings();

    this.getCustomerAdmins();
    this.getDevices();
  
    if (this.mode === 'edit' && this.data) {
      this.deviceMappingForm.patchValue(this.data);
    }
  }

  getDeviceMappings(){
    let data = {
      page: 1,
      limit: 1000
    }
    this.superAdminService.getDeviceMappings(data).subscribe((res: any) => {
      this.deviceMappingList = res.results.data;
    });
  }

  getCustomerAdmins(){
    let data = {
      page: 1,
      limit: 1000
    }
    this.superAdminService.getCustomerAdmins(data).subscribe((res: any) => {
      this.customerAdminList = res.results.data;
    });
  }

  getDevices(){
    let data = {
      page: 1,
      limit: 1000
    }
    this.superAdminService.getDevices(data).subscribe((res: any) => {
      this.deviceList = res.results.data;
    });
  }

  getDeviceMappingDetails(id: any){
    this.superAdminService.getDeviceMappingDetails(id).subscribe((res: any) => {
      this.deviceMappingDetails = res.result.data;
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.deviceMappingForm.get(field);
    return !!(control && (control.touched || this.formSubmitted) && control.invalid);
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.deviceMappingForm.valid) {
      if (this.mode === 'create') {
        // call create API
        const formData = {
          customer_id: this.selectedAdmin,
          device_ids: this.selectedDevice
        }
        this.superAdminService.createDeviceMapping(formData).subscribe((res: any) => {
          this.toastr.showSuccess(res.message);
          this.activeModal.close('saved');
        },(error: any) => {
         // this.toastr.showError(error.error.error);
        });
      } else {  
        // call update API with this.data.id
      }

      this.activeModal.close('saved');
    }
  }

  close() {
    this.activeModal.dismiss();
  }

}
