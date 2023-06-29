import Server, { Socket } from 'net';
import { createLogger, format, transports } from 'winston';

interface FeedOutput {
    name: string;
    host: string;
    port: number;
}

/* Logger */
const logger = createLogger({
    format: format.combine(format.colorize(), format.simple()),
    transports: [new transports.Console()],
});

/* Network */
const feedOutputs: FeedOutput[] = [
    { name: 'ADSB.lol', host: 'feed.adsb.lol', port: 30004 },
    { name: 'ADSB.fi', host: 'feed.adsb.fi', port: 30004 },
    { name: 'ADSB.one', host: 'feed.adsb.one', port: 64004 },
    { name: 'ADSB.Exchange', host: 'feed1.adsbexchange.com', port: 30004 },
    { name: 'ADSB.Planespotters', host: 'feed.planespotters.net', port: 30004 }
];

const outputs: Socket[] = ConnectOutputs(feedOutputs);

const receiver = Server.createServer({ keepAlive: true });

receiver.listen({ port: 30004 }, () => {
    logger.info('ADSB-Router listening on port :30004');
});

receiver.on('connection', ReceiverListener);
receiver.on('close', () => {
    logger.info('Server closed');
});

function ReceiverListener(socket: Socket) {
    const { remoteAddress, remotePort } = socket;

    logger.info(`INPUT: ${remoteAddress}:${remotePort} connected`);

    socket.on('data', (data) => {
        outputs.forEach((output) => output.write(data));
    });

    socket.on('close', (hadError) => {
        logger.info(`INPUT: ${remoteAddress}:${remotePort} disconnected error: ${hadError}`);
    });

    socket.on('error', (err) => {
        logger.error(err.message);
    });
}

function ConnectOutputs(feedOutputs: FeedOutput[]): Socket[] {
    return feedOutputs.map((output) => {
        const { name, host, port } = output;
        const out = Server.createConnection(port, host, () => {
            logger.info(`OUTPUT: Connected to ${name}`);
        });

        out.on('error', (err) => logger.error(err.message));
        out.on('close', (hadError) => logger.info(`OUTPUT: Disconnected from ${name} error: ${hadError}`));

        return out;
    });
}