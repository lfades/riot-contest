Package.describe({
  name: 'app:collections',
  version: '0.0.1',
  summary: 'Collections for the app',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');

  api.use(['ecmascript', 'mongo']);
  
  api.mainModule('collections.js');
});