import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO } from 'ngx-intl-tel-input';
import { SuperAdminService } from '../../services/super-admin.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-customer-admin-form',
  templateUrl: './customer-admin-form.component.html',
  styleUrls: ['./customer-admin-form.component.scss'],
})
export class CustomerAdminFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;

  adminForm!: FormGroup;
  formSubmitted = false;
  // currencyList = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
  SearchCountryField: any = 'all';

  CountryISO = CountryISO; // expose to template

  preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedStates,
  ];
  selectedCountryISO: CountryISO = "IN" as CountryISO;
  selectedCurrency: any;
  selectedState: any;
  selectedCity: any;
  currencyList: {
    country: string;
    currency: string;
    code: string;
    symbol: string;
  }[] = [];
  customerAdminTypes: { id: number; cust_admin_type: string }[] = [];
  units: { id: number; unit_name: string }[] = [];
  countries: { id: number; name: string }[] = [];
  states: { id: number; name: string }[] = [];
  cities: { id: number; name: string }[] = [];
  selectedCountry: any;
  userId: number = 0;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private appStateService: AppStateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      organizationName: ['', Validators.required],
      contactPersonName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      adminName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z0-9]+$'), // Only alphanumeric, no spaces/special chars
        ],
      ],
      password: ['', this.mode === 'create' ? [Validators.required, Validators.minLength(8)] : []],
      currency: ['', Validators.required],
      address: ['', Validators.required],
      adminType: ['', Validators.required],
    });
    this.userId = this.appStateService.getUser().user.id;

    if (this.data) {
      this.selectedCurrency = this.data.currency;
    }
    this.getCurrencies();
    this.getCustomerAdminTypes();
    this.getCountries();

    if (this.mode === 'edit') {
      console.log(this.data);
      this.selectedCountry = this.data.country_id;       
      this.getStates();
      this.selectedState = this.data.state_id;
      this.getCities();
      this.selectedCity = this.data.city_id;
      this.selectedCountryISO = (JSON.parse(this.data.contact_object) as any).countryCode as CountryISO;
      this.adminForm.patchValue({
        organizationName: this.data.organization_name,
        contactPersonName: this.data.contact_person_name,
        email: this.data.email,
        contactNumber: JSON.parse(this.data.contact_object),
        country: this.selectedCountry,
        state: this.data.state_id,
        city: this.data.city_id,
        adminName: this.data.customer_admin_name,
        adminType: this.data.customer_admin_type,
        currency: this.selectedCurrency,
        address: this.data.address,
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.adminForm.get(field);
    return !!(
      control &&
      (control.touched || this.formSubmitted) &&
      control.invalid
    );
  }

  getCurrencies() {
    this.superAdminService.getCurrencies().subscribe((res: any) => {
      this.currencyList = res.data;
    });
  }

  getCustomerAdminTypes() {
    this.superAdminService.getCustomerAdminTypes().subscribe((res: any) => {
      this.customerAdminTypes = res.data;
    });
  }

  getCountries() {
    this.superAdminService.getCountries().subscribe((res: any) => {
      this.countries = res.data;
    });
  }

  getStates() {
    this.selectedState = null;
    this.superAdminService
      .getStates(this.selectedCountry)
      .subscribe((res: any) => {
        this.states = res.data;
      });
  }

  getCities() {
    this.selectedCity = null;
    this.superAdminService
      .getCities(this.selectedState)
      .subscribe((res: any) => {
        this.cities = res.data;
      });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.adminForm.valid) {
      if (this.mode === 'create') {
        const hashedPassword = bcrypt.hashSync(
          this.adminForm.value.password,
          10
        );
        const formData = {
          organization_name: this.adminForm.value.organizationName,
          contact_person_name: this.adminForm.value.contactPersonName,
          customer_admin_name: this.adminForm.value.adminName,
          username: this.adminForm.value.adminName,
          email: this.adminForm.value.email,
          contact_number:
            this.adminForm.value.contactNumber.internationalNumber,
          contact_object: JSON.stringify(this.adminForm.value.contactNumber),
          customer_admin_type: this.adminForm.value.adminType,
          currency: this.adminForm.value.currency,
          password: hashedPassword,
          address: this.adminForm.value.address,
          country_id: this.adminForm.value.country,
          roleid: 2,
          state_id: this.adminForm.value.state,
          city_id: this.adminForm.value.city,
          created_by: this.userId,
        };

        this.superAdminService.createCustomerAdmin(formData).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastService.showSuccess(
                'Customer admin created successfully'
              );
              this.activeModal.close('saved');
              this.adminForm.reset();
            } else {
              this.toastService.showError('Failed to create customer admin');
            }
          },
          (error: any) => {
            this.toastService.showError(error.error.message);
          }
        );
       
        this.formSubmitted = false;
        
      }
      else if (this.mode === 'edit') {  
        const formData = {
          customer_id: this.data.id,
          organization_name: this.adminForm.value.organizationName,
          contact_person_name: this.adminForm.value.contactPersonName,
          customer_admin_name: this.adminForm.value.adminName,
          email: this.adminForm.value.email,
          contact_number:
            this.adminForm.value.contactNumber.internationalNumber,
          contact_object: JSON.stringify(this.adminForm.value.contactNumber),
          customer_admin_type: this.adminForm.value.adminType,
          currency: this.adminForm.value.currency,
          address: this.adminForm.value.address,
          country_id: this.adminForm.value.country,
          roleid: 2,
          state_id: this.adminForm.value.state,
          city_id: this.adminForm.value.city,
        }

        this.superAdminService.updateCustomerAdmin(this.data.id, formData).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastService.showSuccess('Customer admin updated successfully');
              this.activeModal.close('saved');
              this.adminForm.reset();
            }
            else {
              this.toastService.showError('Failed to update customer admin');
            }
          },
          (error: any) => {
            this.toastService.showError(error.error.message);
          }
        );
        
        this.formSubmitted = false;
        
      }
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  removeInvalidChars(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    this.adminForm.get('adminName')?.setValue(input.value);
  }

}
