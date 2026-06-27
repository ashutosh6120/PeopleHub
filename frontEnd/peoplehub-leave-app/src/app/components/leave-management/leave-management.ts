import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  EmployeeLeaveProfile,
  LeaveRequest,
  LeaveStatus,
} from '../../interfaces/leave.request.interface';
import { LeaveRequestService } from '../../services/leave-request';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

type TabKey = 'Pending' | 'Approved' | 'Rejected' | 'All';

@Component({
  selector: 'app-leave-management',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './leave-management.html',
  styleUrl: './leave-management.scss',
})
export class LeaveManagementComponent implements OnInit, OnDestroy {
  activeTab: TabKey = 'Pending';
  isAdmin = false;
  currentUserName = '';
  currentUserEmployeeId: string | number | null = null;

  filterEmployeeId: string | null = null;
  filterEmployeeName = '';

  requests: LeaveRequest[] = [];
  visibleRequests: LeaveRequest[] = [];

  isLoading = false;
  isUpdatingStatus = false;
  errorMessage = '';

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private subscription = new Subscription();

  constructor(
    private leaveRequestService: LeaveRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    const user = (window as any).__HR_PORTAL_USER__;
    this.isAdmin = user?.role === 'Admin';
    this.currentUserName = user?.name ?? '';

    const paramsSub = this.route.queryParamMap.subscribe((params) => {
      const employeeIdValue = params.get('employeeId');
      const hasExternalFilter = !!employeeIdValue;

      this.filterEmployeeId = hasExternalFilter ? employeeIdValue : null;
      this.filterEmployeeName = hasExternalFilter ? (params.get('employeeName') ?? '') : '';

      if (this.isAdmin) {
        this.refreshData();
        return;
      }

      this.loadCurrentUserProfileAndRefresh();
    });

    this.subscription.add(paramsSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }

  get isEmployeeMode(): boolean {
    return !this.isAdmin && !this.filterEmployeeId;
  }

  get employeeLeaveBalances(): Array<{
    type: string;
    remaining: number;
    total: number;
    progressPct: number;
  }> {
    const totals: Record<string, number> = {
      'Sick Leave': 7,
      'Casual Leave': 5,
      'Earned Leave': 15,
    };

    const approved = this.requests.filter((item) => item.status === 'Approved');

    return ['Sick Leave', 'Casual Leave', 'Earned Leave'].map((type) => {
      const used = approved
        .filter((item) => item.type === type)
        .reduce((sum, item) => sum + item.days, 0);
      const total = totals[type];
      const remaining = Math.max(0, total - used);
      const progressPct = total > 0 ? Math.round((remaining / total) * 100) : 0;
      return { type, remaining, total, progressPct };
    });
  }

  get tabs(): Array<{ key: TabKey; label: string; count: number }> {
    return [
      { key: 'Pending', label: 'Pending', count: this.getCountByStatus('Pending') },
      { key: 'Approved', label: 'Approved', count: this.getCountByStatus('Approved') },
      { key: 'Rejected', label: 'Rejected', count: this.getCountByStatus('Rejected') },
      { key: 'All', label: 'All', count: this.requests.length },
    ];
  }

  setTab(tab: TabKey): void {
    this.activeTab = tab;
    this.applyViewFilter();
  }

  clearEmployeeFilter(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }

  showAllRequests(): void {
    history.pushState(null, '', '/leaves');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  approve(request: LeaveRequest): void {
    if (this.isUpdatingStatus) {
      return;
    }

    this.isUpdatingStatus = true;
    this.errorMessage = '';

    const approveSub = this.leaveRequestService.updateStatus(request.id, 'Approved').subscribe({
      next: () => {
        this.isUpdatingStatus = false;
        this.refreshData();
        this.showToast('Leave request approved', 'success');
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error?.error?.message || 'Failed to approve leave request';
        this.isUpdatingStatus = false;
      },
    });

    this.subscription.add(approveSub);
  }

  reject(request: LeaveRequest): void {
    if (this.isUpdatingStatus) {
      return;
    }

    this.isUpdatingStatus = true;
    this.errorMessage = '';

    const rejectSub = this.leaveRequestService.updateStatus(request.id, 'Rejected').subscribe({
      next: () => {
        this.isUpdatingStatus = false;
        this.refreshData();
        this.showToast('Leave request rejected', 'danger');
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error?.error?.message || 'Failed to reject leave request';
        this.isUpdatingStatus = false;
      },
    });

    this.subscription.add(rejectSub);
  }

  shouldShowActionButtons(): boolean {
    return this.isAdmin && !this.filterEmployeeId && this.activeTab === 'Pending';
  }

  onApplyLeave(): void {
    this.router.navigate(['/apply']);
  }

  getStatusClass(status: LeaveStatus): string {
    if (status === 'Approved') {
      return 'status-approved';
    }
    if (status === 'Rejected') {
      return 'status-rejected';
    }
    return 'status-pending';
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM d, y') ?? date;
  }

  closeToast(): void {
    this.toastVisible = false;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }

  private loadCurrentUserProfileAndRefresh(): void {
    if (!this.currentUserName) {
      this.errorMessage = 'Current user profile is unavailable.';
      this.requests = [];
      this.visibleRequests = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const profileSub = this.leaveRequestService
      .getEmployeeProfileByName(this.currentUserName)
      .subscribe({
        next: (profile: EmployeeLeaveProfile) => {
          this.currentUserEmployeeId = profile.employeeId;
          this.refreshData();
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage = error?.error?.message || 'Failed to load employee profile';
          this.requests = [];
          this.visibleRequests = [];
          this.isLoading = false;
        },
      });

    this.subscription.add(profileSub);
  }

  private refreshData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const employeeIdFilter = this.isAdmin
      ? this.filterEmployeeId || undefined
      : this.currentUserEmployeeId || undefined;

    const requestsSub = this.leaveRequestService
      .getRequests(undefined, employeeIdFilter)
      .subscribe({
        next: (requests: LeaveRequest[]) => {
          this.requests = requests;

          if (this.currentUserEmployeeId && !this.isAdmin) {
            this.activeTab = 'All';
          }

          if (this.filterEmployeeId && this.isAdmin) {
            this.activeTab = 'All';
          }

          this.applyViewFilter();
          this.isLoading = false;
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage = error?.error?.message || 'Failed to load leave requests';
          this.requests = [];
          this.visibleRequests = [];
          this.isLoading = false;
        },
      });

    this.subscription.add(requestsSub);
  }

  private applyViewFilter(): void {
    if (this.activeTab === 'All') {
      this.visibleRequests = [...this.requests];
      return;
    }

    this.visibleRequests = this.requests.filter((item) => item.status === this.activeTab);
  }

  private getCountByStatus(status: LeaveStatus): number {
    return this.requests.filter((item) => item.status === status).length;
  }

  private showToast(message: string, type: 'success' | 'danger'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
      this.toastTimer = null;
    }, 2500);
  }
}
