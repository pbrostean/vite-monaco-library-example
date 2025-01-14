import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();

interface EventEmitterInterface {
  on(event: string | symbol, fn: (...args: any[]) => void): void;
  once(event: string | symbol, fn: (...args: any[]) => void): void;
  off(event: string | symbol, fn: (...args: any[]) => void): void;
  emit(event: string | symbol, payload?: any): void;
}

export const emitter: EventEmitterInterface = {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload),
};

Object.freeze(emitter);
