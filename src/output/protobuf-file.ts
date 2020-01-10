import { basename } from 'path';
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

    printer.add(this.proto.getImportedDependencies());

    if (serviceClientConfigs.length) {
      const fileName = basename(this.proto.getGeneratedFileBaseName());

      printer.add(`import {${serviceClientConfigs.map(scc => scc.getTokenName()).join(',')}} from './${fileName}conf';`);
    }

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
