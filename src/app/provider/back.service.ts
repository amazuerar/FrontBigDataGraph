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
  port = "8080";

  /**
   * Crea una instancia del componente servicio RssService.
   * @param {Http} http paquete de angular necesario para hacer peticiones http
   * @memberof BackService
   */
  constructor(private http: Http) { }

 

  /**
   * Obtiene las noticias extraidas de la pagina de la universidad de los andes por unidades administrativas o academicas
   * @returns arreglo de noticias 
   * @memberof BackService
   */
  getNoticiasUniandes() {
    return this.http.get('http://' + this.address + ':' + this.port + '/NOTICIAS')
      .map(res => res.json())
      .toPromise()
  }

   /**
    * Obtiene la informacion de los colaboradores de la universidad de los andes
    * @returns arreglo de colaboradores con su informacion, por ejemplo: nombre, correo, cargo, oficina. extension
    * @memberof BackService
    */
   getPersonasUniandes() {
    return this.http.get('http://' + this.address + ':' + this.port + '/PERSONAS')
      .map(res => res.json())
      .toPromise()
  }

}
