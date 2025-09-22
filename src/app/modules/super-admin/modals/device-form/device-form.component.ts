import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
})
export class DeviceFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;

  deviceForm!: FormGroup;
  formSubmitted = false;
  sensorTypes: {
    id: number;
    sensortype: string;
    parameters: { id: number; sensor_id: number; parameters: string }[];
  }[] = []; //= ['Water', 'Air', 'Soil']; // Example
  sensorParameters?: {
    id: number;
    sensor_id: number;
    sensorParameter: string;
  }[] = []; //= ['Temperature', 'Humidity', 'Pressure']; // Example
  selectedSensorType: string = '';
  selectedSensorParameter: {
    id: number;
    sensor_id: number;
    sensorParameter: string;
  }[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private toastr: ToastService
  ) {}

  ngOnInit(): void {
    this.deviceForm = this.fb.group({
      deviceSerialNumber: ['', Validators.required], // Device ID
      deviceName: ['', Validators.required],
      sensorType: ['', Validators.required],
      sensorParameter: ['', Validators.required],
      deviceMake: ['', Validators.required],
      deviceModel: ['', Validators.required],
    });

    this.getSensors();
  }

  getSensors() {
    this.superAdminService.getSensors().subscribe((res: any) => {
      this.sensorTypes = res.data;
      if (this.mode === 'edit' && this.data) {
        this.selectedSensorType = this.data.sensortype;

        // Optional: Patch data if editing
        if (this.mode === 'edit' && this.data) {
          this.selectedSensorType = this.data.sensortype;
          this.getSensorParameters();
          this.sensorParameters?.forEach((sensor: any) => {
            if (this.data.sensorparameters.includes(sensor.id)) {
              this.selectedSensorParameter.push({id:sensor.id,sensor_id:sensor.id,sensorParameter:sensor.sensorParameter});
            }
          });
          this.deviceForm.patchValue({
            deviceSerialNumber: this.data.deviceId,
            deviceName: this.data.deviceName,
            sensorType: this.selectedSensorType,
            sensorParameter: this.data.sensorparameters.split(',').map((id: any) => parseInt(id, 10)),
            deviceMake: this.data.devicemake,
            deviceModel: this.data.devicemodel,
          });
        }
      }
    });
  }

  getSensorParameters() {
    this.selectedSensorParameter = [];
    if (this.selectedSensorType) {
      this.sensorParameters = this.sensorTypes
        .find((sensor: any) => sensor.id === parseInt(this.selectedSensorType))
        ?.parameters.map((sensor: any) => ({
          id: sensor.id,
          sensor_id: sensor.sensor_id,
          sensorParameter: sensor.sensorParameter,
        }));
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.deviceForm.get(field);
    return !!(
      control &&
      (control.touched || this.formSubmitted) &&
      control.invalid
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.deviceForm.valid) {
      if (this.mode === 'create') {
        const formData = {
          deviceId: this.deviceForm.value.deviceSerialNumber,
          devicename: this.deviceForm.value.deviceName,
          sensortype: this.selectedSensorType,
          sensorparameters: this.selectedSensorParameter.toString(),
          devicemake: this.deviceForm.value.deviceMake,
          devicemodel: this.deviceForm.value.deviceModel,
        };
        // call create API
        this.superAdminService.createDevice(formData).subscribe(
          (res: any) => {
            this.toastr.showSuccess(res.message);
            this.activeModal.close('saved');
          },
          (error: any) => {
           // this.toastr.showError(error.error.message);
          }
        );
      } else {
        // call update API with this.data.id
        const formData = {
          id: this.data.id,
          deviceId: this.deviceForm.value.deviceSerialNumber,
          devicename: this.deviceForm.value.deviceName,
          sensortype: this.selectedSensorType,
          sensorparameters: this.selectedSensorParameter.toString(),
          devicemake: this.deviceForm.value.deviceMake,
          devicemodel: this.deviceForm.value.deviceModel,
        };
        this.superAdminService.updateDevice(formData).subscribe((res: any) => {
          this.toastr.showSuccess(res.message);
          this.activeModal.close('saved');
        },(error: any) => {
          //this.toastr.showError(error.error.message);
        });
      }

      //this.activeModal.close('saved');
    }
  }

  close() {
    this.activeModal.dismiss();
  }
}
