import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { DeleteDialogService } from '../../../../services/delete-dialog';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-actions-cell-renderer',
  imports: [CommonModule],
  templateUrl: './actions-cell-renderer.html',
  styleUrl: './actions-cell-renderer.scss',
})
export class ActionsCellRenderer implements ICellRendererAngularComp {
  employeeId: string | number = 0;
  employeeName = '';
  isAdmin = false;

  constructor(
    private router: Router,
    private deleteDialog: DeleteDialogService,
  ) {}

  agInit(params: ICellRendererParams) {
    this.employeeId = params.value;
    this.employeeName = params.data.name;
    let user = (window as any).__HR_PORTAL_USER__;
    if (!user) {
      try {
        const storedUser = localStorage.getItem('hr_portal_user');
        user = storedUser ? JSON.parse(storedUser) : null;
      } catch {
        user = null;
      }
    }

    this.isAdmin = user?.role === 'Admin';
  }

  onView() {
    this.router.navigate(['/profile', this.employeeId]);
  }

  onEdit() {
    this.router.navigate(['edit', this.employeeId]);
  }

  onDelete() {
    this.deleteDialog.open(this.employeeId, this.employeeName);
  }

  refresh(params: ICellRendererParams) {
    return false;
  }
}
