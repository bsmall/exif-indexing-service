import * as amqp from 'amqplib';

// TODO: Upgrade to ElasticSearch 7.x.
import {Client, ApiResponse, RequestParams} from 'elasticsearch6'

import config from './config';
import logger from './logger';
import {Channel, Connection, ConsumeMessage, Replies} from "amqplib";

logger.info(`Node runtime environment (NODE_ENV): ${process.env.NODE_ENV}.`);


let mqChannel: Channel;

// Connect to ElasticSearch
// TODO: Add error handling if connection to ElasticSearch fails.
logger.info('Connecting to Elastic Search...');
const esClient = new Client({
    // TODO: Convert 'node' param to a config file property.
    node: 'http://localhost:9200'
});
esClient.info().then((info) => {
    if (info.statusCode === 200) {
        logger.info(`Connected to ElasticSearch. Url: ${info.meta.connection.url}, Cluster Name: ${info.body.cluster_name}, Version: ${info.body.version.number}.`);

        // Check if Index exists - If not, create it.
        // TODO: Make 'index' parameter a config file option.
        esClient.indices.exists({index: "test"})
            .then((indexResponse) => {
                // console.log(`indexResponse`, indexResponse);
                if (indexResponse.statusCode === 404) {
                    
                    // Create the index.
                    // TODO: Make 'index' parameters a config file option.
                    esClient.indices.create({index: "test"})
                        .then((indexCreateResponse) => {
                            // console.log(`indexCreateResponse`, indexCreateResponse);
                        })
                }
            });


    } else {
        logger.warn(`Possible issue connecting to ElasticSearch`);
    }

});

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
                        // console.log(`Waiting for messages in ${config.get('server.messageQueueConfig.queueName')}.`);

                        // Consume messages from queue.
                        mqChannel.consume(config.get('server.messageQueueConfig.queueName'), (message: ConsumeMessage | null) => {

                            // Convert message to JSON object.
                            // TODO: Define class for messageObj to get rid of 'any' type declaration.
                            let messageObj: any = undefined;

                            if (message) {
                                // Convert message payload to object.
                                messageObj = JSON.parse(message.content.toString());

                                logger.debug(`Starting to process: ${messageObj.eventType} --> ${messageObj.path}`);


                                // TODO: Write code to process the message and update ElasticSearch database.
                                // TODO: Make esIndexName a config file setting for the 'index' name.
                                const esIndexName: string = 'test';
                                const esDocument: RequestParams.Index = {
                                    index: esIndexName,
                                    type: "test",
                                    id: messageObj.path,
                                    body: messageObj
                                };
                                esClient.index(esDocument).then((esResponse) => {
                                    // console.log(`esResponse: `, esResponse);

                                    logger.debug(`Done processing: ${messageObj.eventType} --> ${messageObj.path}`);

                                    mqChannel.ack(message);
                                    logger.debug(`Message acknowledged and dequeued for ${messageObj.eventType} --> ${messageObj.path}.`);

                                    // TODO: Add error handling if ElasticSearch Index operation fails.
                                });

                            }


                        }, {
                            noAck: false
                        }).then((value: Replies.Consume) => {
                            // console.log('Replies.Consume', value);
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



