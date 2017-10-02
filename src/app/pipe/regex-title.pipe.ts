import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para aplicar una expresion regular, sirve para el titulo o la descripcion
 * @export
 * @class RegexTitlePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'regexTitle'
})
export class RegexTitlePipe implements PipeTransform {

  /**
   * Filtro para aplicar expresion regular en el titulo o la descripcion
   * @param {*} input el arreglo a ser filtrado
   * @param {*} field el campo en el cual se quiere realizar la busqueda
   * @param {*} regex la expresion regular que se quiere usar para filtrar elcontenido
   * @returns {*} retorna un arreglo con los elementos que cumplen la condicion de filtrado
   * @memberof RegexTitlePipe
   */
  transform(input: any, field: any, regex: any): any {

    let patt = new RegExp(regex);
    let out = [];
    for (let i = 0; i < input.length; i++) {
      if (patt.test(input[i][field].toLowerCase())) {
        out.push(input[i]);
      }
    }
    return out;
  }

}
