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
