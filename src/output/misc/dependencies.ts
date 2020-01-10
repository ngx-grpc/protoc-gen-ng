export class Dependency {

  constructor(
    public from: string,
    public token: string,
  ) { }

}

export const ExternalDependencies = {
  Inject: new Dependency('@angular/core', 'Inject'),
  Injectable: new Dependency('@angular/core', 'Injectable'),
  InjectionToken: new Dependency('@angular/core', 'InjectionToken'),

  GrpcMessage: new Dependency('@ngx-grpc/core', 'GrpcMessage'),
  GrpcCallType: new Dependency('@ngx-grpc/core', 'GrpcCallType'),
  GrpcClient: new Dependency('@ngx-grpc/core', 'GrpcClient'),
  GrpcClientSettings: new Dependency('@ngx-grpc/core', 'GrpcClientSettings'),
  GrpcHandler: new Dependency('@ngx-grpc/core', 'GrpcHandler'),

  BinaryReader: new Dependency('google-protobuf', 'BinaryReader'),
  BinaryWriter: new Dependency('google-protobuf', 'BinaryWriter'),
  ByteSource: new Dependency('google-protobuf', 'ByteSource'),

  Metadata: new Dependency('grpc-web', 'Metadata'),
  Status: new Dependency('grpc-web', 'Status'),

  Observable: new Dependency('rxjs', 'Observable'),
};
