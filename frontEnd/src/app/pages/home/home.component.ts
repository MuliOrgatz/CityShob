import { Component } from '@angular/core';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TasksService } from '../../services/tasks.service';
import { AddTaskDialogComponent } from '../../components/add-task-dialog/add-task-dialog.component';

// Angular Material
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [TaskListComponent, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private dialog: MatDialog, private tasksService: TasksService) {}

  openAddDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tasksService.addTask(result).subscribe();
      }
    });
  }
}
