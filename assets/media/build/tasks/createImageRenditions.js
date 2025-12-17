import { paths } from '../config/paths.js';
import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import sharp from 'sharp';
import transforms from '../config/imageTransforms.js';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console(), new transports.File({ filename: '../dist/logs.log' })],
});

// resize images
export const createImageRenditions = (done) => {
    const renditionsManifest = [];
    logger.info('Starting image resizing');

    // glob all files
    let files = globSync(paths.src.assets.images);
    console.log({ files });

    // loop through configuration array of objects
    transforms.forEach((transform) => {
        // if dist folder does not exist, create it with all parent folders
        if (!fs.existsSync(`${paths.dist.dir}/images`)) {
            fs.mkdirSync(`${paths.dist.dir}/images`, { recursive: true }, (err) => {
                if (err) {
                    logger.error(`Error creating folder: ${err}`);
                    throw err;
                }
            });
        }

        // for each file, apply transforms and save to file
        files.forEach((file) => {
            let filename = path.parse(file).name;

            sharp(file)
                .resize(transform.options)
                .webp({ effort: 6, lossless: true })
                .toFile(
                    transform.options.height
                        ? `${paths.dist.dir}/images/${filename}-${transform.options.width}_${transform.options.height}.webp`
                        : `${paths.dist.dir}/images/${filename}-${transform.options.width}.webp`
                )
                .then(() => {
                    logger.info(
                        transform.options.height
                            ? `Transformed image: ${filename}-${transform.options.width}_${transform.options.height}.webp`
                            : `Transformed image: ${filename}-${transform.options.width}.webp`
                    );
                })
                .catch((err) => {
                    logger.error(
                        transform.options.height
                            ? `Error transforming image: ${filename}-${transform.options.width}_${transform.options.height}.webp - ${err}`
                            : `Error transforming image: ${filename}-${transform.options.width}.webp - ${err}`
                    );
                });
            renditionsManifest.push({
                [filename]: {
                    width: transform.options.width,
                    height: transform.options.height,
                },
            });

            // sharp(file)
            //   .resize(transform.options)
            //   .avif({})
            //   .toFile(
            //     `${paths.dist.dir}/images/${filename}-${transform.options.width}_${transform.options.height}.avif`
            //   )
            //   .then(() => {
            //     logger.info(
            //       `Transformed image: ${filename}-${transform.options.width}_${transform.options.height}.avif`
            //     );
            //   })
            //   .catch((err) => {
            //     logger.error(
            //       `Error transforming image: ${filename}-${transform.options.width}_${transform.options.height}.avif - ${err}`
            //     );
            //   });
            // renditionsManifest.push({
            //   [filename]: {
            //     width: transform.options.width,
            //     height: transform.options.height,
            //   },
            // });
        });
    });

    // // Create original webp files
    // files.forEach((file) => {
    //     let filename = path.parse(file).name;
    //     sharp(file)
    //         .webp({})
    //         .toFile(`${paths.dist.dir}/images/${filename}-original.webp`)
    //         .then(() => {
    //             logger.info(`Created original webp image: ${filename}-original.webp`);
    //         })
    //         .catch((err) => {
    //             logger.error(`Error creating original webp image: ${filename}-original.webp - ${err}`);
    //         });
    // });

    const jsonRenditionsManifest = JSON.stringify(renditionsManifest);
    // Write JSON string to file
    fs.writeFile('../dist/images/imageRenditionsManifest.json', jsonRenditionsManifest, (err) => {
        if (err) throw err;
        console.log('JSON file has been saved.');
    });
    logger.info('Finished image resizing');
    done();
};
