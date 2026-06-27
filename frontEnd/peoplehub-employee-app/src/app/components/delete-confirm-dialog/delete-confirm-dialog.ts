import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DeleteDialogService } from '../../services/delete-dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './delete-confirm-dialog.html',
  styleUrl: './delete-confirm-dialog.scss',
})
export class DeleteConfirmDialog {
  @Output() confirmDelete = new EventEmitter<number>();

  protected readonly deleteDialog = inject(DeleteDialogService);

  onCancel() {
    this.deleteDialog.close();
  }

  onConfirm() {
    const employeeId = this.deleteDialog.state().employeeId;
    if(employeeId !== null) {
      this.confirmDelete.emit(employeeId);
    }
    this.deleteDialog.close();
  }
}
