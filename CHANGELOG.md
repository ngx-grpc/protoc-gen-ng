# [0.4.0](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.3.2...v0.4.0) (2020-01-02)


### Features

* add explicit type definition for injection tokens ([885bab8](https://github.com/ngx-grpc/protoc-gen-ng/commit/885bab8548ee8014313ea01c7b0b79279b4531c9))
* improve names transformations ([c2ab777](https://github.com/ngx-grpc/protoc-gen-ng/commit/c2ab777e3d898e2b490450e6629b819e15a6b542))


### Performance Improvements

* move all service client config tokens to a separate file to skip loading all generated code into the initial bundle ([40de9d6](https://github.com/ngx-grpc/protoc-gen-ng/commit/40de9d6a80df276f02a6bd1a1af4eba535b01c34))
* omit passing default values to the binary writer ([15cd3e8](https://github.com/ngx-grpc/protoc-gen-ng/commit/15cd3e8a2cd7b3848ae584439effe6b623ce11e0))


### BREAKING CHANGES

* all tokens are moved to a separate *.pbconf.ts file
* the name transformation is more greedy, some of the class, attribute and method names can be different now

## [0.3.2](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.3.1...v0.3.2) (2019-12-13)


### Bug Fixes

* always transform enum values to camel case ([f52144a](https://github.com/ngx-grpc/protoc-gen-ng/commit/f52144a8f426dede9133e24714634484618a822a))

## [0.3.1](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.3.0...v0.3.1) (2019-12-13)


### Features

* add basic generation of well-known types ([ca148dd](https://github.com/ngx-grpc/protoc-gen-ng/commit/ca148dda9d98232b4a8bc160735bb3ba49d1efc5))

# [0.3.0](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.2.3...v0.3.0) (2019-12-05)


### Bug Fixes

* treat proto2 group as message type ([ffe8410](https://github.com/ngx-grpc/protoc-gen-ng/commit/ffe8410dd350d3e1e68cbca9293fdedd8e66e8ff))


### Features

* add possibility to cast from and to snapshot ([c1a75dd](https://github.com/ngx-grpc/protoc-gen-ng/commit/c1a75dd07f807b53e4b8849ca9dc216eaf72d843))


### BREAKING CHANGES

* the object that is provided as message constructor argument is always cloned; the message is always initialized with proto default values

## [0.2.3](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.2.2...v0.2.3) (2019-11-25)


### Features

* add oneOf support ([11024e3](https://github.com/ngx-grpc/protoc-gen-ng/commit/11024e3221c586c54776d270a21186664a1959cc))

## [0.2.2](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.2.1...v0.2.2) (2019-11-20)


### Bug Fixes

* do not transform the RPC path to camelcase, fix [#1](https://github.com/ngx-grpc/protoc-gen-ng/issues/1) ([4cc306d](https://github.com/ngx-grpc/protoc-gen-ng/commit/4cc306dc4182ca47488b116ce585cc8992547a00))
* use strict Uint8Array for bytes ([c526e0a](https://github.com/ngx-grpc/protoc-gen-ng/commit/c526e0ae6b5fd74d645eaa8764f8c15cbf7c238d))

## [0.2.1](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.2.0...v0.2.1) (2019-11-20)


### Bug Fixes

* properly generate reader for repeated submessage ([5b35068](https://github.com/ngx-grpc/protoc-gen-ng/commit/5b35068a479161b5af8c795cbcfca81aae813828))

# [0.2.0](https://github.com/ngx-grpc/protoc-gen-ng/compare/v0.1.1...v0.2.0) (2019-11-19)


### Features

* add support of import & public import ([4d8329b](https://github.com/ngx-grpc/protoc-gen-ng/commit/4d8329b25cd7fa66bff25afe6e1e74cf822a2929))
