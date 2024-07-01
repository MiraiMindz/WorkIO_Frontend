import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

import { ProtoGrpcType as AuthServiceProtoGrpcType } from '@/proto/generated/Authentication';

const AUTH_PROTO_PATH = path.join(process.cwd(), './src/proto/Authentication.proto');

const packageDefinition = protoLoader.loadSync(AUTH_PROTO_PATH, {
    defaults: true,
    keepCase: true,
    oneofs: true,
});

const TestService = (
    grpc.loadPackageDefinition(packageDefinition) as unknown as AuthServiceProtoGrpcType
).authentication;

const { Authentication, Login, SignUp, Token } = TestService;

export { Authentication, Login, SignUp, Token };