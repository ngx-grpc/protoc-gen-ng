import { Logger } from '../logger';
import { dasherize } from '../utils';
import { Enum } from './enum';
import { Message } from './message';
import { Service } from './service';

export interface MessageIndexMeta {
  proto: Proto;
  message?: Message;
  enum?: Enum;
}

export class Proto {

  name: string;
  pb_package: string;
  dependencyList: string[];
  publicDependencyList: number[];
  weakDependencyList: [];
  messageTypeList: Message[];
  enumTypeList: Enum[];
  serviceList: Service[];
  extensionList: any[];

  resolved: {
    dependencies: Proto[];
    publicDependencies: Proto[];
    weakDependencies: Proto[];
  } = {} as any;

  messageIndex = new Map<string, MessageIndexMeta>();

  constructor(value: Proto) {
    this.name = value.name;
    this.pb_package = value.pb_package; // eslint-disable-line @typescript-eslint/camelcase
    this.dependencyList = value.dependencyList || [];
    this.publicDependencyList = value.publicDependencyList;
    this.weakDependencyList = value.weakDependencyList;
    this.messageTypeList = value.messageTypeList.map(e => new Message(e, this));
    this.enumTypeList = value.enumTypeList.map(e => new Enum(e));
    this.serviceList = value.serviceList.map(e => new Service(e, this));
    this.extensionList = value.extensionList;

    this.index();
  }

  private index() {
    const indexEnums = (path: string, enums: Enum[]) => {
      enums.forEach(oneEnum => {
        this.messageIndex.set(path + '.' + oneEnum.name, { proto: this, enum: oneEnum });
      });
    };

    const indexMessages = (path: string, submessages: Message[]) => {
      submessages.forEach(message => {
        const fullname = path + '.' + message.name;

        this.messageIndex.set(fullname, {
          proto: this,
          message,
        });

        indexMessages(fullname, message.nestedTypeList);
        indexEnums(fullname, message.enumTypeList);
      });
    };

    indexMessages(this.pb_package ? '.' + this.pb_package : '', this.messageTypeList);
    indexEnums(this.pb_package ? '.' + this.pb_package : '', this.enumTypeList);
  }

  resolveTypeMetadata(pbType: string) {
    let meta = this.messageIndex.get(pbType);

    if (meta) {
      return meta;
    }

    meta = undefined;

    this.resolved.dependencies.forEach(proto => {
      if (!meta) {
        try {
          meta = proto.resolveTypeMetadata(pbType);
        } catch (ex) {
        }
      }
    });

    if (meta) {
      return meta;
    }

    Logger.debug(`Cannot find type ${pbType} in proto ${this.name}`);
    throw new Error('Error finding ' + pbType);
  }

  getDependencyPackageName(proto: Proto) {
    const name = proto.pb_package ? proto.pb_package.replace(/\.([a-z])/g, v => v.toUpperCase()).replace(/\./g, '') : 'noPackage';
    const index = String(this.resolved.dependencies.indexOf(proto)).padStart(3, '0'); // we always need index to avoid accidental collisions, see type.pb.ts

    return name + index;
  }

  getRelativeTypeName(pbType: string) {
    const meta = this.resolveTypeMetadata(pbType);
    const [, , /* packageName */, typeName] = pbType.match(/^\.(([a-z0-9.]*)\.)?([A-Za-z0-9.]+$)/) as RegExpMatchArray;

    if (meta.proto === this) {
      return typeName;
    }

    return this.getDependencyPackageName(meta.proto) + '.' + typeName;
  }

  getImportedDependencies() {
    const root = Array(this.name.split('/').length - 1).fill('..').join('/');

    return this.resolved.dependencies.map(pp => `import * as ${this.getDependencyPackageName(pp)} from '${root || '.'}/${pp.getGeneratedFileBaseName()}';`).join('\n');
  }

  getGeneratedFileBaseName() {
    return `${dasherize(this.name.replace(/\.proto$/, ''))}.pb`;
  }

}
