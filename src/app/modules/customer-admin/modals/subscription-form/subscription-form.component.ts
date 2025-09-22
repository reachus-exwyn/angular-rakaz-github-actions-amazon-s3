import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO } from 'ngx-intl-tel-input';
import { CustomerAdminService } from '../../services/customer-admin.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-customer-admin-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss'],
})
export class SubscriptionFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() data: any;

  subscriptionForm!: FormGroup;
  formSubmitted = false;
  userId: number = 0;
  periods = [
    { id: 1, period: 'Monthly' },
    { id: 2, period: 'Yearly' },
  ];
  paymentProviders = [{ id: 1, payment_provider: 'Stripe' }];
  selectedPaymentProvider: any;
  selectedPeriod: any;
organizationId:number=0;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private customerAdminService: CustomerAdminService,
    private appStateService: AppStateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userId = this.appStateService.getUser().user.id;
    this.organizationId = this.appStateService.getUser().user.organization_id;
    this.buildSubscriptionForm();

    if (this.mode === 'edit') {
      this.subscriptionForm.patchValue({
        planName: this.data.plan_name,
        currency: this.data.currency,
        price: this.data.price,
        period: this.periods.find(p => p.period === this.data.period)?.id,
        paymentProvider: this.paymentProviders.find(p => p.payment_provider === this.data.payment_provider)?.id, 
        status: this.data.status,
      });

      this.descriptions.clear(); // remove initial empty one
      this.data.descriptions.forEach((d: string) => {
        this.addDescription();
        this.descriptions
          .at(this.descriptions.length - 1)
          .patchValue({ description: d });
      });
    }
  }

  private buildSubscriptionForm(): void {
    this.subscriptionForm = this.fb.group({
      planName: ['', Validators.required],
      currency: ['AED', Validators.required],
      price: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)],
      ],
      period: ['', Validators.required],
      paymentProvider: ['', Validators.required],
      descriptions: this.fb.array([this.createDescriptionField()]),
      status: ['active'], // default
    });
  }

  // Create description form control
  createDescriptionField(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
    });
  }

  // Getter for FormArray
  get descriptions(): FormArray {
    return this.subscriptionForm.get('descriptions') as FormArray;
  }

  // Add new description field
  addDescription(): void {
    this.descriptions.push(this.createDescriptionField());
  }

  // Remove description field
  removeDescription(index: number): void {
    this.descriptions.removeAt(index);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.subscriptionForm.get(field);
    return !!(
      control &&
      (control.touched || this.formSubmitted) &&
      control.invalid
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.subscriptionForm.valid) {
      if (this.mode === 'create') {
        const formData = {
          plan_name: this.subscriptionForm.value.planName,
          currency: this.subscriptionForm.value.currency,
          price: this.subscriptionForm.value.price,
          period: this.subscriptionForm.value.period,
          payment_provider: this.subscriptionForm.value.paymentProvider,
          descriptions: this.subscriptionForm.value.descriptions,
          status: this.subscriptionForm.value.status,
          created_by: this.userId,
          organization_id:this.organizationId
        };

        this.customerAdminService.createSubscription(formData).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastService.showSuccess(
                'Subscription created successfully'
              );
              this.activeModal.close('saved');
            } else {
              this.toastService.showError('Failed to create subscription');
            }
          },
          (error: any) => {
            this.toastService.showError(error.error.message);
          }
        );
        this.subscriptionForm.reset();
        this.formSubmitted = false;
      } else if (this.mode === 'edit') {
        const formData = {
          plan_name: this.subscriptionForm.value.planName,
          currency: this.subscriptionForm.value.currency,
          price: this.subscriptionForm.value.price,
          period: this.subscriptionForm.value.period,
          payment_provider: this.subscriptionForm.value.paymentProvider,
          descriptions: this.subscriptionForm.value.descriptions,
          status: this.subscriptionForm.value.status,
          modified_by: this.userId,
          organization_id:this.organizationId
        };

        this.customerAdminService
          .updateSubscription(this.data.id, formData)
          .subscribe(
            (res: any) => {
              if (res.success) {
                this.toastService.showSuccess(
                  'Subscription updated successfully'
                );
                
                this.activeModal.close('saved');
              } else {
                this.toastService.showError('Failed to update subscription');
              }
            },
            (error: any) => {
              this.toastService.showError(error.error.message);
            }
          );
        this.subscriptionForm.reset();
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
    this.subscriptionForm.get('planName')?.setValue(input.value);
  }
}
