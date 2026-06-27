import { Component } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-profile',
  imports: [CommonModule],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.scss',
})
export class EmployeeProfile {
   employee: Employee | null = null;
  initials = '';
  avatarColor = '#1976D2';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    const result = this.employeeService.getEmployeeById(id);
    if (!result) {
      this.router.navigate(['/']);
      return;
    }

    this.employee = result;
    this.initials = this.employee.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

    const colors = ['#0284c7', '#0f766e', '#7e22ce', '#1d4ed8', '#dc2626', '#ea580c'];
    this.avatarColor = colors[this.employee.name.charCodeAt(0) % colors.length];
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onViewLeaveHistory(): void {
    if (!this.employee) {
      return;
    }

    const employeeName = encodeURIComponent(this.employee.name);
    const targetPath = `/leaves?employeeId=${this.employee.id}&employeeName=${employeeName}`;
    history.pushState(null, '', targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
