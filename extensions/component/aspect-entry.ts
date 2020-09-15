import { ExtensionDataEntry } from 'bit-bin/dist/consumer/config/extension-data';
import Source from 'bit-bin/dist/scope/models/source';
import { AbstractVinyl } from 'bit-bin/dist/consumer/component/sources';
import { ComponentID } from './id';

export type Serializable = {
  toString(): string;
};

export type SerializableMap = {
  [key: string]: Serializable;
};

export class AspectEntry {
  constructor(public id: ComponentID, private legacyEntry: ExtensionDataEntry) {}

  get legacy() {
    return this.legacyEntry;
  }

  get isLegacy(): boolean {
    if (this.legacy.config?.__legacy) return true;
    return false;
  }

  get config() {
    return this.legacy.config;
  }

  get data() {
    return this.legacy.data;
  }

  set data(val: Record<string, any>) {
    this.legacy.data = val;
  }

  get artifacts() {
    return this.legacy.artifacts;
  }

  set artifacts(val: Array<AbstractVinyl | { relativePath: string; file: Source }>) {
    this.legacy.artifacts = val;
  }

  transform(newData: SerializableMap): AspectEntry {
    const newEntry = this.clone();
    newEntry.data = newData;
    return new AspectEntry(this.id, newEntry.legacy);
  }

  static create(aspectId: ComponentID, data: SerializableMap) {
    const extensionDataEntry = new ExtensionDataEntry(undefined, aspectId._legacy, undefined, {}, data, [], aspectId);
    return new AspectEntry(aspectId, extensionDataEntry);
  }

  clone(): AspectEntry {
    return new AspectEntry(this.id, this.legacyEntry.clone());
  }
}
