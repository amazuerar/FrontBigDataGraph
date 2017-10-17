import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 * Servicio para retornar noticias y colaboradores de la universidad de los andes con su respectiva informacion
 * @export
 * @class BackService
 */

@Injectable()
export class BackService {

  address = "172.24.100.104";
  // address = "127.0.0.1";
  port = "8081";

  /**
   * Crea una instancia del componente servicio RssService.
   * @param {Http} http paquete de angular necesario para hacer peticiones http
   * @memberof BackService
   */
  constructor(private http: Http) { }

  getEnlaces(personaje, lugar, hecho) {
    return this.http.get('http://' + this.address + ':' + this.port + '/ENLACES' + '/' + personaje + '/' + lugar + '/' + hecho + '/' + '/' )
      .map(res => res.json())
      .toPromise()
  }


  getNodos(personaje, lugar, hecho) {
    return this.http.get('http://' + this.address + ':' + this.port + '/NODOS' + '/' + personaje + '/' + lugar + '/' + hecho + '/' + '/')
      .map(res => res.json())
      .toPromise()
  }


  getEnlacesConFechas(personaje, lugar, hecho, start, end) {
    return this.http.get('http://' + this.address + ':' + this.port + '/ENLACESFECHAS' + '/' + personaje + '/' + lugar + '/' + hecho + '/' + start +  '/' + end )
      .map(res => res.json())
      .toPromise()
  }


  getNodosConFechas(personaje, lugar, hecho, start, end) {
    return this.http.get('http://' + this.address + ':' + this.port + '/NODOSFECHAS' + '/' + personaje + '/' + lugar + '/' + hecho + '/' + start +  '/' + end)
      .map(res => res.json())
      .toPromise()
  }


}
