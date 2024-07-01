import { ChannelCredentials, Client } from "@grpc/grpc-js";
import { Authentication } from "@/lib/gRPC/Authenticate";
import { promisify } from "util";
import { AuthenticationClient } from "@/proto/generated/authentication/Authentication";

const getGrpcClient = () => {
    if (process.env.GRPC_SERVER_HOST_NAME === undefined) {
        throw new Error("GRPC_SERVER_HOST_NAME is not set");
    }

    return new Authentication(
        `${process.env.GRPC_SERVER_HOST_NAME}:50051`,
        ChannelCredentials.createInsecure()
    );
};

const authFunc = promisify(
    (client: AuthenticationClient, request: { email: string, password: string}, callback: (error: Error | null, response: any) => void) => {
        client.AuthenticateLogin(request, callback);
    }
);

export async function POST(request: Request) {
    try {
        const client = getGrpcClient();

        const body = await request.json();
        const email = body.email;
        const password = body.password;

        const response = await authFunc(client, { email, password });

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("gRPC call failed:", error);
        return new Response(JSON.stringify({ error: "Request has failed, check server logs!" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}