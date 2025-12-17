import { src, dest } from 'gulp';
import { paths } from '../config/paths.js';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import { onError } from '../utils/onError.js';

export const processIcons = () => {
    return new Promise((resolve, reject) => {
        console.log('Starting processIcons task...');
        return src(paths.src.assets.icons)
            .pipe(
                plumber({
                    errorHandler: onError,
                })
            )
            .pipe(
                size({
                    title: 'processIcons : ',
                    showFiles: true,
                    showTotal: true,
                })
            )
            .pipe(dest(`${paths.dist.dir}/icons`))
            .on('error', (err) => {
                console.error(`Error in processIcons task: ${err}`);
                reject(err);
            })
            .on('end', () => {
                console.log('Completed processIcons task.');
                resolve();
            });
    });
};
