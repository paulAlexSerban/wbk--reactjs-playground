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

export const processVideos = () => {
    logger.info('Starting video processing');

    return new Promise((resolve, reject) => {
        return src(paths.src.assets.videos)
            .pipe(
                plumber({
                    errorHandler: onError,
                })
            )
            .pipe(
                size({
                    title: 'processVideos : ',
                    showFiles: true,
                    showTotal: true,
                })
            )
            .pipe(dest(`${paths.dist.dir}/videos`))
            .on('error', (err) => {
                logger.error(`Error processing videos: ${err}`);
                reject(err);
            })
            .on('end', () => {
                logger.info('Finished video processing');
                resolve();
            });
    });
};
