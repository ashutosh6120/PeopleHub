import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { LeaveRequest, LeaveStatus } from '../../interfaces/leave.request.interface';
import { LeaveRequestService } from '../../services/leave-request';
import { ActivatedRoute, Router } from '@angular/router';

type TabKey = 'Pending' | 'Approved' | 'Rejected' | 'All';

@Component({
  selector: 'app-leave-management',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './leave-management.html',
  styleUrl: './leave-management.scss',
})
export class LeaveManagementComponent {
  activeTab: TabKey = 'Pending';
 isAdmin = false;
 currentUserName = '';
 currentUserEmployeeId: number | null = null;

 filterEmployeeId: number | null = null;
 filterEmployeeName = '';

 requests: LeaveRequest[] = [];
 visibleRequests: LeaveRequest[] = [];

 toastVisible = false;
 toastMessage = '';
 toastType: 'success' | 'danger' = 'success';
 private toastTimer: ReturnType<typeof setTimeout> | null = null;

 constructor(
 private leaveRequestService: LeaveRequestService,
 private route: ActivatedRoute,
 private router: Router,
 private datePipe: DatePipe
 ) {}

 ngOnInit(): void {
 const user = (window as any).__HR_PORTAL_USER__;
 this.isAdmin = user?.role === 'Admin';
 this.currentUserName = user?.name ?? '';

 if (!this.isAdmin && this.currentUserName) {
 this.currentUserEmployeeId = this.leaveRequestService.getEmployeeProfileByName(this.currentUserName).employeeId;
 }

 this.route.queryParamMap.subscribe((params) => {
 const employeeIdValue = params.get('employeeId');
 const hasExternalFilter = !!employeeIdValue;

 this.filterEmployeeId = hasExternalFilter ? Number(employeeIdValue) : null;
 this.filterEmployeeName = hasExternalFilter ? params.get('employeeName') ?? '' : '';
 this.refreshData();
 });
 }

 get isEmployeeMode(): boolean {
 return !this.isAdmin && !this.filterEmployeeId;
 }

 get employeeLeaveBalances(): Array<{ type: string; remaining: number; total: number; progressPct: number }> {
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
 history.pushState(null, '', '/app2');
 window.dispatchEvent(new PopStateEvent('popstate'));
 }

 approve(request: LeaveRequest): void {
 this.leaveRequestService.updateStatus(request.id, 'Approved');
 this.refreshData();
 this.showToast('Leave request approved', 'success');
 }

 reject(request: LeaveRequest): void {
 this.leaveRequestService.updateStatus(request.id, 'Rejected');
 this.refreshData();
 this.showToast('Leave request rejected', 'danger');
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

 private refreshData(): void {
 this.requests = this.leaveRequestService.getRequests();

 if (this.currentUserEmployeeId && !this.isAdmin) {
 this.requests = this.requests.filter((item) => item.employeeId === this.currentUserEmployeeId);
 this.activeTab = 'All';
 }

 if (this.filterEmployeeId && this.isAdmin) {
 this.requests = this.requests.filter((item) => item.employeeId === this.filterEmployeeId);
 this.activeTab = 'All';
 }
 this.applyViewFilter();
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
