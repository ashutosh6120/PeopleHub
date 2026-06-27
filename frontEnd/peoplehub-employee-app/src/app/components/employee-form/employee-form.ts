import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../interfaces/employee';
import { EmployeeService } from '../../services/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm implements OnInit, OnDestroy {
  isEditMode = false;
  employeeId: string | null = null;
  departments: string[] = ['HR', 'Engineering', 'Finance', 'Marketing', 'Operations'];
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  validationMessage = '';

  private subscription = new Subscription();

  formData = {
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '' as Employee['department'] | '',
    joiningDate: '',
  };

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = id;
      this.loadEmployee(id);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadEmployee(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    const employeeSub = this.employeeService.getEmployeeById(id).subscribe({
      next: (employee: Employee) => {
        this.formData = {
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          joiningDate: employee.joiningDate,
        };
        this.isLoading = false;
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error?.error?.message || 'Failed to load employee details';
        this.isLoading = false;
      },
    });

    this.subscription.add(employeeSub);
  }

  onSave(): void {
    this.validationMessage = '';
    this.errorMessage = '';

    if (!this.formData.name || !this.formData.email || !this.formData.department) {
      this.validationMessage = 'Name, email, and department are required.';
      return;
    }

    this.isSaving = true;

    const request$ =
      this.isEditMode && this.employeeId
        ? this.employeeService.updateEmployee(this.employeeId, this.formData as Partial<Employee>)
        : this.employeeService.addEmployee(this.formData as Omit<Employee, 'id'>);

    const saveSub = request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error?.error?.message || 'Failed to save employee';
        this.isSaving = false;
      },
    });

    this.subscription.add(saveSub);
  }

  onCancel(): void {
    if (this.isSaving) {
      return;
    }

    this.router.navigate(['/']);
  }
}
