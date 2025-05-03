type LockEntry = {
  timeout: NodeJS.Timeout;
  lockedBy: string;
};

type LockMap = Map<string, LockEntry>;

export class LockManager {
  private locks: LockMap = new Map();

  constructor(
    private onUnlock: (taskId: string, lockedBy: string) => void,
    private timeoutMs = 30000 // 60 seconds
  ) {}

  lock(taskId: string, lockedBy: string) {
    this.clear(taskId);

    const timeout = setTimeout(() => {
      this.unlock(taskId);
    }, this.timeoutMs);
    this.locks.set(taskId, { timeout, lockedBy });
  }

  unlock(taskId: string) {
    const entry = this.locks.get(taskId);
    if (entry) {
      clearTimeout(entry.timeout);
      this.locks.delete(taskId);
      this.onUnlock(taskId, entry.lockedBy);
    }
  }

  clear(taskId: string) {
    const entry = this.locks.get(taskId);
    if (entry) {
      clearTimeout(entry.timeout);
      this.locks.delete(taskId);
    }
  }

  unlockAllByUser(userName: string) {
    for (const [taskId, entry] of this.locks.entries()) {
      if (entry.lockedBy === userName) {
        this.unlock(taskId);
      }
    }
  }

  has(taskId: string) {
    return this.locks.has(taskId);
  }

  getLockedBy(taskId: string): string | null {
    return this.locks.get(taskId)?.lockedBy ?? null;
  }
}
