/* eslint-disable @typescript-eslint/no-explicit-any */
import Emittery from "emittery";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Events {}

type UnsubscribeFn = () => void;

export interface IEmitter<EventDataMap extends Events> {
  on<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): UnsubscribeFn;

  once<Name extends keyof EventDataMap>(
    eventName: Name
  ): Promise<EventDataMap[Name]>;

  off<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): void;

  onAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): UnsubscribeFn;
  offAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): void;

  emit<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void>;

  emitSerial<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void>;
}

/**
 * Base events emitter
 */
export class Emitter<EventDataMap extends Events>
  implements IEmitter<EventDataMap>
{
  private _emitter: Emittery.Typed<EventDataMap>;

  public constructor() {
    this._emitter = new Emittery.Typed<EventDataMap>();
  }

  public on<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): UnsubscribeFn {
    return this._emitter.on(eventName as any, listener as any);
  }

  public once<Name extends keyof EventDataMap>(
    eventName: Name
  ): Promise<EventDataMap[Name]> {
    return this._emitter.once(eventName as any);
  }

  public off<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): void {
    return this._emitter.off(eventName as any, listener as any);
  }

  public onAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): UnsubscribeFn {
    return this._emitter.onAny(listener as any);
  }

  public offAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): void {
    return this._emitter.offAny(listener as any);
  }

  public emit<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void> {
    return this._emitter.emit(eventName as any, eventData);
  }

  public emitSerial<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void> {
    return this._emitter.emitSerial(eventName as any, eventData);
  }
}
