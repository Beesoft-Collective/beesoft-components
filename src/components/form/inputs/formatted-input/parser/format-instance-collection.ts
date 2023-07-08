import { InputFormat } from '../input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { InputSlotCollection } from './input-slot-collection';

export class FormatInstanceCollection {
  private static instance: FormatInstanceCollection;

  private readonly navigatorInstances: Record<string, FormatNavigator>;
  private readonly inputSlotInstances: Record<string, InputSlotCollection>;

  private constructor() {
    this.navigatorInstances = {};
    this.inputSlotInstances = {};
  }

  public static getInstance(): FormatInstanceCollection {
    if (!this.instance) {
      this.instance = new FormatInstanceCollection();
    }

    return this.instance;
  }

  public getNavigatorInstance(instanceKey: string, format: InputFormat) {
    if (!this.navigatorInstances[instanceKey]) {
      const inputSlotCollection = this.getInputSlotInstance(instanceKey, format);
      this.navigatorInstances[instanceKey] = new FormatNavigator(format, instanceKey, inputSlotCollection);
    }

    return this.navigatorInstances[instanceKey];
  }

  public getInputSlotInstance(instanceKey: string, format: InputFormat) {
    if (!this.inputSlotInstances[instanceKey]) {
      this.inputSlotInstances[instanceKey] = new InputSlotCollection(format);
    }

    return this.inputSlotInstances[instanceKey];
  }

  public removeInstances(instanceKey: string) {
    if (this.navigatorInstances[instanceKey]) {
      delete this.navigatorInstances[instanceKey];
    }

    if (this.inputSlotInstances[instanceKey]) {
      delete this.inputSlotInstances[instanceKey];
    }
  }
}
