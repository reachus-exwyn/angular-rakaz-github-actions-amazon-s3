import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO } from 'ngx-intl-tel-input';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-customer-admin-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;

  customerForm!: FormGroup;
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
  customerTypes: { id: number; customer_type: string }[] = [];
  units: { id: number; unit_name: string }[] = [];
  countries: { id: number; name: string }[] = [];
  states: { id: number; name: string }[] = [];
  cities: { id: number; name: string }[] = [];
  planDetails: { id: number; plan_name: string }[] = [];
  selectedCountry: any;
  userId: number = 0;
  organizationId:number=0;
  selectedPlan: any=null;
  isPlanSelected: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private customerAdminService: CustomerAdminService,
    private appStateService: AppStateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      customerType: ['', Validators.required],
      contactPersonName: ['', Validators.required],
      customerName: ['', Validators.required],
      organizationName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currency: ['', Validators.required],
      password: ['', this.mode === 'create' ? [Validators.required, Validators.minLength(8)] : []],
      planDetails: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      tradeLicenseId: ['', this.mode === 'edit' ? [Validators.required] : []],
      vatId: ['', this.mode === 'edit' ? [Validators.required] : []]
    });
    this.userId = this.appStateService.getUser().user.id;
    this.organizationId = this.appStateService.getUser().user.organization_id;
    if (this.data) {
      this.selectedCurrency = this.data.currency;
    }
    this.getCurrencies();
    this.getCustomerTypes();
    this.getCountries();
    this.getSubscriptionPlans();

    if (this.mode === 'edit') {
      console.log(this.data);
      this.selectedCountry = this.data.country_id;       
      this.getStates();
      this.selectedState = this.data.state_id;
      this.getCities();
      this.selectedCity = this.data.city_id;
      this.selectedCountryISO = (JSON.parse(this.data.contact_object) as any).countryCode as CountryISO;
      this.customerForm.patchValue({
        customerType: this.data.customer_type,
        contactPersonName: this.data.contact_person_name,
        customerName: this.data.customer_name,
        organizationName: this.data.organization_name,
        contactNumber: this.data.contact_number,
        email: this.data.email,
        currency: this.data.currency,
        planDetails: this.data.plan_id,
        address: this.data.address,
        country: this.data.country_id,
        state: this.data.state_id,
        city: this.data.city_id,
        tradeLicenseId: this.data.trade_license_id,
        vatId: this.data.vat_id
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.customerForm.get(field);
    return !!(
      control &&
      (control.touched || this.formSubmitted) &&
      control.invalid
    );
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

  getSubscriptionPlans() {
    let body = {
      customer_id : this.userId,
      organization:this.organizationId
    }
    this.customerAdminService.getSubscriptions(body).subscribe((res: any) => {
      this.planDetails = res.data;
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.customerForm.valid) {
      if (this.mode === 'create') {
        const hashedPassword = bcrypt.hashSync(
          this.customerForm.value.password,
          10
        );
        const formData = {
          customer_type: this.customerForm.value.customerType,
          customer_name: this.customerForm.value.customerName,
          username: this.customerForm.value.customerName,
          email: this.customerForm.value.email,
          organization_name: this.customerForm.value.organizationName,
          contact_person_name: this.customerForm.value.contactPersonName,
          contact_number: this.customerForm.value.contactNumber.internationalNumber,
          contact_object: JSON.stringify(this.customerForm.value.contactNumber),
          currency: this.customerForm.value.currency,
          password: hashedPassword,
          plan_id: this.customerForm.value.planDetails,
          address: this.customerForm.value.address,
          country_id: this.customerForm.value.country,
          state_id: this.customerForm.value.state,
          city_id: this.customerForm.value.city,
          created_by: this.userId,
          roleid: 3,
          organization:this.organizationId
        };

        this.customerAdminService.createCustomer(formData).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastService.showSuccess(
                'Customer admin created successfully'
              );
              
              this.activeModal.close('saved');
              this.customerForm.reset();
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
          username: this.customerForm.value.customerName,
          organization_name: this.customerForm.value.organizationName,
          contact_person_name: this.customerForm.value.contactPersonName,
          customer_name: this.customerForm.value.customerName,
          customer_type: this.customerForm.value.customerType,
          email: this.customerForm.value.email,
          contact_number:
            this.customerForm.value.contactNumber.internationalNumber,
          contact_object: JSON.stringify(this.customerForm.value.contactNumber),
          currency: this.customerForm.value.currency,
          trade_license_id: this.customerForm.value.tradeLicenseId,
          vat_id: this.customerForm.value.vatId,
          plan_id: this.customerForm.value.planDetails,
          address: this.customerForm.value.address,
          country_id: this.customerForm.value.country,
          roleid: 2,
          state_id: this.customerForm.value.state,
          city_id: this.customerForm.value.city,
          modified_by: this.userId,
          organization:this.organizationId
        }

        this.customerAdminService.updateCustomer(this.data.id, formData).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastService.showSuccess('Customer admin updated successfully');
              this.activeModal.close('saved');
              this.customerForm.reset();
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
    this.customerForm.get('customerName')?.setValue(input.value);
  }

  onPlanChange(event: any) {
   const selectedPlanId = event.target.value;
   this.selectedPlan = this.planDetails.find(plan => plan.id == selectedPlanId);
   this.isPlanSelected = true;
   console.log("selectedPlan",this.selectedPlan);
   // Access the modal window element dynamically
   const modalWindow = document.querySelector('.modal.show .modal-dialog');
   if (modalWindow) {
     modalWindow.classList.remove('modal-lg', 'modal-xl');
     modalWindow.classList.add(this.selectedPlan?.id ? 'custom-modal-xl' : 'modal-lg');
   }
  }

}
