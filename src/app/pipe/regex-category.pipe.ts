import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe que permite aplicar una expresion una expresion regular a un contenido
 * @export
 * @class RegexCategoryPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'regexCategory'
})
export class RegexCategoryPipe implements PipeTransform {

    /**
     * Pipe para aplicar expresion regular y filtrar dependiendo a esta
     * @param {*} input arreglo que tiene los objetos a ser filtrados por expresion regular
     * @param {*} field el campo del item que puee ser filtrado (title, category, description)
     * @param {*} regex la cadena que sera la expresion regular usada para filtrar
     * @returns {*} Un arreglo de elementos filtrados, arreglo vacio si no hay coincidencia
     * @memberof RegexCategoryPipe
     */
    transform(input: any, field: any, regex: any): any {

        let patt = new RegExp(regex);
        let out = [];
        for (let i = 0; i < input.length; i++) {
                if (patt.test(input[i][field]))
                    {
                        out.push(input[i]);
                    }
        }
        return out;
    }

}