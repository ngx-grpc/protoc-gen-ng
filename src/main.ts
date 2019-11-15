#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as prettier from 'prettier';
import protocPlugin from 'protoc-plugin';
import { Config } from './config';
import { Proto } from './proto/proto';
import { dasherize } from './utils';

function main() {
  protocPlugin((protosProtocPlugin: Proto[]) => {
    const protos = protosProtocPlugin.map(proto => new Proto(proto));

    if (Config.debug) {
      mkdirSync('debug', { recursive: true });
      writeFileSync(join('debug', 'parsed-protoc-plugin.json'), JSON.stringify(protosProtocPlugin, null, 2), 'utf-8');
      writeFileSync(join('debug', 'parsed-protoc-gen-ng.json'), JSON.stringify(protos, null, 2), 'utf-8');
    }

    return protos.map(proto => {
      const types = [
        ...proto.enumTypeList,
        ...proto.messageTypeList,
        ...proto.serviceList,
      ];

      const generated = `// THIS IS A GENERATED FILE
      // DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST

/*
  To configure the services you need to provider a configuration for each of them.

  E.g. you can create a module where you configure all of them and then import this module into your AppModule:

  const grpcSettings = { host: environment.grpcHost };

  @NgModule({
    providers: [
${ proto.serviceList.map(s => `      { provide: ${s.getConfigInjectionTokenName()}, useValue: grpcSettings },`).sort().join('\n')}
    ],
  })
  export class GrpcConfigModule { }
*/

      /* tslint:disable */
      /* eslint-disable */
      import { Inject, Injectable, InjectionToken } from '@angular/core';
      import { GrpcCallType, GrpcClient, GrpcClientSettings, GrpcHandler } from '@ngx-grpc/core';
      import { BinaryReader, BinaryWriter, ByteSource } from 'google-protobuf';
      import { AbstractClientBase, Error, GrpcWebClientBase, Metadata, Status } from 'grpc-web';
      import { Observable } from 'rxjs';

      ${types.map(t => t.toString()).join('\n\n')}
`;

      return {
        name: `${dasherize(proto.getFlatName())}.pb.ts`,
        content: prettier.format(generated, { parser: 'typescript', singleQuote: true }),
      };
    });
  });
}

main();
