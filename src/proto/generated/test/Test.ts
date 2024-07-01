// Original file: src/proto/Test.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { TestRequest as _test_TestRequest, TestRequest__Output as _test_TestRequest__Output } from '../test/TestRequest';
import type { TestResponse as _test_TestResponse, TestResponse__Output as _test_TestResponse__Output } from '../test/TestResponse';

export interface TestClient extends grpc.Client {
  TestFunc(argument: _test_TestRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  TestFunc(argument: _test_TestRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  TestFunc(argument: _test_TestRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  TestFunc(argument: _test_TestRequest, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  testFunc(argument: _test_TestRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  testFunc(argument: _test_TestRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  testFunc(argument: _test_TestRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  testFunc(argument: _test_TestRequest, callback: grpc.requestCallback<_test_TestResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface TestHandlers extends grpc.UntypedServiceImplementation {
  TestFunc: grpc.handleUnaryCall<_test_TestRequest__Output, _test_TestResponse>;
  
}

export interface TestDefinition extends grpc.ServiceDefinition {
  TestFunc: MethodDefinition<_test_TestRequest, _test_TestResponse, _test_TestRequest__Output, _test_TestResponse__Output>
}
