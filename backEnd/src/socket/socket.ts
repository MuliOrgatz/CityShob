import { Server } from 'socket.io';
import { LockManager } from './lock-manager';

export function initSocketServer(io: Server) {
  const lockManager = new LockManager((taskId: string, lockedBy: string) => {
    console.log(`[Unlock] ${taskId} unlocked by ${lockedBy}`);
    io.emit('taskUnlocked', taskId);
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    let userName: string | null = null;

    socket.on('identify', (id: string) => {
      userName = id;
    });

    socket.on(
      'lockTask',
      ({ taskId, userName }: { taskId: string; userName: string }) => {
        lockManager.lock(taskId, userName);
        io.emit('taskLocked', { id: taskId, lockedBy: userName });
      }
    );

    socket.on('unlockTask', (taskId: string) => {
      lockManager.unlock(taskId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      if (userName) {
        lockManager.unlockAllByUser(userName);
      }
    });
  });
}
