export class Enum {

  name: string;
  valueList: {
    name: string;
    number: number;
  }[];
  reservedRangeList: [];
  reservedNameList: [];

  constructor(value: Enum) {
    this.name = value.name;
    this.valueList = value.valueList;
    this.reservedRangeList = value.reservedRangeList;
    this.reservedNameList = value.reservedNameList;
  }

  toString() {
    function processName(name: string) {
      const escaped = ['default', 'var', 'let', 'const', 'function', 'class'].includes(name) ? 'PB_' + name : name;

      return escaped;
    }

    const values = this.valueList.map(v => `${processName(v.name)} = ${v.number},`);

    return `export enum ${this.name} {
  ${values.join('\n  ')}
}`;
  }

}
