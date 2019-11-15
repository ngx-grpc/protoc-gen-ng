import 'jest';
import * as deprecated from '../out/deprecated.pb';

describe('no-package.proto', () => {

  it('should produce TestMessage', () => {
    expect(deprecated.TestMessage).toBeTruthy();
    expect(new deprecated.TestMessage()).toBeTruthy();
    expect(new deprecated.TestMessage().message).toBe(undefined);
  });

  it('should produce TestServiceClient', () => {
    expect(deprecated.TestServiceClient).toBeTruthy();
    expect(new deprecated.TestServiceClient({ host: 'test' })).toBeTruthy();
    expect(new deprecated.TestServiceClient({ host: 'test' }).test).toBeTruthy();
  });

});
