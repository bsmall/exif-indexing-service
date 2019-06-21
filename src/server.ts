import * as fs from 'fs';
import * as amqp from 'amqplib';

import config from './config';
import logger from './logger';
import {FileEventMessage, EventType} from './fileEventMessage';
import {Channel, Connection} from "amqplib";

logger.info(`Node runtime environment (NODE_ENV): ${process.env.NODE_ENV}.`);

const watchConfig = {
    usePolling: config.get('server.watchConfig.usePolling'),
    interval: config.get('server.watchConfig.interval'),
    binaryInterval: config.get('server.watchConfig.binaryInterval'),
    depth: config.get('server.watchConfig.depth'),
    awaitWriteFinish: {
        stabilityThreshold: config.get('server.watchConfig.awaitWriteFinish.stabilityThreshold'),
        pollInterval: config.get('server.watchConfig.awaitWriteFinish.pollInterval')
    },
    ignoreInitial: config.get('server.watchConfig.ignoreInitial')
};

let mqChannel: Channel;

// Connect to message queue server.
amqp.connect(config.get('server.messageQueueConfig.hostUrl'))
    .then((connection: Connection) => {
        logger.info(`Connected to message queue.`);

        // Create message queue channel.
        connection.createChannel()
            .then((channel: Channel) => {
                logger.info(`Created message queue channel.`);
                mqChannel = channel;
            })
            .error((error: any) => {
                // TODO: Handle any channel errors.
            });
    })
    .error((error: any) => {
        logger.error(`Error connecting to message queue. ${error}.`);
        //TODO: Stop the service instead of killing node process.
        process.exit(1);   
    });




