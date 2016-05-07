Package.describe({
  name: 'app:riot-api',
  version: '0.0.1',
  summary: 'Facilitates connection to the Riot Api.',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  
  api.use([
    'ecmascript',
    'http'
  ]);
  
  api.mainModule('riot-api.js', 'server');
});