import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TasksEffects } from './store/tasks/tasks.effects';
import { tasksReducer } from './store/tasks/tasks.reducer';

// Socket.io
import { SocketIoModule } from 'ngx-socket-io';
import { socketConfig } from './config/socket.config';
import { authInterceptor } from './interceptors/auth.interceptor';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig)),
    provideStore(),
    provideEffects([TasksEffects, UserEffects]),
    provideState('tasks', tasksReducer),
    provideState('user', userReducer),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
