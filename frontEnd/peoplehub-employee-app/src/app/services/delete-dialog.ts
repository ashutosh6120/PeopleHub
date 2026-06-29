import { Injectable, signal } from "@angular/core";
import { DeleteDialogState } from "../interfaces/delete-dialog";

@Injectable({
  providedIn: 'root',
})
export class DeleteDialogService {
    readonly state = signal<DeleteDialogState>({
        isOpen: false,
        employeeId: null,
        employeeName: '',
    });

    open(employeeId: string | number, employeeName: string) {
        this.state.set({
            isOpen: true,
            employeeId,
            employeeName,
        });
    }

    close() {
        this.state.set({
            isOpen: false,
            employeeId: null,
            employeeName: '',
        });
    }
}