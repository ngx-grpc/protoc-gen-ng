import { Proto } from '../input/proto';
import { Enum } from './enum';
import { Message } from './message';
import { Printer } from './misc/printer';
import { ServiceClient } from './service-client';
import { ServiceClientConfig } from './service-client-config';

export class ProtobufFile {

  constructor(
    private proto: Proto,
  ) { }

  print(printer: Printer) {
    const serviceClientConfigs: ServiceClientConfig[] = [];
    const serviceClients: ServiceClient[] = [];

    this.proto.serviceList.forEach(service => {
      const serviceClientConfig = new ServiceClientConfig(this.proto, service);
      const serviceClient = new ServiceClient(this.proto, service, serviceClientConfig);

      serviceClientConfigs.push(serviceClientConfig);
      serviceClients.push(serviceClient);
    });

    printer.add(`/*
  To configure the services you need to provider a configuration for each of them.

  E.g. you can create a module where you configure all of them and then import this module into your AppModule:

  const grpcSettings = { host: environment.grpcHost };

  @NgModule({
    providers: [
${ serviceClientConfigs.map(s => `      { provide: ${s.getTokenName()}, useValue: grpcSettings },`).sort().join('\n')}
    ],
  })
  export class GrpcConfigModule { }
*/

${this.proto.getImportedDependencies()}
`);

    serviceClientConfigs.forEach(serviceClientConfig => serviceClientConfig.print(printer));

    this.proto.enumTypeList.forEach(protoEnum => {
      const _enum = new Enum(this.proto, protoEnum);

      _enum.print(printer);
    });

    this.proto.messageTypeList.forEach(protoMessage => {
      const message = new Message(this.proto, protoMessage);

      message.print(printer);
    });

    serviceClients.forEach(serviceClient => serviceClient.print(printer));
  }

}
