import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO } from 'ngx-intl-tel-input';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;
  SearchCountryField: any = 'all';
  selectedCountryISO: CountryISO = "IN" as CountryISO;
  profileForm!: FormGroup;
  formSubmitted = false;
  @Input() modalRef: any;
  countries: { id: number; name: string }[] = [];
  states: { id: number; name: string }[] = [];
  cities: { id: number; name: string }[] = [];
  currencyList: {
    country: string;
    currency: string;
    code: string;
    symbol: string;
  }[] = [];
  customerTypes: { id: number; customer_type: string }[] = [];
  preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedStates,
  ];
  selectedState: any;
  selectedCity: any;
  selectedCountry: any;
  constructor(private fb: FormBuilder,private customerAdminService: CustomerAdminService,private toastService: ToastService) {}

  ngOnInit(): void {
    this.initializeForm();

    this.getCurrencies();
    this.getCustomerTypes();
    this.getCountries();
    if (this.data) {
      //this.profileForm.patchValue(this.data);
      this.profileForm.patchValue({
        customerAdminName: this.data.customer_admin_name,
        organizationName: this.data.organization_name,
        contactPersonName: this.data.contact_person_name,
        customerAdminType: this.data.cust_admin_type,
        email: this.data.email,
        contactNumber:  (JSON.parse(this.data.contact_object) as any).number,
        address: this.data.address,
        country: this.data.country_id,
        state: this.data.state_id,
        city: this.data.city_id
      });
      this.selectedCountry = this.data.country_id;
      this.getStates();
      this.selectedState = this.data.state_id;
      this.getCities();
      this.selectedCity = this.data.city_id;
      this.selectedCountryISO = (JSON.parse(this.data.contact_object) as any).countryCode as CountryISO;
    }
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      customerAdminName: ['', [Validators.required]],
      organizationName: ['', [Validators.required]],
      contactPersonName: ['', [Validators.required]],
      customerAdminType: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.invalid && (control.touched || this.formSubmitted));
  }

  getCurrencies() {
    this.customerAdminService.getCurrencies().subscribe((res: any) => {
      this.currencyList = res.data;
    });
  }

  getCustomerTypes() {
    this.customerAdminService.getCustomerTypes().subscribe((res: any) => {
      this.customerTypes = res.data;
    });
  }

  getCountries() {
    this.customerAdminService.getCountries().subscribe((res: any) => {
      this.countries = res.data;
    });
  }

  getStates() {
    this.selectedState = null;
    this.customerAdminService
      .getStates(this.selectedCountry)
      .subscribe((res: any) => {
        this.states = res.data;
      });
  }

  getCities() {
    this.selectedCity = null;
    this.customerAdminService
      .getCities(this.selectedState)
      .subscribe((res: any) => {
        this.cities = res.data;
      });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.profileForm.valid) {
      console.log('Profile Data:', this.profileForm.value);
      const formData = {
        customer_admin_name: this.profileForm.value.customerAdminName,
        organization_name: this.profileForm.value.organizationName,
        contact_person_name: this.profileForm.value.contactPersonName,
        cust_admin_type: this.profileForm.value.customerAdminType,
        email: this.profileForm.value.email,
        contact_number: this.profileForm.value.contactNumber.internationalNumber,
        contact_object: JSON.stringify(this.profileForm.value.contactNumber),
        currency: this.profileForm.value.currency,
        address: this.profileForm.value.address,
        country_id: this.profileForm.value.country,
        state_id: this.profileForm.value.state,
        city_id: this.profileForm.value.city
      }
      this.customerAdminService.updateCustomerAdminProfile(this.data.id, formData).subscribe((res: any) => {
        if (res.success) {
          this.toastService.showSuccess('Profile updated successfully');
          this.close();
        }
      });
      // You can now send this data to the server or handle it as needed
      this.close();
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close('saved');
    }
  }
}