import { Proto } from '../../input/proto';
import { ProtoMessage } from '../../input/proto-message';
import { ProtoMessageField } from '../../input/proto-message-field';
import { ProtoMessageFieldCardinality } from '../../input/types';
import { camelizeSafe } from '../../utils';
import { MessageField } from '../message-field';
import { getDataType } from '../misc/helpers';
import { Printer } from '../misc/printer';
import { OneOf } from '../oneof';

export class StringMessageField implements MessageField {

  private attributeName: string;
  private dataType: string;
  private isArray: boolean;

  constructor(
    private proto: Proto,
    private message: ProtoMessage,
    private messageField: ProtoMessageField,
    private oneOf?: OneOf,
  ) {
    this.attributeName = camelizeSafe(this.messageField.name);
    this.isArray = this.messageField.label === ProtoMessageFieldCardinality.repeated;
    this.dataType = getDataType(this.proto, this.messageField);
  }

  printFromBinaryReader(printer: Printer) {
    const readerCall = 'reader.readString()';

    if (this.isArray) {
      printer.add(`case ${this.messageField.number}: (instance.${this.attributeName} = instance.${this.attributeName} || []).push(${readerCall});`);
    } else {
      printer.add(`case ${this.messageField.number}: instance.${this.attributeName} = ${readerCall};`);
    }

    printer.add('break;');
  }

  printToBinaryWriter(printer: Printer) {
    printer.add(`if (instance.${this.attributeName} !== undefined && instance.${this.attributeName} !== null) {
      writer.write${this.isArray ? 'Repeated' : ''}String(${this.messageField.number}, instance.${this.attributeName});
    }`);
  }

  printPrivateAttribute(printer: Printer) {
    printer.add(`private _${this.attributeName}?: ${this.dataType};`);
  }

  printInitializer(printer: Printer) {
    if (this.isArray) {
      printer.add(`this.${this.attributeName} = (value.${this.attributeName} || []).slice();`);
    } else {
      printer.add(`this.${this.attributeName} = value.${this.attributeName}`);
    }
  }

  printDefaultValueSetter(printer: Printer) {
    if (this.oneOf) {
      return;
    } else if (this.isArray) {
      printer.add(`instance.${this.attributeName} = instance.${this.attributeName} || []`);
    } else {
      printer.add(`instance.${this.attributeName} = instance.${this.attributeName} || ''`);
    }
  }

  printGetter(printer: Printer) {
    printer.add(`get ${this.attributeName}(): ${this.dataType} | undefined { return this._${this.attributeName} }`);
  }

  printSetter(printer: Printer) {
    printer.add(`set ${this.attributeName}(value: ${this.dataType} | undefined) {
      ${this.oneOf ? this.oneOf.createFieldSetterAddon(this.messageField) : ''}
      this._${this.attributeName} = value;
    }`);
  }

  printToObjectMapping(printer: Printer) {
    if (this.isArray) {
      printer.add(`${this.attributeName}: (this.${this.attributeName} || []).slice(),`);
    } else {
      printer.add(`${this.attributeName}: this.${this.attributeName},`);
    }
  }

}
