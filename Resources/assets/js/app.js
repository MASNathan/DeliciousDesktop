$(document).ready(function() {
  $('.exit').click(function() {
    Ti.App.exit();
  });
});

var App = {};
App.Config = {};
App.Config.Options = {
    username: '',
    private_key: ''
  };

App.Config.load = function() {
  //Check for existance of a file
  var configFile = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(),'options');

  if(configFile.exists()) {
    //Loading User options
    var encodedData = '';

    configFile.open(Ti.Filesystem.MODE_READ);
    encodedData = configFile.readLine();

    var jsonData = window.atob(encodedData);
    var configs = Ti.JSON.parse(jsonData);
    Ti.App.stdout(configs);
    
    App.Config.Options = configs;
  }
};

App.Config.save = function(configs) {
  //Writing data to a file
  var configFile = Ti.Filesystem.getFileStream(Ti.Filesystem.getApplicationDataDirectory(),'options');

  var jsonData = Ti.JSON.stringify(configs);
  var encodedData = window.btoa(jsonData);

  configFile.open(Ti.Filesystem.MODE_WRITE);
  configFile.writeLine(encodedData);
  configFile.close();

  App.Config.Options = configs;
};

App.Options = {};
App.Options.load = function() {
  $('#username').val(App.Config.Options.username);
  $('#private_key').val(App.Config.Options.private_key);
};
App.Options.save =  function() {
  var configs = {
    username: $('#username').val(),
    private_key: $('#private_key').val()
  };

  App.Config.save(configs);
};

//App.Config.save({username: 'masnathan', private_key: 'J0loQjQ9pfZC39SyptuElV-AU4rJoQyweNGsSe2zIwc='});

App.Config.load();
