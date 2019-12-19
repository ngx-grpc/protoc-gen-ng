#!/usr/bin/env node

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import protocPlugin from 'protoc-plugin';
import { Config } from './config';
import { Proto } from './input/proto';
import { Logger } from './logger';
import { Printer } from './output/misc/printer';
import { ProtobufFile } from './output/protobuf-file';
import wkt from './wkt.meta.json';

function main() {
  protocPlugin((protosProtocPlugin: Proto[]) => {
    const protos = [...(wkt as unknown as Proto[]), ...protosProtocPlugin].map(proto => new Proto(proto));

    if (Config.debug) {
      mkdirSync('debug', { recursive: true });
      writeFileSync(join('debug', 'parsed-protoc-plugin.json'), JSON.stringify(protosProtocPlugin, null, 2), 'utf-8');
      writeFileSync(join('debug', 'parsed-protoc-gen-ng.json'), JSON.stringify(protos, null, 2), 'utf-8');
    }

    protos.forEach(p => {
      p.resolved.dependencies = p.dependencyList.map(d => protos.find(pp => pp.name === d) as Proto);
      p.resolved.publicDependencies = p.publicDependencyList.map(i => p.resolved.dependencies[i]);
    });

    // TODO add cascade public import. Currently works with one-level only
    protos
      .filter(p => p.resolved.publicDependencies.length)
      .forEach(protoWithPublicImport =>
        protos
          .filter(pp => pp.resolved.dependencies.includes(protoWithPublicImport))
          .forEach(protoImportingProtoWithPublicImport => {
            Logger.debug(`${protoImportingProtoWithPublicImport.name} reimports ${protoWithPublicImport.resolved.publicDependencies.map(p => p.name).join(', ')} via ${protoWithPublicImport.name}`);

            protoImportingProtoWithPublicImport.resolved.dependencies.push(...protoWithPublicImport.resolved.publicDependencies)
          })
      );

    return protos.map(proto => {
      const printer = new Printer();
      const file = new ProtobufFile(proto);

      file.print(printer);

      return {
        name: proto.getGeneratedFileBaseName() + '.ts',
        content: printer.finalize(),
      };
    });
  });
}

main();
