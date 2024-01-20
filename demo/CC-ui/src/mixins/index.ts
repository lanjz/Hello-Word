export const FinInject = (superClass) => class extends superClass {
  emitEventMX(eventName: string, value: string | null) {
    const event = new CustomEvent(eventName, { detail: value })
    this.dispatchEvent(event)
  }
  emitEventModelMX(value: string | null) {
    this.emitEventMX('input', value)
  }
};
