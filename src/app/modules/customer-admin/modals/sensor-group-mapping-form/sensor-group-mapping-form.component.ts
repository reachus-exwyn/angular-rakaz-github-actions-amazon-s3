import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LocationPickerComponent } from '../location-picker/location-picker.component';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';

@Component({
  selector: 'app-sensor-group-mapping-form',
  templateUrl: './sensor-group-mapping-form.component.html',
  styleUrls: ['./sensor-group-mapping-form.component.scss'],
})
export class SensorGroupMappingFormComponent implements OnInit {
  form!: FormGroup;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;

  // Dropdown options
  sensorTypes = [];

  sensorGroupNameOptions: { [key: string]: string[] } = {};
  sensorGroupNames: any[] = [];
  sensorParameters: any[] = [];
  customers = [];

  devices: any[] = [];

  showSensorParams = false;
  sensorParamsEnabled: boolean = false;
  selectedField: 'latitude' | 'longitude' | null = null;
  currentStep = 1;
  userid: any;
  customerId: any;
  organization_id: any;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private modalService: NgbModal,
    private customerAdminService: CustomerAdminService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.userid = this.appStateService.getUser().user.id;
    this.customerId = this.appStateService.getUser().user.customer_id;
    this.organization_id = this.appStateService.getUser().user.organization_id;
    this.form = this.fb.group({
      step1: this.fb.group({
        sensorType: ['', Validators.required],
        sensorGroupName: ['', Validators.required],
        customerName: ['', Validators.required],
        deviceId: ['', Validators.required],
        deviceMake: ['', Validators.required],
        deviceModel: ['', Validators.required],
        deviceLatitude: ['', Validators.required],
        deviceLongitude: ['', Validators.required],
        sensorParameters: this.fb.array([]),
      }),
      step2: this.fb.group({
        fineAmount: ['', Validators.required],
        frequency: ['', Validators.required],
        frequencyPer: ['', Validators.required],
        warningPer: ['', Validators.required],
        warning: ['', Validators.required],
        penaltyPercent: ['', Validators.required],
        penaltyPer: ['', Validators.required],
        resetType: ['violation', Validators.required],
      }),
    });

    // Load initial data first, then handle edit mode
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load all required data first
    Promise.all([
      this.getSensorTypes(),
      this.getAllCustomersForSensorGroupMapping(''),
      this.getAllDevicesForSensorGroupMapping(),
    ])
      .then(() => {
        // After all data is loaded, handle edit mode if applicable
        if (this.mode === 'edit' && this.data) {
          this.handleEditMode();
          this.loadSensorParameters(
            this.data.sensor_type,
            this.data.sensor_group
          );
        }
      })
      .catch((error) => {
        console.error('Error loading initial data:', error);
        this.toastService.showError('Error loading form data');
      });
  }

  private handleEditMode(): void {
    this.form.patchValue({
      step1: {
        sensorType: this.data.sensor_type,
        sensorGroupName: this.data.sensor_group,
        customerName: this.data.customer_id,
        deviceId: this.data.device_id,
        deviceMake: this.data.device_make,
        deviceModel: this.data.device_model,
        deviceLatitude: this.data.device_latitude,
        deviceLongitude: this.data.device_longitude,
      },
      step2: {
        fineAmount: this.data.fine_amount,
        frequency: this.data.frequency,
        frequencyPer: this.data.frequency_per,
        warningPer: this.data.warning_per,
        warning: this.data.warning,
        penaltyPercent: this.data.penalty,
        penaltyPer: this.data.penalty_per,
        resetType:
          this.data.reset_type === 'violation' ? 'violation' : 'period',
      },
    });
  }

  getSensorTypes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.customerAdminService
        .getSensorGroupParameters(this.organization_id)
        .subscribe(
          (res: any) => {
            this.sensorTypes = res.data.map((item: any) => {
              return {
                sensor_type_id: item.sensortypeid,
                sensor_type: item.sensortype,
                sensorgroups: item.sensorgroups,
              };
            });

            this.sensorGroupNameOptions = {};
            this.sensorTypes.forEach((item: any) => {
              this.sensorGroupNameOptions[item.sensor_type_id] =
                item.sensorgroups.map((group: any) => {
                  return {
                    sensor_group_id: group.sensor_group_id,
                    sensor_group_name: group.sensor_group_name,
                  };
                });
            });
            resolve();
          },
          (error: any) => {
            this.toastService.showError(error.message);
            reject(error);
          }
        );
    });
  }

  // Called when sensorType is selected
  onSensorTypeChange(sensorTypeId: any) {
    // Clear sensorGroupName control
    this.form.get('step1.sensorGroupName')?.reset();
    this.sensorParametersArray.clear();
    this.toggleSensorParams(false);

    // Clear device selection and reload devices for the selected sensor type
    this.form.get('step1.deviceId')?.reset();
    this.form.get('step1.deviceMake')?.reset();
    this.form.get('step1.deviceModel')?.reset();

    // Reload devices for the selected sensor type
    this.getAllDevicesForSensorGroupMapping();
  }

  // Called when device is selected
  onDeviceChange(deviceId: any) {
    console.log('Device selected:', deviceId);
    console.log('Available devices:', this.devices);

    if (deviceId) {
      const selectedDevice = this.devices.find(
        (device: any) => device.id === deviceId.id
      );
      console.log('Selected device:', selectedDevice);

      if (selectedDevice) {
        this.form.patchValue({
          step1: {
            deviceMake: selectedDevice.device_make || '',
            deviceModel: selectedDevice.device_model || '',
          },
        });
      }
    } else {
      // Clear device details if no device selected
      this.form.patchValue({
        step1: {
          deviceMake: '',
          deviceModel: '',
        },
      });
    }
  }

  // Getter for debugging
  get availableDevices() {
    return this.devices;
  }

  // getSensorGroupsNameOptions(event: any) {
  //   this.sensorGroupNames = this.sensorGroupNameOptions[event.value];//this.sensorTypes.find((item:any) => item.sensor_type_id === event.value);
  // }

  // Create sensor parameter form group
  createSensorParameter(paramName: any): FormGroup {
    return this.fb.group({
      sensorParameter: [paramName.sensor_parameter_name, Validators.required],
      minThresholdLimit: [paramName.min_threshold_limit, Validators.required],
      maxThresholdLimit: [paramName.max_threshold_limit, Validators.required],
    });
  }

  // Get sensor parameters form array
  // get sensorParametersArray(): FormArray {
  //   return (this.form.get('step1.sensorParameters') as FormArray) || this.fb.array([]);
  // }

  get sensorParametersArray(): FormArray {
    return this.form.get('step1.sensorParameters') as FormArray;
  }

  // Load default parameters for sensor type
  loadSensorParameters(sensorType: string, sensorGroupName: string) {
    this.sensorParametersArray.clear();
    this.sensorTypes.forEach((item: any) => {
      if (item.sensor_type_id === sensorType) {
        item.sensorgroups.forEach((group: any) => {
          if (group.sensor_group_id === sensorGroupName) {
            group.parameters.forEach((parameter: any) => {
              this.sensorParametersArray.push(
                this.createSensorParameter(parameter)
              );
            });
          }
        });
      }
    });
  }

  toggleSensorParams(checked: boolean) {
    this.showSensorParams = checked;
    this.sensorParamsEnabled = checked;
    const sensorArray = this.form.get('step1.sensorParameters') as FormArray;
    console.log('sensorParametersArray:-------', this.sensorParametersArray);
  }

  getAllCustomersForSensorGroupMapping(search: string = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = {
        page: 1,
        limit: 1000,
        organization_id: this.organization_id,
      };
      this.customerAdminService
        .getAllCustomersForSensorGroupMapping(data)
        .subscribe(
          (res: any) => {
            this.customers = res.results.data;
            resolve();
          },
          (error: any) => {
            reject(error);
          }
        );
    });
  }

  getAllDevicesForSensorGroupMapping(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Fetching devices for customer ID:', this.customerId);

      this.customerAdminService
        .getDeviceMappingDetails(this.customerId)
        .subscribe(
          (res: any) => {
            console.log('Device mapping response:', res);

            // Handle different possible response structures
            let data = [];
            if (res.result && res.result.data) {
              data = res.result.data;
            } else if (res.data) {
              data = res.data;
            } else if (Array.isArray(res)) {
              data = res;
            }

            if (data && data.length > 0) {
              // Filter devices by selected sensor type
              const selectedSensorType =
                this.form.get('step1.sensorType')?.value;
              console.log('Selected sensor type:', selectedSensorType);

              if (selectedSensorType) {
                const sensorTypeInfo = data.filter(
                  (device: any) => device.sensor_id === selectedSensorType
                );
                console.log('Filtered sensor type info:', sensorTypeInfo);

                if (sensorTypeInfo.length > 0) {
                  // Flatten the devices array from all matching sensor types
                  this.devices = sensorTypeInfo.reduce(
                    (acc: any[], device: any) => {
                      try {
                        let parsedDevices;
                        if (typeof device.devices === 'string') {
                          parsedDevices = JSON.parse(device.devices);
                        } else {
                          parsedDevices = device.devices;
                        }

                        if (Array.isArray(parsedDevices)) {
                          return [...acc, ...parsedDevices];
                        } else if (
                          parsedDevices &&
                          typeof parsedDevices === 'object'
                        ) {
                          return [...acc, parsedDevices];
                        } else {
                          return acc;
                        }
                      } catch (error) {
                        console.error(
                          'Error parsing device JSON:',
                          error,
                          device.devices
                        );
                        return acc;
                      }
                    },
                    []
                  );
                } else {
                  this.devices = [];
                }
              } else {
                // If no sensor type selected, show all devices
                this.devices = data.reduce((acc: any[], device: any) => {
                  try {
                    let parsedDevices;
                    if (typeof device.devices === 'string') {
                      parsedDevices = JSON.parse(device.devices);
                    } else {
                      parsedDevices = device.devices;
                    }

                    if (Array.isArray(parsedDevices)) {
                      return [...acc, ...parsedDevices];
                    } else if (
                      parsedDevices &&
                      typeof parsedDevices === 'object'
                    ) {
                      return [...acc, parsedDevices];
                    } else {
                      return acc;
                    }
                  } catch (error) {
                    console.error(
                      'Error parsing device JSON:',
                      error,
                      device.devices
                    );
                    return acc;
                  }
                }, []);
              }
            } else {
              this.devices = [];
            }

            console.log('Final processed devices:', this.devices);

            // Validate device structure
            this.devices = this.devices.filter((device: any) => {
              if (!device || !device.id) {
                console.warn('Invalid device structure:', device);
                return false;
              }
              return true;
            });

            // If no devices found, show a message
            if (this.devices.length === 0) {
              console.log('No devices found for the selected criteria');
              this.toastService.showInfo(
                'No devices available for the selected sensor type'
              );
            }

            resolve();
          },
          (error: any) => {
            console.error('Error fetching devices:', error);
            this.devices = [];
            this.toastService.showError('Error loading devices');
            reject(error);
          }
        );
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.toastService.showError('Please fill all required fields');
      return;
    }

    const formData = {
      sensor_type: this.form.value.step1.sensorType,
      sensor_group: this.form.value.step1.sensorGroupName,
      customer_id: this.form.value.step1.customerName,
      device_id: this.form.value.step1.deviceId,
      device_make: this.form.value.step1.deviceMake,
      device_model: this.form.value.step1.deviceModel,
      status: 'active',
      created_by: this.userid,
      longitude: this.form.value.step1.deviceLongitude,
      latitude: this.form.value.step1.deviceLatitude,
      fine_amount: this.form.value.step2.fineAmount,
      frequency: this.form.value.step2.frequency,
      frequency_per: this.form.value.step2.frequencyPer,
      warning: this.form.value.step2.warning,
      warning_per: this.form.value.step2.warningPer,
      penalty: this.form.value.step2.penaltyPercent,
      penalty_per: this.form.value.step2.penaltyPer,
      reset_type: this.form.value.step2.resetType,
      organization_id: this.organization_id,
    };

    if (this.mode === 'create') {
      this.customerAdminService.createSensorGroupMapping(formData).subscribe(
        (res: any) => {
          if (res.success) {
            this.toastService.showSuccess(
              'Sensor group mapping saved successfully'
            );
          } else {
            this.toastService.showError('Failed to save sensor group mapping');
          }
          this.activeModal.close('saved');
          this.form.reset();
        },
        (error: any) => {
          this.toastService.showError(error.error.message);
        }
      );
    } else {
      this.customerAdminService
        .updateSensorGroupMapping(this.data.id, formData)
        .subscribe(
          (res: any) => {
            if (res.success) {
              this.toastService.showSuccess(
                'Sensor group mapping updated successfully'
              );
            }
            this.activeModal.close('saved');
            this.form.reset();
          },
          (error: any) => {
            this.toastService.showError(error.error.message);
          }
        );
    }
    // console.log(this.form.value);
    // this.toastService.showSuccess('Sensor group mapping saved successfully');
    // this.activeModal.close(this.form.value);
  }

  openLocationModal(field: 'latitude' | 'longitude') {
    this.selectedField = field;
    // Example: open your NgbModal here
    const modalRef = this.modalService.open(LocationPickerComponent, {
      size: 'lg',
      backdrop: 'static',
      windowClass: 'custom-modal-class',
    });

    modalRef.result.then(
      (coords) => {
        console.log('Coords:', coords);
        if (coords && this.selectedField) {
          this.form.patchValue({
            step1: { deviceLatitude: coords.lat, deviceLongitude: coords.lng },
          });
        }
      },
      () => {}
    );
  }

  goNext() {
    if (this.currentStep === 1 && this.form.get('step1')?.invalid) {
      this.toastService.showError('Please fill required fields in Step 1');
      return;
    }
    this.currentStep = 2;
  }

  goBack() {
    this.currentStep = 1;
  }
}
