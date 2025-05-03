import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UserActions from '../../store/user/user.actions';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form;
  isRegisterMode = false;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  loginOrRegister() {
    if (this.form.valid) {
      const { username, password } = this.form.value;

      if (this.isRegisterMode) {
        if (username && password) {
          this.store.dispatch(UserActions.register({ username, password }));
        }
      } else {
        if (username && password) {
          this.store.dispatch(UserActions.login({ username, password }));
        }
      }
    }
  }
}
