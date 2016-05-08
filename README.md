# Versus.lol

To see the aplication running visit [Versus.lol](https://www.versus.lol/). The database structure is in [packages/collections](https://github.com/Goluis/riot-contest/tree/master/packages/collections)

### What is this?

This is an app built with Meteorjs that my younger brother and I have created for the Riot Challenge, our idea is a simple one, we would like that LOL could have a new game mode in which all players before the game can to talk to each other in a chat, laugh for a while and then decide which side they want to play on, this could be possible in 1vs1, 2vs2...5vs5.

The most interesting part is that all champions would play with the same mastery level, this is an important difference with the ARAM mode. We believe that games where people could only play with level 1 or level 5 mastery champions would be very funny. The game could be more challenging in both ways because the complexity is bigger  and this could mean lots of fun with friends.

By the way, what we did for this demo was making all summoners start with a random champion with the main condition of having the same champion mastery level in order to make things more interesting.

The summoner who created the room is the only one who can start the match and choose the level of mastery for the game. For this demo the invitations are from a "share link", with LOL that could be just a simple invitation game, but for these web demo the share link works :v

Finally, We have to say that this does nothing by itself, it's just a demo, after the match nothing happened because we are not integrated with LOL, and we don't want a versus.lol page for this kind of game, we really want this type of game inside the LOL platform, this is just a simple idea that came to us for this Riot Challenge.

Julián and Luis.

### Why MeteorJs and MongoDB ?
We’ve been playing with Meteorjs and MongoDB for two years, Meteorjs is great to build Reactive stuff, and everything in this demo use reactivity, for example the chat. When a summoner gets into the room or leaves the room, chooses a side or starts the match, all players can see everything in real time, everything is reactive. that’s why we chose it, Meteorjs is good with these kind of things and MongoDB is the database integrated with Meteorjs and is great for something that needs to scale and change without pain, MeteorJs and MongoDB has a huge community and is fun to code with them and make prototypes fast.

A personal challenge for this demo was handling the status of connected users without asking a login and how to use the Riot Api, additionally it is the first time we use the 1.3  version (current) of MeteorJS, because is very new. If you are reading these and know something about Meteorjs you can feel me xD.

### UI and UX

This demo is flat, we just used Flexbox concepts for grid and responsive stuff, pure and good CSS with nice images that results in a beautiful combination, a lot of opacity here, you will see that all CSS code is in two files global.css and web.css. We don't want libraries and frameworks in front-end for something not that big.

All our code is clean and with comments, go and check.

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
| `app:collections` | All collections in Mongodb that we are using.|
| `app:riot-api` | Facilitates connection to the Riot Api. |

### Meteor Community Packages
- [kadira:flow-router](https://github.com/kadirahq/flow-router/)
- [kadira:blaze-layout](https://github.com/kadirahq/blaze-layout/)
- [cottz:publish-relations](https://github.com/Goluis/cottz-publish-relations/)