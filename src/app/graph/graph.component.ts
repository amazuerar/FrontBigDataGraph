import { Component, OnInit, Output, EventEmitter, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { BackService } from '../provider/back.service';
import { DaterangePickerComponent } from 'ng2-daterange-picker';

@Component({
  selector: 'app-graph',
  entryComponents: [DaterangePickerComponent],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnInit {

  @ViewChild('daterangePicker', { read: ViewContainerRef }) daterangePickerParentViewContainer: ViewContainerRef;

  constructor(private backservice: BackService, private componentFactory: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

   showDaterangePickerSelector() {
    let daterangePickerComponentFactory = this.componentFactory.resolveComponentFactory(DaterangePickerComponent);
    let daterangePickerComponent: DaterangePickerComponent = DaterangePickerComponent.initWithData(this.daterangePickerParentViewContainer, daterangePickerComponentFactory);

    daterangePickerComponent.onSelectedDaterange.subscribe(
          data => {
                    this.showSelectedDaterange(data.startDate, data.endDate);
          }
    );
  }

  showSelectedDaterange(startDate: Date, endDate: Date) {
    alert('FROM: ' + startDate.toString());
    alert('TO: ' + endDate.toString());
  }


}
