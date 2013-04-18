var fs = require('fs');
var config = require('./config.json');

var twit = require('twit');
var T = new twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

var thrift = require('thrift');
var everConnection = require('./lib/evernode/lib/evernode/CustomConnections');
var everUserStore = require('./lib/evernode/lib/evernote-thrift/gen-nodejs/UserStore');
var everUserType = require('./lib/evernode/lib/evernote-thrift/gen-nodejs/UserStore_types');
var everNoteStore = require('./lib/evernode/lib/evernote-thrift/gen-nodejs/NoteStore');
var everNoteType = require('./lib/evernode/lib/evernote-thrift/gen-nodejs/NoteStore_types');
var everType = require('./lib/evernode/lib/evernote-thrift/gen-nodejs/Types_types');
const EVERNOTE_URL = (process.env.NODE_ENV == 'production') ? "www.evernote.com" : "sandbox.evernote.com";

function getUserClient() {
  var conn = everConnection.createHTTPSConnection(EVERNOTE_URL, 443, '/edam/user');
  conn.on('error', function(err) {
    console.error(err);
  });

  return thrift.createClient(everUserStore, conn);
}
function getNoteClient(userObj) {
  var conn = everConnection.createHTTPSConnection(EVERNOTE_URL, 443, "/edam/note/" + userObj.shardId);
  conn.on('error', function(err) {
    console.error(err);
  });

  return thrift.createClient(everNoteStore, conn);
}

var stream = T.stream('user');
stream.on('favorite', function(e) {
  if (e.target.screen_name
      && e.target_object.id_str
      && e.target_object.text) {
    var link = "https://twitter.com/" + e.target.screen_name + "/status/" + e.target_object.id_str;
    var result = link + "<br />" + unescape(encodeURIComponent(e.target_object.text));

    var user = getUserClient();
    user.getUser(config.ever_token, function(err, userObj) {
      if (err) { 
        console.error(err);
      } else {
        var content = "<?xml version='1.0' encoding='UTF-8'?><!DOCTYPE en-note SYSTEM 'http://xml.evernote.com/pub/enml2.dtd'><en-note>" + result + "</en-note>";
        var note = {
          title: new Date().toString(),
          content: content,
          created: new Date().getTime(),
          contentLength: result.length
        };
        var noteType = new everType.Note(note);

        var note = getNoteClient(userObj);
        note.createNote(config.ever_token, noteType, function(err, resp) {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  }
});
