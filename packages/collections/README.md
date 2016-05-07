# app:collections

## Collections Structure

### Parties
```js
{
  _id: 'jE2g9dxRnse46JmR8',
  region: 'la1',
  owner: 29275,
  summoners: [
    {
      id: 29275,
      name: 'Farcros',
      connectionId: 'nhYmJeRA3ePSQBFTk',
      side: 2
    },
    {
      id: 3771372,
      name: 'Rentzo',
      connectionId: 'NY8cQaKBiGEtCHCWg',
      side: 1
    }
  ],
  messages: [
    {
      id: 29275,
      name: 'Farcros',
      text: 'Hi guys. I have to say that I only play Renekton'
    },
    {
      id: 3771372,
      name: 'Rentzo',
      text: 'Since beta?'
    },
    {
      id : 29275,
      name : 'Farcros',
      text : 'Since pre-alpha'
    }
  ],
  // Champions selected at random (one per player)
  champions: [
    {
      id: 29275,
      champion: {
        championId: 58,
        championLevel: 5,
        championPoints: 176826,
        highestGrade: 'S+'
      }
    },
    {
      id: 3771372,
      champion: {
        championId: 104,
        championLevel: 5,
        championPoints: 116054,
        highestGrade: 'S'
      }
    }
  ]
}
```

### Summoners
```js
{
  _id: 'k8otPssogAKKJY7pe',
  id: 29275,
  region: 'la1',
  name: 'Farcros',
  // standardized name
  _name: 'farcros',
  profileIconId: 979,
  parties: [
    'jE2g9dxRnse46JmR8'
  ],
  // All champions with master's degree
  championMastery : [
    {
      championId: 58,
      championLevel: 5,
      championPoints: 176826,
      highestGrade: 'S+'
    },
    {
      championId: 111,
      championLevel: 5,
      championPoints: 53934,
      highestGrade: 'S+'
    },
    {
      championId: 105,
      championLevel: 5,
      championPoints: 59265,
      highestGrade: 'S+'
    }
    // ...
  ]
}
```