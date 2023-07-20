import { Socket } from "net";

export interface Output {
    name: string;
    host: string;
    port: number;
    socket?: Socket;
}
