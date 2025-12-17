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

export const processSvgs = () => {
    logger.info('Starting SVG processing');

    return new Promise((resolve, reject) => {
        return src(paths.src.assets.svgs)
            .pipe(
                plumber({
                    errorHandler: onError,
                })
            )
            .pipe(
                size({
                    title: 'processSvgs : ',
                    showFiles: true,
                    showTotal: true,
                })
            )
            .pipe(dest(`${paths.dist.dir}/svgs`))
            .on('error', (err) => {
                logger.error(`Error processing SVGs: ${err}`);
                reject(err);
            })
            .on('end', () => {
                logger.info('Finished SVG processing');
                resolve();
            });
    });
};
