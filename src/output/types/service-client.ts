import { Proto } from '../../input/proto';
import { ProtoService } from '../../input/proto-service';
import { ExternalDependencies } from '../misc/dependencies';
import { Printer } from '../misc/printer';
import { ServiceClientConfig } from './service-client-config';
import { ServiceClientMethod } from './service-client-method';

export class ServiceClient {

  constructor(
    private proto: Proto,
    private service: ProtoService,
    private serviceClientConfig: ServiceClientConfig,
  ) { }

  print(printer: Printer) {
    const tokenName = this.serviceClientConfig.getTokenName();

    printer.addDeps(
      ExternalDependencies.GrpcClient,
      ExternalDependencies.GrpcClientSettings,
      ExternalDependencies.GrpcClientDefaultSettings,
      ExternalDependencies.GrpcHandler,
      ExternalDependencies.Inject,
      ExternalDependencies.Injectable,
      ExternalDependencies.Optional,
      ExternalDependencies.GrpcClientFactory,
      ExternalDependencies.GRPC_CLIENT_FACTORY,
    );

    const serviceId = (this.proto.pb_package ? this.proto.pb_package + '.' : '') + this.service.name;

    printer.add(`
      @Injectable({
        providedIn: 'root',
      })
      export class ${this.service.name}Client {

        private client: GrpcClient;

        constructor(
          @Optional() @Inject(${tokenName}) clientSettings: GrpcClientSettings | undefined,
          @Optional() @Inject(GRPC_SERVICE_DEFAULT_SETTINGS) defaultSettings: GrpcClientSettings | undefined,
          @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory,
          private handler: GrpcHandler,
        ) {
          if (defaultSettings === undefined && clientSettings === undefined) {
            throw new Error('Either GRPC_SERVICE_DEFAULT_SETTINGS or ${tokenName} or both should be provided');
          }
          const settings = {...({} || defaultSettings), ...({} || clientSettings)} as GrpcClientSettings;
          this.client = clientFactory.createClient('${serviceId}', settings);
        }
    `);

    this.service.methodList.map(method => {
      const serviceClientMethod = new ServiceClientMethod(this.proto, this.service, method);

      serviceClientMethod.print(printer);

      printer.newLine();
      printer.newLine();
    });

    printer.add('}');
  }

}
