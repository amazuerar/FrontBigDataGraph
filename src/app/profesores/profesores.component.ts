import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BackService } from '../provider/back.service';



/**
 * Componente que represena la logica de lo que sucede al interior que controla la informacion de los colaboradores de la universidad de los andes
 * @export
 * @class ProfesoresComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.sass']
})
export class ProfesoresComponent implements OnInit {
  @Output() outEvent: EventEmitter<{ type: string, data: string | Array<any> }>;

  headerData: string[];
  isEditing: EventTarget;
  reverse: true;
  order: string;
  editedValue: string;
  filter: Object = {};
  profesores = [];
  noticias;
  data;

  /**
   * Crea una instancia del componente de servicio ProfesoresComponent.
   * @param {BackService} backservice 
   * @memberof ProfesoresComponent
   */
  constructor(private backservice: BackService) {
    this.outEvent = new EventEmitter<{ type: string, data: string | Array<any> }>();
   // this.data = TableData;
  }

  /**
   * Metodo que se ejecuta al inicializar el componente, inicializa algunos areglos base con la informacion traida con los servicios
   * @memberof ProfesoresComponent
   */
  ngOnInit() {

    this.backservice.getPersonasUniandes().then((prof) => {
      this.data = prof;
      this.headerData = this.getUniqueKeys(this.data);
      this.order = this.headerData[0];
      this.outEvent.emit({ type: 'init', data: 'none' });
    });

     this.backservice.getNoticiasUniandes().then((not) => {
      this.noticias = not;
    });
  }

  /**
   * Obtiene los identificadores unicos del arreglo obtenido como parametros
   * @param {*} obj arreglo que contienen los objetos traidos desde la base de datos
   * @returns {string[]} arreglo que contiene los identificadores
   * @memberof ProfesoresComponent
   */
  getUniqueKeys(obj: any): string[] {
    return obj.reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (acc.indexOf(key) === -1) {
          acc.push(key);
        }
      });
      return acc;
    }, []);
  }

  /**
   * Captura eventos e informa por consola
   * @param {Event} value 
   * @memberof ProfesoresComponent
   */
  tableEvents(value: Event): void {
    if (value) {
      console.log(value);
    }
  }

  /**
   * Metodo que se encarga de gestionar los eventos de edicion en la tabla
   * @param {MouseEvent} e el evento generado
   * @param {*} obj el objeto a ser manipulado
   * @param {string} property la propiedad con la cual se trabaja
   * @memberof ProfesoresComponent
   */
  editValue(e: MouseEvent, obj: any, property: string): void {
    if (!this.isEditing || this.isEditing === e.target) {
      if (this.isEditing && this.editedValue !== e.target['value']) {
        obj[property] = this.isEditing['value'];
        this.outEvent.emit({ type: 'valueChanged', data: obj });
      }
      e.target['disabled'] = !e.target['disabled'];
      this.editedValue = !e.target['disabled'] ? e.target['value'] : undefined;
      this.isEditing = !e.target['disabled'] ? e.target : undefined;
    }
  }

  /**
   * Eliminar el filtro dado a la columna
   * @param {*} item 
   * @memberof ProfesoresComponent
   */
  deleteFilter(item: any): void {
    delete this.filter[item];
  }

}
