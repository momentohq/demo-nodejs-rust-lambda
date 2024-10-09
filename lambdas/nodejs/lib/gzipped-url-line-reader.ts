import * as winston from 'winston';
import {Readable} from 'stream';
import * as zlib from 'node:zlib';
import * as readline from 'node:readline';
import * as events from 'node:events';
import {LineReader} from './line-reader';

export class GzippedUrlLineReader implements LineReader {
  private readonly logger: winston.Logger;
  private readonly lines: string[];
  private constructor(logger: winston.Logger, lines: string[]) {
    this.logger = logger;
    this.lines = lines;
  }

  static async create(logger: winston.Logger, url: string): Promise<GzippedUrlLineReader> {
    const response = await fetch(url);

    // Convert the web ReadableStream to a Node.js Readable stream, so that we can use it with the nodejs zlib and readline libraries
    const reader = response.body!.getReader();
    const stream = new Readable({
      async read() {
        const {done, value} = await reader.read();
        if (done) {
          this.push(null); // No more data, end the stream
        } else {
          this.push(value); // Push the chunk into the Node.js stream
        }
      },
    });

    const gunzipStream = stream.pipe(zlib.createGunzip());

    // This is a very inefficient implementation; we are simply reading all of the lines from the remote file into memory.
    // If the file was significantly larger than it is, this would result in an out-of-memory error. This code could be
    // refactored to read the lines from the stream as they are needed, rather than reading them all into memory at once;
    // the interface is intended to provide an API that would be forward-compatible with that optimization.
    const lines: string[] = [];
    const rl = readline.createInterface({
      input: gunzipStream,
      crlfDelay: Infinity,
    });

    rl.on('line', line => {
      logger.debug(`GzippedUrlLineReader read a line: '${line}'`);
      lines.push(line);
    });

    await events.once(rl, 'close');

    logger.info('GzippedUrlLineReader: read all lines');
    return new GzippedUrlLineReader(logger, lines);
  }

  readLine(): Promise<string | undefined> {
    return Promise.resolve(this.lines.pop());
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}
