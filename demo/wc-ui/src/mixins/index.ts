import { LitElement, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';

export const FinInject = <T extends new (...args: any[]) => LitElement>(superClass: T) => {
  @customElement('fin-injected') // 示例自定义元素名称
  class FinInjectedElement extends superClass {
    emitEventMX(eventName: string, value: string | null) {
      const event = new CustomEvent(eventName, { detail: value });
      this.dispatchEvent(event);
    }

    emitEventModelMX(value: string | null) {
      this.emitEventMX('input', value);
    }

    // 如果需要在 LitElement 生命周期方法中添加逻辑，可以在此处覆盖方法
    updated(changedProperties: PropertyValues) {
      super.updated(changedProperties);
      // 添加您的逻辑
    }
  }

  return FinInjectedElement;
};
