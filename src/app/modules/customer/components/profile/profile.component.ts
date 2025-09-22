import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateProfileComponent } from '../../modals/update-profile/update-profile.component';


import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('logoutModal') logoutModal!: TemplateRef<any>;
  userId: any;
  userData: any;
  userDataForEdit: any;
  changePasswordForm!: FormGroup;
  formSubmitted = false;
  activeTab = 1;
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private appStateService: AppStateService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.userId = this.appStateService.getUser().user.customer_id;
    this.getCustomerAdminById();

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }



  updateProfile(type: 'create' | 'edit', formData?: any) {
    // Add scroll lock class to body
    document.body.classList.add('modal-open-scroll-lock');

    const modalRef = this.modalService.open(UpdateProfileComponent, {
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
          console.log('Customer profile updated.');
          setTimeout(() => {
            this.getCustomerAdminById();
          }, 80);
        
        }
        // Remove scroll lock
        document.body.classList.remove('modal-open-scroll-lock');
      })
      .catch(() => {
        // Remove scroll lock even on dismiss
        document.body.classList.remove('modal-open-scroll-lock');
      });

  }


  // Custom password strength validator
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;

    const errors: ValidationErrors = {};
    if (!isLongEnough) errors['minLength'] = true;
    if (!hasUpperCase) errors['noUpperCase'] = true;
    if (!hasLowerCase) errors['noLowerCase'] = true;
    if (!hasNumeric) errors['noNumeric'] = true;
    if (!hasSpecialChar) errors['noSpecialChar'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Custom password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (!newPassword || !confirmPassword) return null;
    
    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  openModal(content: any, size: string) {
    this.modalService.open(content, { size: size });
  }

  getCustomerAdminById() {
    this.customerService
      .getCustomerAdminById(this.userId)
      .subscribe((res: any) => {
        this.userDataForEdit = res.data;
        this.userData = {
          UserId: res.data.customer_id,
          OrgName: res.data.organization_name,
          ContactPersonName: res.data.contact_person_name,
          BusinessType: res.data.customer_type_name,
          MobileNumber: res.data.contact_number,
          Currency: res.data.currency,
          Email: res.data.email,
          Address: res.data.address,
        };
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.modalService.dismissAll();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.changePasswordForm.get(field);
    return !!(
      control &&
      (control.touched || this.formSubmitted) &&
      control.invalid
    );
  }

  // Get specific validation error for a field (one at a time)
  getFieldError(field: string): string {
    const control = this.changePasswordForm.get(field);
    if (!control || !control.errors || (!control.touched && !this.formSubmitted)) {
      return '';
    }

    if (control.errors['required']) {
      return `${field === 'currentPassword' ? 'Current' : field === 'newPassword' ? 'New' : 'Confirm'} password is required`;
    }

    if (field === 'newPassword') {
      // Return the first validation error found
      if (control.errors['minLength']) return 'Password must be at least 8 characters long';
      if (control.errors['noUpperCase']) return 'Password must contain at least one uppercase letter';
      if (control.errors['noLowerCase']) return 'Password must contain at least one lowercase letter';
      if (control.errors['noNumeric']) return 'Password must contain at least one number';
      if (control.errors['noSpecialChar']) return 'Password must contain at least one special character';
    }

    return '';
  }

  // Get the first validation requirement that's not met
  getFirstUnmetRequirement(): string {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    if (!newPassword) return '';

    if (newPassword.length < 8) return 'At least 8 characters';
    if (!/[A-Z]/.test(newPassword)) return 'One uppercase letter';
    if (!/[a-z]/.test(newPassword)) return 'One lowercase letter';
    if (!/[0-9]/.test(newPassword)) return 'One number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) return 'One special character';
    
    return '';
  }

  // Check if all password requirements are met
  allRequirementsMet(): boolean {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    return newPassword.length >= 8 && 
           /[A-Z]/.test(newPassword) && 
           /[a-z]/.test(newPassword) && 
           /[0-9]/.test(newPassword) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  }

  // Check if passwords match
  passwordsMatch(): boolean {
    return this.changePasswordForm.get('newPassword')?.value === this.changePasswordForm.get('confirmPassword')?.value;
  }

  // Get password strength requirements
  getPasswordRequirements(): string[] {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    const requirements = [];
    
    if (newPassword.length < 8) requirements.push('At least 8 characters');
    if (!/[A-Z]/.test(newPassword)) requirements.push('One uppercase letter');
    if (!/[a-z]/.test(newPassword)) requirements.push('One lowercase letter');
    if (!/[0-9]/.test(newPassword)) requirements.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) requirements.push('One special character');
    
    return requirements;
  }

  // Individual password requirement checkers
  hasMinLength(): boolean {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    return newPassword.length >= 8;
  }

  hasUpperCase(): boolean {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    return /[A-Z]/.test(newPassword);
  }

  hasLowerCase(): boolean {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    return /[a-z]/.test(newPassword);
  }

  hasNumeric(): boolean {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    return /[0-9]/.test(newPassword);
  }

  hasSpecialChar(): boolean {
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    return /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  }

  changePassword() {
    this.formSubmitted = true;
    this.changePasswordForm.markAllAsTouched();
    if(this.changePasswordForm.invalid) {
      return;
    }

   const newPassword =  bcrypt.hashSync(this.changePasswordForm.value.newPassword, 10)

    const formData = {
      password : newPassword
    }

    this.customerService
      .changePassword(this.userId, formData)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.toastService.showSuccess('Password changed successfully');
          } else {
            this.toastService.showError('Failed to change password');
          }
        },
        (error: any) => {
          this.toastService.showError(error.error.message);
        }
      );
  }
}
