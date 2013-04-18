## do-favor

A ifttt-like toolkit, which could help you backup your resources easily, focus on twitter only.

### Usage
```npm install``` first and ```git submodule init && git submodule update``` 

Create a config.json as following:
```
{
    "consumer_key": "",
    "consumer_secret": "",
    "access_token": "",
    "access_token_secret": "",
    "ever_token": ""
}
```
You can get twitter authority from [here](https://dev.twitter.com/apps) and evernote ([development](https://sandbox.evernote.com/api/DeveloperToken.action) or [production](https://www.evernote.com/api/DeveloperToken.action).

If program will run development env as default, if you want to use on real world, please don't forget to set ```NODE_ENV=production```.

Then start up the program, it will backup all your favorite tweet to evernote. Maybe will add more services support in the future. Cause this is personal usage, please don't ask me to implement extra features. If you also need this then take it, or you could write a familiar one. :p

### Feature

Right now only support twitter -> evernote.
