import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as UserActions from './store/user/user.actions';
import { Store } from '@ngrx/store';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'CityShob';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserFromStorage());
  }
}
