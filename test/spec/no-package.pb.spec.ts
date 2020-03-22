import { GrpcHandler, GrpcStandardClientFactory } from '@ngx-grpc/core';
import 'jest';
import * as noPackagePb from '../out/no-package.pb';
import * as noPackagePbconf from '../out/no-package.pbconf';
import * as noPackagePbsc from '../out/no-package.pbsc';

describe('no-package.proto', () => {

  it('should produce TestRequest', () => {
    expect(noPackagePb.TestRequest).toBeTruthy();
    expect(new noPackagePb.TestRequest()).toBeTruthy();
  });

  it('should produce TestResponse', () => {
    expect(noPackagePb.TestResponse).toBeTruthy();
    expect(new noPackagePb.TestResponse()).toBeTruthy();
  });

  it('should produce GRPC_TEST_SERVICE_CLIENT_SETTINGS', () => {
    expect(noPackagePbconf.GRPC_TEST_SERVICE_CLIENT_SETTINGS).toBeTruthy();
  });

  it('should produce TestServiceClient', () => {
    expect(noPackagePbsc.TestServiceClient).toBeTruthy();
    expect(new noPackagePbsc.TestServiceClient({ host: 'test' }, undefined,  new GrpcStandardClientFactory(), new GrpcHandler([]))).toBeTruthy();
  });

});
