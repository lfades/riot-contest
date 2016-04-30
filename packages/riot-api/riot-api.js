import { HTTP } from 'meteor/http';
// Implementación de riot api para ser utilizada con mas facilidad
class RiotApi {
	constructor () {
		this.apiKey = '1CANTSH4RE1T';
		this._riotApiUrl = 'https://lan.api.pvp.net';
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
   * devuelve el JSON de una consulta a la api
   *
   * @param url {string}
   * @param options {object}
   * @return {object} JSON
   */
	get (url, options) {
		return HTTP.get(this._url(url, options)).data;
	}
}

export default new RiotApi();