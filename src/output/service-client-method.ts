import { Proto } from '../input/proto';
import { ProtoService } from '../input/proto-service';
import { ServiceMethod } from '../input/proto-service-method';
import { camelizeSafe } from '../utils';
import { JSDoc } from './js-doc';
import { ExternalDependencies } from './misc/dependencies';
import { Printer } from './misc/printer';

export class ServiceClientMethod {

  constructor(
    private proto: Proto,
    private service: ProtoService,
    private serviceMethod: ServiceMethod,
  ) { }

  print(printer: Printer) {
    printer.addDeps(
      ExternalDependencies.Metadata,
      ExternalDependencies.GrpcCallType,
      ExternalDependencies.Observable,
    );

    if (this.serviceMethod.serverStreaming) {
      printer.addDeps(ExternalDependencies.Status);
    }

    const serviceUrlPrefix = this.proto.pb_package ? this.proto.pb_package + '.' : '';
    const inputType = this.proto.getRelativeTypeName(this.serviceMethod.inputType);
    const outputType = this.proto.getRelativeTypeName(this.serviceMethod.outputType);
    const jsdoc = new JSDoc();

    jsdoc.setDescription(`${this.serviceMethod.serverStreaming ? 'Server streaming' : 'Unary'} RPC`);
    jsdoc.addParam({ type: inputType, name: 'request', description: 'Request message' });
    jsdoc.addParam({ type: 'Metadata', name: 'metadata', description: 'Additional data' });
    jsdoc.setReturn(outputType);
    jsdoc.setDeprecation(!!this.serviceMethod.options && this.serviceMethod.options.deprecated);

    printer.add(`
      ${jsdoc.toString()}
      ${camelizeSafe(this.serviceMethod.name)}(requestData: ${inputType}, requestMetadata: Metadata = {}) {
        return this.handler.handle({
          type: GrpcCallType.${this.serviceMethod.serverStreaming ? 'serverStream' : 'unary'},
          client: this.client,
          path: '/${serviceUrlPrefix}${this.service.name}/${this.serviceMethod.name}',
          requestData,
          requestMetadata,
          requestClass: ${inputType},
          responseClass: ${outputType},
        }) as Observable<${outputType}${this.serviceMethod.serverStreaming ? ' | Status' : ''}>;
      }
    `);
  }

}
