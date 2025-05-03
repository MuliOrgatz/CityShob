import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  listenToEvent<T>(eventName: string): Observable<T> {
    return this.socket.fromEvent<T, any>(eventName);
  }

  lockTask(taskId: string, userName: string) {
    this.socket.emit('lockTask', { taskId, userName });
  }

  unlockTask(taskId: string): void {
    this.socket.emit('unlockTask', taskId);
  }
}
