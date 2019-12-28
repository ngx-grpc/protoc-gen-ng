import { Proto } from '../input/proto';
import { ProtoService } from '../input/proto-service';
import { ExternalDependencies } from './misc/dependencies';
import { Printer } from './misc/printer';
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
      ExternalDependencies.GrpcHandler,
      ExternalDependencies.Inject,
      ExternalDependencies.Injectable,
    );

    printer.add(`
      @Injectable({
        providedIn: 'root',
      })
      export class ${this.service.name}Client {

        private client: GrpcClient;

        constructor(
          @Inject(${tokenName}) settings: GrpcClientSettings,
          private handler: GrpcHandler,
        ) {
          this.client = new GrpcClient(settings);
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
