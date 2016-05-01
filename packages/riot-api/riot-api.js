import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
// Implementación de riot api para ser utilizada con mas facilidad
class RiotApi {
  constructor () {
    this.apiKey = '1CANTSH4RE1T';
    this._riotApiUrl = 'https://lan.api.pvp.net';
    // the server name varies sometimes. Keep here the possible values for a server
    this._regions = {
      na1: 'na',
      la1: 'lan',
      la2: 'las',
      eun1: 'eune',
      euw1: 'euw',
      kr: 'kr',
      br1: 'br',
      ru: 'ru',
      tr1: 'tr',
      jp1: 'jp',
      oc1: 'oce'
    };
    this.regions = Object.keys(this._regions)
  }
  /*
   * Reemplaza las variables de una url de la api de Riot con sus respectivos valores
   *
   * @param url {string}      Riot api url, e.g: /api/lol/{region}/v2.2/match/{matchId}
   * @param options {object}
   *   @key {string}    variable to be replaced, e.g: {region}
   *   @value {string}  value for the variable, e.g: LA1
   * @return {string}
   */
  _url (url, options) {
    for (let key in options) {
      url = url.replace(`{${key}}`, options[key]);
    }
    return `${this._riotApiUrl}${url}?api_key=${this.apiKey}`;
  }
  /*
   * Convert regions with the format la1, la2... to lan, las...
   *
   * @param region {string}
   * @return {string}
   */
  getRegion (region) {
    return this._regions[region] || region;
  }
  /*
   * devuelve el JSON de una consulta a la api
   *
   * @param url {string}
   * @param options {object}
   * @return {object} JSON
   */
  get (url, options) {
    try {
      return HTTP.get(this._url(url, options)).data;
    } catch (error) {
      const {response} = error;
      
      if (response.statusCode === 404)
        return null;

      if (response.statusCode === 429)
        throw new Meteor.Error(429, 'We have exceeded our number of requests to riot api, try again in a few seconds');

      if (response.statusCode === 500)
        throw new Meteor.Error(500, 'An error has occurred with the Riot server');
      
      throw new Meteor.Error(500, 'An unexpected error has occurred');
    }
  }
}

export default new RiotApi();