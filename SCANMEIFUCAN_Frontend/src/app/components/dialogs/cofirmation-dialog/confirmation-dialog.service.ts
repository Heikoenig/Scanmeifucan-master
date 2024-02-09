// confirmation-dialog.service.ts

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) { }

  openConfirmationDialog(title: string, message: string, width :string = '300px'): Observable<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, {
      width: width,
      data: { title, message }
    });

    return dialogRef.afterClosed();
  }
}