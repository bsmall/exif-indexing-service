import * as amqp from 'amqplib';

import config from './config';
import logger from './logger';
import {Channel, Connection, ConsumeMessage, Replies} from "amqplib";

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

                mqChannel.assertQueue(config.get('server.messageQueueConfig.queueName'), {
                    durable: true,
                    exclusive: false
                })
                    .then(queueValue => {
                        console.log(`Waiting for messages in ${config.get('server.messageQueueConfig.queueName')}.`);

                        // Consume messages from queue.
                        mqChannel.consume(config.get('server.messageQueueConfig.queueName'), (message: ConsumeMessage | null) => {

                            // Convert message to JSON object.
                            let messageObj = undefined;

                            if (message) {
                                // Convert message payload to object.
                                messageObj = JSON.parse(message.content.toString());

                                logger.debug(`Starting to process: ${messageObj.eventType} --> ${messageObj.path}`);


                                // TODO: Write code to process the message and update ElasticSearch database.


                                logger.debug(`Done processing: ${messageObj.eventType} --> ${messageObj.path}`);

                                mqChannel.ack(message);
                                logger.debug(`Message acknowledged and dequeued for ${messageObj.eventType} --> ${messageObj.path}.`);
                            }


                        }, {
                            noAck: false
                        })


                    })
                    .error(errorInfo => {
                        // TODO: Handle error info
                        logger.error(`Error trying to access queue. ${errorInfo}.`);
                    })
            })
            .error((error: any) => {
                // TODO: Handle any channel errors.
                logger.error(`Error establishing channel to message queue. ${error}`);
            });
    })
    .error((error: any) => {
            logger.error(`Error connecting to message queue. ${error}.`);
            //TODO: Stop the service instead of killing node process.
            process.exit(1);
        }
    );



