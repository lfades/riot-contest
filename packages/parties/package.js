Package.describe({
  name: 'app:parties',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
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
    'app:riot-api'
  ]);

  api.mainModule('client/index.js', 'client');
  api.mainModule('server/index.js', 'server');
});