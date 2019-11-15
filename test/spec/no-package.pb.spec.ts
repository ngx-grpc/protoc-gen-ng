import 'jest';
import * as noPackage from '../out/no-package.pb';

describe('no-package.proto', () => {

  it('should produce TestRequest', () => {
    expect(noPackage.TestRequest).toBeTruthy();
    expect(new noPackage.TestRequest()).toBeTruthy();
  });

  it('should produce TestResponse', () => {
    expect(noPackage.TestResponse).toBeTruthy();
    expect(new noPackage.TestResponse()).toBeTruthy();
  });

  it('should produce GRPC_TEST_SERVICE_CLIENT_SETTINGS', () => {
    expect(noPackage.GRPC_TEST_SERVICE_CLIENT_SETTINGS).toBeTruthy();
  });

  it('should produce TestServiceClient', () => {
    expect(noPackage.TestServiceClient).toBeTruthy();
    expect(new noPackage.TestServiceClient({ host: 'test' })).toBeTruthy();
  });

  // it('should produce NoPackageServiceClientsModule', () => {
  //   expect(noPackage.NoPackageServiceClientsModule).toBeTruthy();
  //   expect(noPackage.NoPackageServiceClientsModule.configureClients).toBeTruthy();
  // });

});
