import { InputFormat } from '../formatted-input.interfaces';
import { FormatKeyValidator } from './format-key-validator';
import { IDisposable } from './format-parser.interfaces';

export class FormatParser implements IDisposable {
  private readonly formatValidator: FormatKeyValidator;
  private inputElement: HTMLElement | undefined;

  constructor(private format: InputFormat) {
    this.formatValidator = new FormatKeyValidator(format);
  }

  public inputElementCreated(element: HTMLElement) {
    this.inputElement = element;
  }

  public dispose() {
    // dispose of items here
  }
}
