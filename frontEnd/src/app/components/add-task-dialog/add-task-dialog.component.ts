import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { inject, DestroyRef } from '@angular/core';
import { Task } from '../../models/task.model';
import { Store } from '@ngrx/store';

// Angular Material
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'he-IL' },
    provideNativeDateAdapter(),
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
})
export class AddTaskDialogComponent {
  readonly destroyRef = inject(DestroyRef);
  form;
  readonly taskId: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data?: Task
  ) {
    this.taskId = data?._id!;
    this.form = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],
      priority: [data?.priority || 'low', Validators.required],
      dueDate: [
        data?.dueDate ? new Date(data.dueDate) : null,
        Validators.required,
      ],
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data, ...this.form.value });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
