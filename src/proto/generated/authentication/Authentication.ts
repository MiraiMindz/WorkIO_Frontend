// Original file: src/proto/Authentication.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Login as _authentication_Login, Login__Output as _authentication_Login__Output } from '../authentication/Login';
import type { SignUp as _authentication_SignUp, SignUp__Output as _authentication_SignUp__Output } from '../authentication/SignUp';
import type { Token as _authentication_Token, Token__Output as _authentication_Token__Output } from '../authentication/Token';

export interface AuthenticationClient extends grpc.Client {
  AuthenticateLogin(argument: _authentication_Login, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  AuthenticateLogin(argument: _authentication_Login, metadata: grpc.Metadata, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  AuthenticateLogin(argument: _authentication_Login, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  AuthenticateLogin(argument: _authentication_Login, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateLogin(argument: _authentication_Login, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateLogin(argument: _authentication_Login, metadata: grpc.Metadata, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateLogin(argument: _authentication_Login, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateLogin(argument: _authentication_Login, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  
  AuthenticateSignUp(argument: _authentication_SignUp, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  AuthenticateSignUp(argument: _authentication_SignUp, metadata: grpc.Metadata, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  AuthenticateSignUp(argument: _authentication_SignUp, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  AuthenticateSignUp(argument: _authentication_SignUp, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateSignUp(argument: _authentication_SignUp, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateSignUp(argument: _authentication_SignUp, metadata: grpc.Metadata, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateSignUp(argument: _authentication_SignUp, options: grpc.CallOptions, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  authenticateSignUp(argument: _authentication_SignUp, callback: grpc.requestCallback<_authentication_Token__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthenticationHandlers extends grpc.UntypedServiceImplementation {
  AuthenticateLogin: grpc.handleUnaryCall<_authentication_Login__Output, _authentication_Token>;
  
  AuthenticateSignUp: grpc.handleUnaryCall<_authentication_SignUp__Output, _authentication_Token>;
  
}

export interface AuthenticationDefinition extends grpc.ServiceDefinition {
  AuthenticateLogin: MethodDefinition<_authentication_Login, _authentication_Token, _authentication_Login__Output, _authentication_Token__Output>
  AuthenticateSignUp: MethodDefinition<_authentication_SignUp, _authentication_Token, _authentication_SignUp__Output, _authentication_Token__Output>
}
