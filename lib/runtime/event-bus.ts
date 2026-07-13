type EventHandler<T = any> = (data: T) => void | Promise<void>;

class EventBusEmitter {
  private listeners: Record<string, EventHandler[]> = {};

  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  off<T>(event: string, handler: EventHandler<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  async emit<T>(event: string, data: T): Promise<void> {
    if (!this.listeners[event]) return;
    const promises = this.listeners[event].map(handler => {
      try {
        return Promise.resolve(handler(data));
      } catch (err) {
        console.error(`Error in event handler for ${event}`, err);
      }
    });
    await Promise.all(promises);
  }
}

export const EventBus = new EventBusEmitter();
export const AgentEvents = {
  TASK_CREATED: 'task:created',
  TASK_COMPLETED: 'task:completed',
  TASK_FAILED: 'task:failed',
  WORKFLOW_COMPLETED: 'workflow:completed',
};
