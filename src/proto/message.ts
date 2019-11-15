import { camelize, extractType } from '../utils';
import { Enum } from './enum';
import { JSDoc } from './js-doc';
import { Proto } from './proto';
import { MessageFieldCardinality, MessageFieldType } from './types';

interface FieldTypeConfig { type?: string; read: string; write: string; defaultExpression?: string }

const FieldTypesConfig: { [prop in MessageFieldType]?: FieldTypeConfig } = {
  [MessageFieldType.bool]: { type: 'boolean', read: 'Bool', write: 'Bool', defaultExpression: 'false' },
  [MessageFieldType.bytes]: { type: 'ByteSource', read: 'Bytes', write: 'Bytes', defaultExpression: '\'\'' },
  [MessageFieldType.double]: { type: 'number', read: 'Double', write: 'Double', defaultExpression: '0' },
  [MessageFieldType.enum]: { read: 'Enum', write: 'Enum', defaultExpression: '0' },
  [MessageFieldType.fixed32]: { type: 'number', read: 'Fixed32', write: 'Fixed32', defaultExpression: '0' },
  [MessageFieldType.fixed64]: { type: 'number', read: 'Fixed64', write: 'Fixed64', defaultExpression: '0' },
  [MessageFieldType.float]: { type: 'number', read: 'Float', write: 'Float', defaultExpression: '0' },
  // [MessageFieldType.group]: null, // does not exist in v3
  [MessageFieldType.int32]: { type: 'number', read: 'Int32', write: 'Int32', defaultExpression: '0' },
  [MessageFieldType.int64]: { type: 'number', read: 'Int64', write: 'Int64', defaultExpression: '0' },
  // [MessageFieldType.message]: null,
  [MessageFieldType.sfixed32]: { type: 'number', read: 'Sfixed32', write: 'Sfixed32', defaultExpression: '0' },
  [MessageFieldType.sfixed64]: { type: 'number', read: 'Sfixed64', write: 'Sfixed64', defaultExpression: '0' },
  [MessageFieldType.sint32]: { type: 'number', read: 'Sint32', write: 'Sint32', defaultExpression: '0' },
  [MessageFieldType.sint64]: { type: 'number', read: 'Sint64', write: 'Sint64', defaultExpression: '0' },
  [MessageFieldType.string]: { type: 'string', read: 'String', write: 'String', defaultExpression: '\'\'' },
  [MessageFieldType.uint32]: { type: 'number', read: 'Uint32', write: 'Uint32', defaultExpression: '0' },
  [MessageFieldType.uint64]: { type: 'number', read: 'Uint64', write: 'Uint64', defaultExpression: '0' },
  // [MessageFieldType.unknown]: null,
};

export class MessageField {
  name: string;
  number: number;
  label: MessageFieldCardinality;
  type: number;
  typeName: string;
  jsonName: string;
  options: {
    ctype: number;
    deprecated: boolean;
    jstype: number;
    lazy: boolean;
    uninterpretedOptionList: any[];
    weak: boolean;
  };

  constructor(value: MessageField) {
    this.name = value.name;
    this.number = value.number;
    this.label = value.label;
    this.type = value.type;
    this.typeName = value.typeName;
    this.jsonName = value.jsonName;
    this.options = value.options || {};
  }
}

export class Message {

  name: string;
  fieldList: MessageField[];
  extensionList: [];
  nestedTypeList: Message[];
  enumTypeList: Enum[];
  extensionRangeList: [];
  oneofDeclList: [];
  reservedRangeList: [];
  reservedNameList: [];
  options: {
    messageSetWireFormat: boolean;
    noStandardDescriptorAccessor: boolean;
    deprecated: boolean;
    mapEntry: boolean;
    uninterpretedOptionList: any[];
  };

  constructor(value: Message, private proto: Proto) {
    this.name = value.name;
    this.fieldList = value.fieldList.map(mf => new MessageField(mf));
    this.extensionList = value.extensionList;
    this.nestedTypeList = value.nestedTypeList.map(t => new Message(t, proto));
    this.enumTypeList = value.enumTypeList.map(e => new Enum(e));
    this.extensionRangeList = value.extensionRangeList;
    this.oneofDeclList = value.oneofDeclList;
    this.reservedRangeList = value.reservedRangeList;
    this.reservedNameList = value.reservedNameList;
    this.options = value.options || {};
  }

  isFieldMap(field: MessageField) {
    if (field.type === MessageFieldType.message) {
      const msg = this.proto.findMessage(field.typeName) as Message;

      if (msg.options.mapEntry) {
        return true;
      }
    }

    return false;
  }

  getMapKeyValueFields(field: MessageField) {
    const msg = this.proto.findMessage(field.typeName) as Message;
    const key = msg.fieldList.find(f => f.name === 'key') as MessageField;
    const value = msg.fieldList.find(f => f.name === 'value') as MessageField;

    return [key, value];
  }

  toString() {
    const processName = (name: string) => {
      const escaped = ['default', 'var', 'let', 'const', 'function', 'class'].includes(name) ? 'pb_' + name : name;

      return camelize(escaped);
    }

    const getDataType = (field: MessageField) => {
      if (this.isFieldMap(field)) {
        const [key, value] = this.getMapKeyValueFields(field);

        return `{ [prop: ${key.type === MessageFieldType.string ? 'string' : 'number'}]: ${getDataType(value)}; }`;
      }

      const suffix = field.label === MessageFieldCardinality.repeated ? '[]' : '';

      if (field.type === MessageFieldType.enum || field.type === MessageFieldType.message) {
        return extractType(field.typeName, this.proto.pb_package) + suffix;
      }

      return FieldTypesConfig[field.type].type + suffix;
    }

    const getWriteCall = (field: MessageField) => {
      const prefix = `if (instance.${processName(field.name)} !== undefined && instance.${processName(field.name)} !== null) { `
      const suffix = ' }'
      const repeated = field.label === MessageFieldCardinality.repeated ? 'Repeated' : '';

      if (field.type === MessageFieldType.message) {
        const subType = extractType(field.typeName, this.proto.pb_package);

        if (this.isFieldMap(field)) {
          const [key] = this.getMapKeyValueFields(field);
          const varName = `instance.${processName(field.name)}`;
          const keysVarName = `keys_${field.number}`;
          const repeatedVarName = `repeated_${field.number}`;
          const castedKey = key.type === MessageFieldType.string ? 'key' : 'Number(key)';

          // TODO add key filter for NaN for number fields and 0-1 for boolean fields

          return `
            if (!!${varName}) {
              const ${keysVarName} = Object.keys(${varName} as any);

              if (${keysVarName}.length) {
                const ${repeatedVarName} = ${keysVarName}
                  .map(key => ({ key: ${castedKey}, value: (${varName} as any)[key] }))
                  .reduce((r, v) => [...r, v], [] as any[]);

                writer.writeRepeatedMessage(${field.number}, ${repeatedVarName}, ${subType}.toBinaryWriter);
              }
            }
          `;
        }

        return `${prefix}writer.write${repeated}Message(${field.number}, instance.${processName(field.name)} as any, ${subType}.toBinaryWriter);${suffix}`;
      }

      return `${prefix}writer.write${repeated}${FieldTypesConfig[field.type].write}(${field.number}, instance.${processName(field.name)});${suffix}`;
    }

    const getReadCall = (field: MessageField) => {
      const config = FieldTypesConfig[field.type];

      if (field.type === MessageFieldType.message) {
        const subType = extractType(field.typeName, this.proto.pb_package);

        if (this.isFieldMap(field)) {
          const msgVarName = `msg_${field.number}`;

          return `
            case ${field.number}:
              const ${msgVarName} = {} as any;
              reader.readMessage(${msgVarName}, ${subType}.fromBinaryReader);
              instance.${processName(field.name)} = instance.${processName(field.name)} || {};
              instance.${processName(field.name)}[${msgVarName}.key] = ${msgVarName}.value;
              break;
          `;
        }

        if (field.label === MessageFieldCardinality.repeated) {
          return `case ${field.number}: (instance.${processName(field.name)} = instance.${processName(field.name)} || []).push(new ${subType}()); reader.readMessage(instance.${processName(field.name)}, ${subType}.fromBinaryReader); break;`;
        }

        return `case ${field.number}: instance.${processName(field.name)} = new ${subType}(); reader.readMessage(instance.${processName(field.name)}, ${subType}.fromBinaryReader); break;`;
      }

      if (field.label === MessageFieldCardinality.repeated) {
        return `case ${field.number}: (instance.${processName(field.name)} = instance.${processName(field.name)} || []).push(reader.read${config.read}()); break;`;
      }

      return `case ${field.number}: instance.${processName(field.name)} = reader.read${config.read}(); break;`;
    }

    const attributes = this.fieldList.map(f => {
      const jsdoc = new JSDoc();

      jsdoc.setDescription(`Property ${f.name}`);
      jsdoc.setDeprecation(f.options.deprecated);

      return `
        ${jsdoc.toString()}
        public ${processName(f.name)}?: ${getDataType(f)};
      `;
    });
    const attributeInitializers = this.fieldList.map(f => `this.${processName(f.name)} = value.${processName(f.name)}`);
    const serializeAttributes = this.fieldList.map(f => getWriteCall(f));
    const deserializeAttributes = this.fieldList.map(f => getReadCall(f));
    const afterReadInitializers = this.fieldList.map(f => `instance.${processName(f.name)} = instance.${processName(f.name)} || ${
      this.isFieldMap(f) ?
        '{}'
        : f.label === MessageFieldCardinality.repeated
          ? '[]'
          : FieldTypesConfig[f.type]
            ? FieldTypesConfig[f.type].defaultExpression
            : 'undefined'}
    `);

    return `export class ${this.name} {

  static fromBinaryReader(instance: ${this.name}, reader: BinaryReader) {
    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      switch (reader.getFieldNumber()) {
        ${deserializeAttributes.join('\n')}
        default: reader.skipField();
      }
    }

    ${afterReadInitializers.join(';')}
  }

  static fromBinary(bytes: ByteSource) {
    const instance = new ${this.name}();

    ${this.name}.fromBinaryReader(instance, new BinaryReader(bytes));

    return instance;
  }

  static toBinaryWriter(instance: ${this.name}, writer: BinaryWriter) {
    ${serializeAttributes.join('\n    ')}
  }

  static toBinary(instance: ${this.name}) {
    const writer = new BinaryWriter();

    ${this.name}.toBinaryWriter(instance, writer);

    return writer.getResultBuffer();
  }

  ${attributes.join('\n')}

  constructor(value: ${this.name} = {}) {
    ${attributeInitializers.join(';')}
  }

}

export module ${this.name} {
  ${[...this.enumTypeList.map(e => e.toString()), ...this.nestedTypeList.map(m => m.toString())].join('\n\n')}
}`;
  }

  toJSON() {
    return {
      ...this,
      proto: null,
    };
  }

}
