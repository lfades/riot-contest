# Versus.lol
Description

To see the aplication running visit [Versus.lol](https://www.versus.lol/)

## Install
1. Install [Meteor](https://www.meteor.com/install)
1. Clone this branch to your local machine
3. Run `meteor`

## API Key
in the file [packages/riot-api/riot-api.js](https://github.com/Goluis/riot-contest/blob/master/packages/riot-api/riot-api.js) put your api key
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