import { Component, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-profile',
  imports: [CommonModule],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.scss',
})
export class EmployeeProfile implements OnInit, OnDestroy {
  employee: Employee | null = null;
  initials = '';
  avatarColor = '#1976D2';
  isLoading = false;
  errorMessage = '';

  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.loadEmployee(id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadEmployee(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    const employeeSub = this.employeeService.getEmployeeById(id).subscribe({
      next: (employee: Employee) => {
        this.employee = employee;
        this.setProfileVisuals(employee);
        this.isLoading = false;
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error?.error?.message || 'Failed to load employee profile';
        this.employee = null;
        this.isLoading = false;
        console.error('Error loading employee profile:', error);
      },
    });

    this.subscription.add(employeeSub);
  }

  private setProfileVisuals(employee: Employee): void {
    this.initials = employee.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    const colors = ['#0284c7', '#0f766e', '#7e22ce', '#1d4ed8', '#dc2626', '#ea580c'];
    this.avatarColor = colors[employee.name.charCodeAt(0) % colors.length];
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onViewLeaveHistory(): void {
    if (!this.employee) {
      return;
    }

    const employeeName = encodeURIComponent(this.employee.name);
    const employeeId = (this.employee as Employee & { _id?: string })._id || String(this.employee.id);
    const targetPath = `/leaves?employeeId=${employeeId}&employeeName=${employeeName}`;
    history.pushState(null, '', targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}