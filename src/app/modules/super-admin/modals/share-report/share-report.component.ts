import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminService } from '../../services/super-admin.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AppStateService } from 'src/app/shared/services/app-state.service';
@Component({
  selector: 'app-share-report',
  templateUrl: './share-report.component.html',
  styleUrls: ['./share-report.component.scss']
})
export class ShareReportComponent implements OnInit {
  frmShareReport!: FormGroup;
  formSubmitted = false;
  userId: number = 0;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private superAdminService: SuperAdminService,
    private toastService: ToastService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.frmShareReport = this.fb.group({
      email: ['', Validators.required],
    });

    this.userId = this.appStateService.getUser().user.id;

  }

  isFieldInvalid(field: string): boolean {
    const control = this.frmShareReport.get(field);
    return !!(
      control &&
      (control.touched || this.formSubmitted) &&
      control.invalid
    );
  } 

  close() {
    this.activeModal.dismiss();
  }
}
