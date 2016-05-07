Package.describe({
  name: 'app:parties',
  version: '0.0.1',
  summary: 'Main application package, contains all the logic and front-end.',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  
  api.use([
    'ecmascript',
    'templating',
    'mongo',
    'tracker',
    'check',
    'underscore',
    
    'kadira:flow-router',
    'kadira:blaze-layout',

    'app:collections',
    'app:riot-api',
    'cottz:publish-relations'
  ]);

  api.mainModule('client/index.js', 'client');
  api.mainModule('server/index.js', 'server');
});