import { src, dest } from 'gulp';
import { paths } from '../config/paths.js';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import { onError } from '../utils/onError.js';

export const processGifs = () => {
    return new Promise((resolve, reject) => {
        return src(paths.src.assets.gifs)
            .pipe(
                plumber({
                    errorHandler: onError,
                })
            )
            .pipe(
                size({
                    title: 'processGifs : ',
                    showFiles: true,
                    showTotal: true,
                })
            )
            .pipe(dest(`${paths.dist.dir}/gifs`))
            .on('error', reject)
            .on('end', resolve);
    });
};
