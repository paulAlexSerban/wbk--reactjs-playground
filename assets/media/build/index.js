import { task, parallel, series } from 'gulp';
// import { clean } from './tasks/clean.js';
import { processIcons } from './tasks/processIcons.js';
import { processSvgs } from './tasks/processSvgs.js';
import { createImageRenditions } from './tasks/createImageRenditions.js';
import { processVideos } from './tasks/processVideos.js';
import { processAudio } from './tasks/processAudio.js';
import { processGifs } from './tasks/processGifs.js';
import { processPngs } from './tasks/processPngs.js';
// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------
task(
    'process',
    series(
        // clean,
        parallel(
            // processIcons,
            // processSvgs,
            createImageRenditions
            // processVideos,
            // processAudio,
            // processGifs,
            // processPngs
        )
    )
);

task();
