import { Pipe, Injectable, PipeTransform } from '@angular/core';

/**
 * Pipe que permite filtrar
 * @export
 * @class FilterPipe
 * @implements {PipeTransform}
 */

@Pipe({
  name: 'filterBy',
  pure: false
})


export class FilterPipe implements PipeTransform {
  transform(array: any[], filter: any): any {
    return array && Object.keys(filter).length !== 0 ? array.filter(this.resolveType(filter)) : array;
  }

  /**
   * Pipe para filtrar dependiendo de una categoria
   * @private
   * @param {*} filter la categoria
   * @returns {*} arreglo filtrado
   * @memberof FilterPipe
   */
  private resolveType(filter: any): any {
    switch (typeof filter) {
        case 'boolean': return value => Boolean(value) === filter;
        case 'string': return value => !filter || (value ? ('' + value).toLowerCase().indexOf(filter.toLowerCase()) !== -1 : false);
        case 'object': return value => {
          for (let key in filter) {
            if (filter.hasOwnProperty(key)) {
              if (!value.hasOwnProperty(key) && filter[key] === null) {
                return true;
              };
              if (!value.hasOwnProperty(key) && !Object.getOwnPropertyDescriptor(Object.getPrototypeOf(value), key) ||
                  !this.resolveType(filter[key])(typeof value[key] === 'function' ? value() : value[key])) {
                    return false;
              }
            }
          }
          return true;
        };
        default: return value => !filter || filter === value;
      }
  }
}

/**
 * Pipe que permite ordenar
 * @export
 * @class OrderPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'orderBy'
})

export class OrderPipe implements PipeTransform {
  transform(value: any[], expression: any, reverse?: boolean): any {
    return reverse && value ? this.sortObject(value, expression).reverse() : this.sortObject(value, expression);
  }

  /**
   * @private Metodo para ordenado un arreglo
   * @param {any[]} v arreglo de elementos a ser ordenados
   * @param {*} e 
   * @returns {*} arreglo ordenado
   * @memberof OrderPipe
   */
  private sortObject(v: any[], e: any): any {
    return v.sort((a: any, b: any): number => b[e] && a[e] ? a[e] > b[e] ? 1 : -1 : !b[e] && a[e] || !a[e] && !b[e] ? -1 : 1);
  }
}