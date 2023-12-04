import { InputFormat } from '../input-format.interfaces';
import { FormatNavigator } from './format-navigator';
import { InputSlotCollection } from './input-slot-collection';

export class FormatInstanceCollectionManager {
  private static instance: FormatInstanceCollection;

  public static getInstance(): FormatInstanceCollection {
    if (!this.instance) {
      this.instance = new FormatInstanceCollection();
    }

    return this.instance;
  }
}

export class FormatInstanceCollection {
  private readonly navigatorInstances: Record<string, FormatNavigator>;
  private readonly inputSlotInstances: Record<string, InputSlotCollection>;

  constructor() {
    this.navigatorInstances = {};
    this.inputSlotInstances = {};
  }

  public getNavigatorInstance(instanceKey: string, format: InputFormat) {
    if (!this.navigatorInstances[instanceKey]) {
      this.navigatorInstances[instanceKey] = new FormatNavigator(format, instanceKey);
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
