import { src, dest } from 'gulp';
import { paths } from '../config/paths.js';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import { onError } from '../utils/onError.js';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console(), new transports.File({ filename: 'logs.log' })],
});

export const processPngs = () => {
    logger.info('Starting png processing');

    return new Promise((resolve, reject) => {
        return src(paths.src.assets.png)
            .pipe(
                plumber({
                    errorHandler: onError,
                })
            )
            .pipe(
                size({
                    title: 'processPng : ',
                    showFiles: true,
                    showTotal: true,
                })
            )
            .pipe(dest(`${paths.dist.dir}/pngs`))
            .on('error', (err) => {
                logger.error(`Error processing png: ${err}`);
                reject(err);
            })
            .on('end', () => {
                logger.info('Finished png processing');
                resolve();
            });
    });
};
