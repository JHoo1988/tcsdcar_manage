fis.config.set('modules.postpackager', 'simple');

fis.config.set('pack', {
    // js
    '/scripts/lib.js': [
        '/scripts/global.js',
        '/scripts/jquery.min.js',
        '/scripts/jquery.cookie.js',
        '/scripts/layer.js',
        '/scripts/jquery.placeholder.min.js'
    ]
});

fis.config.set('roadmap.path', [
    {
        reg: /(scripts\/skin\/.*)/,
        useHash: false,
        release: '$1'
    }
]);

fis.config.set('roadmap.path', [
    {
        reg: /(scripts\/skin\/.*)/,
        useHash: false,
        release: '$1'
    },
    {
        reg: /(styles\/.*.scss)/,
        release: false
    },
    {
        reg: /(images\/wash\/constrast\/.*.(?:png|jpg))/,
        useHash: false,
        release: '$1'
    },
    {
        reg: /(images\/wash\/product\/.*.(?:png|jpg))/,
        useHash: false,
        release: '$1'
    },
    {
        reg: /(buyoutprice\/images\/banner\/.*.(?:png|jpg))/,
        useHash: false,
        release: '$1'
    },
    {
        reg: /(zhwash\/m\/images\/btn\/.*.(?:png|jpg))/,
        useHash: false,
        release: '$1'
    },
    {
        reg: /(service_provider_registration\/m\/images\/.*.(?:png|jpg))/,
        useHash: false,
        release: '$1'
    },
    {
        reg: /(styles\/.*.map)/,
        release: false
    },
    {
        reg: /(tongc\/lib\/.*)/,
        useHash: false,
        release: '$1'
    }
]);

fis.config.merge({
    /*modules: {
        optimizer: {
            html: "htmlmin"
        }
    },
    settings: {
        optimizer: {
            "htmlmin": {
                minifyJS: false
            }
        }
    },*/
    roadmap: {
        // domain: "http://base.shifendaojia.com/www"
        domain: "http://www.tcsdcar.com"
    }
});
