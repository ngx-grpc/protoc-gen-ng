import { camelize, extractType, pascalize } from '../utils';
import { JSDoc } from './js-doc';
import { Proto } from './proto';

export class Service {

  name: string;
  proto: Proto;
  methodList: {
    name: string;
    inputType: string;
    outputType: string;
    clientStreaming: boolean;
    serverStreaming: boolean;
    options?: {
      deprecated: boolean;
      idempotencyLevel: number;
      uninterpretedOptionList: any[];
    };
  }[];

  constructor(value: Service, proto: Proto) {
    this.name = value.name;
    this.methodList = value.methodList;
    this.proto = proto;
  }

  getConfigInjectionTokenName() {
    return `GRPC_${pascalize(this.name)}_CLIENT_SETTINGS`;
  }

  toString() {
    function processName(name: string) {
      const escaped = ['default', 'var', 'let', 'const', 'function', 'class'].includes(name) ? 'pb_' + name : name;

      return camelize(escaped);
    }

    const serviceUrlPrefix = this.proto.pb_package ? this.proto.pb_package + '.' : '';

    const methods = this.methodList.map(method => {
      const inputType = extractType(method.inputType, this.proto.pb_package);
      const outputType = extractType(method.outputType, this.proto.pb_package);
      const jsdoc = new JSDoc();

      jsdoc.setDescription(`${method.serverStreaming ? 'Server streaming' : 'Unary'} RPC`);
      jsdoc.addParam({ type: inputType, name: 'request', description: 'Request message' });
      jsdoc.addParam({ type: 'Metadata', name: 'metadata', description: 'Additional data' });
      jsdoc.setReturn(outputType);
      jsdoc.setDeprecation(!!method.options && method.options.deprecated);

      return `
        ${jsdoc.toString()}
        ${processName(method.name)}(requestData: ${inputType}, requestMetadata: Metadata = {}) {
          return this.handler.handle({
            type: GrpcCallType.${method.serverStreaming ? 'serverStream' : 'unary'},
            client: this.client,
            path: '/${serviceUrlPrefix}${this.name}/${camelize(method.name)}',
            requestData,
            requestMetadata,
            requestClass: ${inputType},
            responseClass: ${outputType},
          }) as Observable<${outputType}${method.serverStreaming ? ` | Status` : ''}>;
        }
      `;
    });

    const tokenName = this.getConfigInjectionTokenName();

    return `export const ${tokenName} = new InjectionToken('${tokenName}');

@Injectable({
  providedIn: 'root',
})
export class ${this.name}Client {

  private client: GrpcClient;

  constructor(
    @Inject(${tokenName}) settings: GrpcClientSettings,
    private handler: GrpcHandler,
  ) {
    this.client = new GrpcClient(settings);
  }

  ${ methods.join('\n\n  ')}

} `;
  }

  toJSON() {
    return {
      ...this,
      proto: null,
    };
  }

}
