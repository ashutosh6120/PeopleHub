import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveRequestService } from '../../services/leave-request';
import { Subscription } from 'rxjs';
import { EmployeeLeaveProfile } from '../../interfaces/leave.request.interface';

@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.scss',
})
export class ApplyLeaveComponent implements OnInit, OnDestroy {
  leaveTypes = ['Sick Leave', 'Casual Leave', 'Earned Leave'];
  form: FormGroup;
  calculatedDays = 0;
  isLoadingProfile = false;
  isSubmitting = false;
  errorMessage = '';

  private employeeId: string | number = '';
  private employeeName = '';
  private employeeInitials = '';
  private avatarColor = '#1976D2';
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private leaveRequestService: LeaveRequestService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    const user = (window as any).__HR_PORTAL_USER__;
    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.isLoadingProfile = true;
    this.errorMessage = '';

    const profileSub = this.leaveRequestService.getEmployeeProfileByName(user.name).subscribe({
      next: (profile: EmployeeLeaveProfile) => {
        this.employeeId = profile.employeeId;
        this.employeeName = profile.employeeName;
        this.employeeInitials = profile.employeeInitials;
        this.avatarColor = profile.avatarColor;
        this.isLoadingProfile = false;
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error?.error?.message || 'Failed to load employee profile';
        this.isLoadingProfile = false;
      },
    });

    this.subscription.add(profileSub);

    const fromDateSub = this.form.get('fromDate')?.valueChanges.subscribe(() => this.calculateDays());
    const toDateSub = this.form.get('toDate')?.valueChanges.subscribe(() => this.calculateDays());

    if (fromDateSub) {
      this.subscription.add(fromDateSub);
    }
    if (toDateSub) {
      this.subscription.add(toDateSub);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calculateDays(): void {
    const fromDate = this.form.get('fromDate')?.value;
    const toDate = this.form.get('toDate')?.value;

    if (!fromDate || !toDate) {
      this.calculatedDays = 0;
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to < from) {
      this.calculatedDays = 0;
      return;
    }

    const diffInMs = to.getTime() - from.getTime();
    this.calculatedDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
  }

  isFormValid(): boolean {
    return this.form.valid && this.calculatedDays > 0 && !this.isSubmitting && !this.isLoadingProfile;
  }

  onCancel(): void {
    if (this.isSubmitting) {
      return;
    }
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    const formValues = this.form.value;
    this.isSubmitting = true;
    this.errorMessage = '';

    const createLeaveSub = this.leaveRequestService.addRequest({
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      employeeInitials: this.employeeInitials,
      avatarColor: this.avatarColor,
      type: formValues.type,
      fromDate: formValues.fromDate,
      toDate: formValues.toDate,
      days: this.calculatedDays,
      reason: formValues.reason.trim(),
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error?.error?.message || 'Failed to submit leave request';
        this.isSubmitting = false;
      },
    });

    this.subscription.add(createLeaveSub);
  }
}
