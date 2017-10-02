import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 * Servicio en cargado de consumir un REST API
 * @export
 * @class RssService
 */
@Injectable()
export class RssService {

  address = "172.24.100.104";
  port = "8080";
  
  /**
   * Crea una instancia del componente servicio RssService.
   * @param {Http} http paquete de angular necesario para hacer peticiones http
   * @memberof RssService
   */
  constructor(private http: Http) { }


  /**
   * Servicio que trae desde el servidor los RSS de la fuente Wired
   * @returns arreglo traducido a JSON con los RSS de la fuente Wired 
   * @memberof RssService
   */
  getRssWired() {
    return this.http.get('http://'+this.address+':'+this.port+'/RSS_WIRED')
      .map(res => res.json().rss.channel.item)
      .toPromise()
  }

  /**
   * Servicio que trae desde el servidor los RSS de la fuente lifehacker
   * @returns arreglo traducido a JSON con los RSS de la fuente lifehacker 
   * @memberof RssService
   */
  getRssLf() {
    return this.http.get('http://'+this.address+':'+this.port+'/RSS_LIFEH')
      .map(res => res.json().rss.channel.item)
      .toPromise()
  }

  /**
   * Servicio que trae desde el servidor los RSS de la fuente Wied
   * @returns arreglo traducido a JSON con los RSS de la fuente Wired 
   * @memberof RssService
   */
  getRssBbc() {
    return this.http.get('http://'+this.address+':'+this.port+'/RSS_BBC')
      .map(res => res.json().rss.channel.item)
      .toPromise()
  }

  /**
   * Servicio para solicitar al servidor que realice el filtrado por Xquery(Element tree) y regrese el resultado, el cual se traduce en un jSON (Fuente wired)
   * @param {*} title parametro en el titulo que quiere ser encontrado
   * @param {*} description parametro en la descripcion que quiere ser encontrado
   * @param {*} category parametros en la categoria que quiere ser encontrado
   * @returns retorna un arreglo de objetos filtrados que coinciden con los parametros de busqueda
   * @memberof RssService
   */
  getRssWiredXQFilter(title:any, description:any, category:any) {
    return this.http.get('http://'+this.address+':'+this.port+'/RSS_WIRED_XQ/'+title+"/"+description+"/"+category)
      .map(res => res.json().rss.channel.item)
      .toPromise()
  }

  /**
   * Servicio para solicitar al servidor que realice el filtrado por Xquery(Element tree) y regrese el resultado, el cual se traduce en un jSON (Fuente Lifehacker)
   * @param {*} title parametro en el titulo que quiere ser encontrado
   * @param {*} description parametro en la descripcion que quiere ser encontrado
   * @param {*} category parametros en la categoria que quiere ser encontrado
   * @returns retorna un arreglo de objetos filtrados que coinciden con los parametros de busqueda
   * @memberof RssService
   */
  getRssLfXQFilter(title:any, description:any, category:any) {
    return this.http.get('http://'+this.address+':'+this.port+'/RSS_LIFEH_XQ/'+title+"/"+description+"/"+category)
      .map(res => res.json().rss.channel.item)
      .toPromise()
  }

  /**
   * Servicio para solicitar al servidor que realice el filtrado por Xquery(Element tree) y regrese el resultado, el cual se traduce en un jSON (Fuente BBC)
   * @param {*} title parametro en el titulo que quiere ser encontrado
   * @param {*} description parametro en la descripcion que quiere ser encontrado
   * @param {*} category parametros en la categoria que quiere ser encontrado
   * @returns retorna un arreglo de objetos filtrados que coinciden con los parametros de busqueda
   * @memberof RssService
   */
  getRssBbcXQFilter(title:any, description:any, category:any) {
    return this.http.get('http://'+this.address+':'+this.port+'/RSS_BBC_XQ/'+title+"/"+description+"/"+category)
      .map(res => res.json().rss.channel.item)
      .toPromise()
  }

  

}