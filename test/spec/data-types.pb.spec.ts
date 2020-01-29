import 'jest';
import * as dataTypes from '../out/data-types.pb';

describe('data-types.proto', () => {

  it('should produce TestEnum', () => {
    expect(dataTypes.TestEnum).toBeTruthy();
    expect(dataTypes.TestEnum.value0).toBe(0);
    expect(dataTypes.TestEnum.value1).toBe(1);
    expect(dataTypes.TestEnum.value2).toBe(2);
  });

  it('should produce TestSubMessage', () => {
    expect(dataTypes.TestSubMessage).toBeTruthy();
  });

  it('should implement proper TestSubMessage reader', () => {
    const msg = dataTypes.TestSubMessage.fromBinary('');

    expect(msg instanceof dataTypes.TestSubMessage).toBeTruthy();

    expect(msg.string).toBe('');
  });

  it('should implement proper TestTreeItemMessage reader', () => {
    const msg = dataTypes.TestTreeItemMessage.fromBinary('');

    expect(msg instanceof dataTypes.TestTreeItemMessage).toBeTruthy();

    expect(msg.sub).toBe(undefined);
  });

  it('should implement proper TestMessage reader', () => {
    const msg = dataTypes.TestMessage.fromBinary('');

    expect(msg instanceof dataTypes.TestMessage).toBeTruthy();

    expect(msg.string).toBe('');
    expect(msg.int32).toBe(0);
    expect(msg.bool).toBe(false);
    expect(msg.subMessage).toBe(undefined);
    expect(msg.double).toBe(0);
    expect(msg.float).toBe(0);
    expect(msg.bytes instanceof Uint8Array && msg.bytes.length === 0).toBeTruthy();
    expect(msg.int64).toBe('0');
    expect(msg.enum).toBe(0);
    expect(msg.fixed32).toBe(0);
    expect(msg.fixed64).toBe('0');
    expect(msg.uint32).toBe(0);
    expect(msg.uint64).toBe('0');
    expect(msg.mapStringString).toEqual({});
    expect(msg.mapInt64Sub).toEqual({});
    expect(msg.mapBoolString).toEqual({});
  });

  it('should implement proper RepeatedTestMessage reader', () => {
    const msg = dataTypes.RepeatedTestMessage.fromBinary('');

    expect(msg instanceof dataTypes.RepeatedTestMessage).toBeTruthy();

    expect(msg.string).toEqual([]);
    expect(msg.int32).toEqual([]);
    expect(msg.bool).toEqual([]);
    expect(msg.subMessage).toEqual([]);
    expect(msg.double).toEqual([]);
    expect(msg.float).toEqual([]);
    expect(msg.bytes).toEqual([]);
    expect(msg.int64).toEqual([]);
    expect(msg.enum).toEqual([]);
    expect(msg.fixed32).toEqual([]);
    expect(msg.fixed64).toEqual([]);
    expect(msg.uint32).toEqual([]);
    expect(msg.uint64).toEqual([]);
  });

  it('should have toObject that creates a message snapshot', () => {
    const msg = new dataTypes.TestMessage()
    const msgRepeated = new dataTypes.RepeatedTestMessage()

    expect(msg.toObject()).toEqual({
      string: '',
      int32: 0,
      bool: false,
      subMessage: undefined,
      double: 0,
      float: 0,
      bytes: new Uint8Array(),
      int64: '0',
      enum: 0,
      fixed32: 0,
      fixed64: '0',
      uint32: 0,
      uint64: '0',
      mapStringString: {},
      mapInt64Sub: {},
      mapBoolString: {},
    });

    expect(msgRepeated.toObject()).toEqual({
      string: [],
      int32: [],
      bool: [],
      subMessage: [],
      double: [],
      float: [],
      bytes: [],
      int64: [],
      enum: [],
      fixed32: [],
      fixed64: [],
      uint32: [],
      uint64: [],
    });
  })

});
