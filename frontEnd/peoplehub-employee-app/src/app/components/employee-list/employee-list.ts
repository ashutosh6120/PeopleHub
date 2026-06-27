import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActionsCellRenderer } from './cell-renderers/actions-cell-renderer/actions-cell-renderer';
import { DepartmentCellRenderer } from './cell-renderers/department-cell-renderer/department-cell-renderer';
import { AvatarCellRenderer } from './cell-renderers/avatar-cell-renderer/avatar-cell-renderer';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';
import { ColDef, themeQuartz } from 'ag-grid-community';
import { Employee } from '../../interfaces/employee';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, FormsModule, AgGridAngular, DeleteConfirmDialog],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeList implements OnInit, OnDestroy {
  employees: Employee[] = [];
  searchTerm = '';
  isAdmin = false;
  isLoading = false;
  errorMessage = '';

  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    minWidth: 200,
  };
  theme = themeQuartz.withParams({ accentColor: '#1976D2' });

  private subscription: Subscription = new Subscription();

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = (window as any).__HR_PORTAL_USER__;
    this.isAdmin = user?.role === 'Admin';
    this.setupColumns();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setupColumns(): void {
    this.columnDefs = [
      {
        headerName: 'NAME',
        field: 'name',
        cellRenderer: AvatarCellRenderer,
      },
      { headerName: 'EMAIL', field: 'email' },
      {
        headerName: 'DEPARTMENT',
        field: 'department',
        cellRenderer: DepartmentCellRenderer,
      },
      { headerName: 'POSITION', field: 'position' },
      { headerName: 'PHONE', field: 'phone' },
      {
        headerName: 'JOINING DATE',
        field: 'joiningDate',
        valueFormatter: (params) => {
          const date = new Date(params.value);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        },
      },
      {
        headerName: 'ACTIONS',
        field: 'id',
        sortable: false,
        filter: false,
        minWidth: 250,
        flex: 1,
        cellRenderer: ActionsCellRenderer,
      },
    ];
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const loadSub = this.employeeService.getEmployees(this.searchTerm || undefined, 1, 10).subscribe(
      (response: any) => {
        this.employees = response.employees;
        this.isLoading = false;
      },
      (error: any) => {
        this.errorMessage = error?.error?.message || 'Failed to load employees';
        this.isLoading = false;
        console.error('Error loading employees:', error);
      }
    );

    this.subscription.add(loadSub);
  }

  onSearch(): void {
    this.loadEmployees();
  }

  onAdd(): void {
    this.router.navigate(['/add']);
  }

  onConfirmDelete(employeeId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    const deleteSub = this.employeeService.deleteEmployee(employeeId).subscribe(
      () => {
        this.isLoading = false;
        this.loadEmployees();
      },
      (error: any) => {
        this.errorMessage = error?.error?.message || 'Failed to delete employee';
        this.isLoading = false;
        console.error('Error deleting employee:', error);
      }
    );

    this.subscription.add(deleteSub);
  }
}
