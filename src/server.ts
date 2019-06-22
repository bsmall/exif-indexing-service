import * as amqp from 'amqplib';

import config from './config';
import logger from './logger';
import {Channel, Connection} from "amqplib";

logger.info(`Node runtime environment (NODE_ENV): ${process.env.NODE_ENV}.`);


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




