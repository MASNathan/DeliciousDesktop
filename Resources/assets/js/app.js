$(document).ready(function() {
  $('.exit').click(function() {
    Ti.App.exit();
  });

  $('#search').keyup(function() {
    App.Table.search($(this).val());
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

App.Request = {};
App.Request.data = [];
App.Request.linq = null;
App.Request.feed = function(username, private_key, callbackFunction) {
    var data = $.get('//feed.php', {u: username, k: private_key}, callbackFunction, 'json');
};

App.Table = {};
App.Table.obj = $('table.table');
App.Table.load = function(data) {
  App.Table.obj.html('');
  for (var i = data.length - 1; i >= 0; i--) {
    App.Table.obj.append('<tr><td><div class="link"><a href="' + data[i].u + '" target="_blank" >' + data[i].d + '</a></div></td></tr>');
  }
};
App.Table.search = function(string) {
  var searchResult = App.Request.linq.Where(function(item) {
    var tagTrain = item.t.join('-');
    Ti.App.stdout(tagTrain);
    return tagTrain.indexOf(string) !== -1;
  });

  App.Table.load(searchResult.items);
};

App.Config.load();

App.Request.feed(App.Config.Options.username, App.Config.Options.private_key, function(data) {
  App.Request.data = data;
  App.Request.linq = JSLINQ(data);
  
  App.Table.load(App.Request.data);
});
