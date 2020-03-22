import { GrpcHandler, GrpcStandardClientFactory } from '@ngx-grpc/core';
import 'jest';
import * as deprecatedpb from '../out/deprecated.pb';
import * as deprecatedpbsc from '../out/deprecated.pbsc';

describe('no-package.proto', () => {

  it('should produce TestMessage', () => {
    expect(deprecatedpb.TestMessage).toBeTruthy();
    expect(new deprecatedpb.TestMessage()).toBeTruthy();
    expect(new deprecatedpb.TestMessage().message).toBe('');
  });

  it('should produce TestServiceClient', () => {
    expect(deprecatedpbsc.TestServiceClient).toBeTruthy();
    expect(new deprecatedpbsc.TestServiceClient({ host: 'test' }, undefined, new GrpcStandardClientFactory(), new GrpcHandler([]))).toBeTruthy();
    expect(new deprecatedpbsc.TestServiceClient({ host: 'test' }, undefined, new GrpcStandardClientFactory(), new GrpcHandler([])).test).toBeTruthy();
  });

});
