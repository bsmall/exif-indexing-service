import * as path from "path";
import convict from "convict";

// Define the configuration file schema here.
const config = convict({
    port: {
        doc: 'The port to bind.',
        format: 'port',
        default: 0,
        env: 'PORT'
    },
    logs: {
        logDirectory: {
            doc: 'Path for log files.',
            format: String,
            default: 'logs/'
        },
        serverLog: {
            logLevel: {
                doc: 'Logging level of detail to use.',
                format: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
                default: 'info'
            },
            filename: {
                doc: 'Path and name of server log file.',
                format: String,
                default: 'server.log'
            },
            maxSizeBytes: {
                doc: 'Maximum size of log file (in bytes) before rotating to new log file.',
                format: Number,
                default: 5242880
            },
            maxFiles: {
                doc: 'Maximum count of log file to keep on hand before rotating older ones out.',
                format: Number,
                default: 5
            }
        },
        serverErrorLog: {
            logLevel: {
                doc: 'Logging level of detail to use.',
                format: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
                default: 'error'
            },
            filename: {
                doc: 'Name of server log file.',
                format: String,
                default: 'server-error.log'
            },
            maxSizeBytes: {
                doc: 'Maximum size of log file (in bytes) before rotating to new log file.',
                format: Number,
                default: 5242880
            },
            maxFiles: {
                doc: 'Maximum count of log files to keep on hand before rotating older ones out.',
                format: Number,
                default: 5
            }
        },
        serverConsoleLog: {
            logLevel: {
                doc: 'Logging level of detail to use.',
                format: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
                default: 'error'
            },
            silent: {
                doc: 'Boolean flag indicating whether to suppress output.',
                format: Boolean,
                default: false
            }
        }
    },
    server: {
        corsOptions: {
            origin: {
                doc: 'Configures the Access-Control-Allow-Origin header. Can be a single string value, or an array of string values',
                default: "*"
            },
            methods: {
                doc: 'Configures the Access-Control-Allow-Methods. Expects a comma-delimited string.',
                format: String,
                default: "GET,HEAD,PATCH,POST,DELETE"
            },
            preflightContinue: {
                doc: 'Pass the CORS preflight response to the next handler.',
                format: Boolean,
                default: false
            },
            optionsSuccessStatus: {
                doc: 'Provides a status code to use for successful OPTIONS requests, since some legacy browsers choke on 204.',
                format: Number,
                default: 204
            }
        },
        compressionOptions: {
            level: {
                doc: 'The level of zlib compression to apply to responses. Valid integer values are 0 - 9, with 0 being no compress and 9 being maximum compression but more time to complete. A special value of -1 applies the default compression level (as of June 6, 2019, this is equivalent to level 6.',
                format: (val) => {
                    if (isNaN(parseInt(val)) || val < -1 || val > 9) {
                        throw new Error('Configuration file item server.compressionOptions.level must be an integer value between 0 - 9, or -1.');
                    }
                },
                default: -1
            }
        },
        staticContent: {
            path: {
                doc: 'Path to static web site assets (images, files, css, etc.), relative to from where Node app is running. Default is relative to Node/server root /public.',
                format: String,
                default: '/public'
            }
        },
        messageQueueConfig: {
            hostUrl: {
                doc: 'Url to RabbitMQ Message Server, including username and password.',
                format: String,
                default: 'amqp://guest:guest@localhost'
            },
            channel: {
                doc: 'Message queue channel name',
                format: String,
                default: 'fileEventMessages'
            },
            exchange: {
                doc: 'Message queue exchange name',
                format: String,
                default: ''
            },
            queueName: {
                doc: 'Message queue \'Queue\' name',
                format: String,
                default: 'fileWatcherQueue'
            }
        }
    }
});

// Load environment specific config file based on the NODE_ENV environment variable.
const configFilePath = path.join(`${__dirname}`, `${process.env.NODE_ENV}.json`);

try {
    config.loadFile(configFilePath);
    config.validate({allowed: 'strict'});
} catch (err) {
    // Log error and bail out.
    console.log(`Error parsing configuration file '${configFilePath}': ${err.message}`);
    process.exit(1);
}

// Expose loaded config file object.
export default config;
