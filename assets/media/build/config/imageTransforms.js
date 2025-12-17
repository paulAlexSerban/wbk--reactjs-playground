// specify transforms

const ratio1x1 = [
    {
        options: {
            width: 480,
            height: 480,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 960,
            height: 960,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 1280,
            height: 1280,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 1920,
            height: 1920,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },

    {
        options: {
            width: 2560,
            height: 2560,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
];

const ratio3x4 = [
    {
        options: {
            width: 360,
            height: 480,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 720,
            height: 960,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 960,
            height: 1280,
            fit: 'cover',
            quality: 100,

            effort: 6,
        },
    },
    {
        options: {
            width: 1440,
            height: 1920,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 1920,
            height: 2560,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
];

const ratio4x3 = [
    // {
    //     options: {
    //         width: 480,
    //         height: 360,
    //         fit: 'cover',
    //         quality: 100,
    //         effort: 6,
    //     },
    // },
    // {
    //     options: {
    //         width: 960,
    //         height: 720,
    //         fit: 'cover',
    //         quality: 100,
    //         effort: 6,
    //     },
    // },
    // {
    //     options: {
    //         width: 1280,
    //         height: 960,
    //         fit: 'cover',
    //         quality: 100,
    //         effort: 6,
    //     },
    // },
    {
        options: {
            width: 1920,
            height: 1440,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    // {
    //     options: {
    //         width: 2560,
    //         height: 1920,
    //         fit: 'cover',
    //         quality: 100,
    //         effort: 6,
    //     },
    // },
];

const ratio16x9 = [
    {
        options: {
            width: 480,
            height: 270,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 960,
            height: 540,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 1280,
            height: 720,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 1920,
            height: 1080,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 2560,
            height: 1440,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
];

const ratios21x9 = [
    {
        options: {
            width: 480,
            height: 228,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 960,
            height: 456,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 1280,
            height: 608,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 1920,
            height: 912,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
    {
        options: {
            width: 2560,
            height: 1216,
            fit: 'cover',
            quality: 100,
            effort: 6,
        },
    },
];

const transforms = [
    // ...ratio1x1,
    ...ratio4x3,
];

export default transforms;
