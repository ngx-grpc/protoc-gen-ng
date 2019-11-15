import { basename } from 'path';
import { extractType } from '../utils';
import { Enum } from './enum';
import { Message } from './message';
import { Service } from './service';

export class Proto {

  name: string;
  pb_package: string;
  dependencyList: [];
  publicDependencyList: [];
  weakDependencyList: [];
  messageTypeList: Message[];
  enumTypeList: Enum[];
  serviceList: Service[];
  extensionList: any[];

  constructor(value: Proto) {
    this.name = value.name;
    this.pb_package = value.pb_package; // eslint-disable-line @typescript-eslint/camelcase
    this.dependencyList = value.dependencyList;
    this.publicDependencyList = value.publicDependencyList;
    this.weakDependencyList = value.weakDependencyList;
    this.messageTypeList = value.messageTypeList.map(e => new Message(e, this));
    this.enumTypeList = value.enumTypeList.map(e => new Enum(e));
    this.serviceList = value.serviceList.map(e => new Service(e, this));
    this.extensionList = value.extensionList;
  }

  findMessage(typeName: string) {
    const path = extractType(typeName, this.pb_package).split('.');
    let array = this.messageTypeList;
    let msg: Message;
    let i = 0;

    while (i < 100) {
      const name = path.shift();

      if (!name || !array.length) {
        throw new Error('Error finding ' + typeName);
      }

      msg = array.find(mt => mt.name === name) as Message;

      if (!msg) {
        throw new Error('Error finding ' + typeName);
      }

      array = msg.nestedTypeList;

      if (!path.length) {
        return msg;
      }

      i++;
    }
  }

  getFlatName() {
    return basename(this.name).replace(/\.proto$/, '');
  }

}
