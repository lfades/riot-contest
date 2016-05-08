# Versus.lol

##Description

### What is this?
This is an app build with Meteorjs that my younger brother and I have created for the Riot Challenge, our idea is simple, we would like that LOL can have a new game mode where all players before the game can to talk in a chat, laugh a while and then decide which side they want to play, this can be 1vs1, 2vs2...5vs.5.

The most interesting part is that all champions would play with the same mastery level, this is an important difference to the type of gameplay Aram.
We believe it would be fun to see games where everyone can not play a certain champion because all are mastery 1 or where everyone knows play them because they are mastery 5, and with a group of friends this could be a lot of fun.

By the way for this demo we did all champions after start are a random match with the only condition that everyone had the same level in mastery of champions, that makes things interesting.

Finally, We have to say that this does nothing by itself, it's just a demo, after the match is made  nothing happens because we are not integrated with LOL, and we don't want a versus.lol page for this kind of game, we really want this type of game inside LOL, it just a simple idea that occurred to us for this Riot Challenge, thanks Riot.
Julian and Luis.

To see the aplication running visit [Versus.lol](https://www.versus.lol/). The database structure is in [packages/collections](https://github.com/Goluis/riot-contest/tree/master/packages/collections)

## Install
1. Install [Meteor](https://www.meteor.com/install)
1. Clone this branch to your local machine
3. Run `meteor`

## API Key
in the file [packages/riot-api/riot-api.js](https://github.com/Goluis/riot-contest/blob/master/packages/riot-api/riot-api.js) put your [api key](https://developer.riotgames.com/)
```js
// riot-api.js
this.apiKey = 'your-api-key';
```

## Packages
### Core Packages
| Name | Description |
| --- | --- |
| `app:parties` | Main application package, contains all the logic and front-end. |
| `app:collections` | All collections in Mongodb we are using.|
| `app:riot-api` | Facilitates connection to the Riot Api. |

### Meteor Community Packages
- [kadira:flow-router](https://github.com/kadirahq/flow-router/)
- [kadira:blaze-layout](https://github.com/kadirahq/blaze-layout/)
- [cottz:publish-relations](https://github.com/Goluis/cottz-publish-relations/)