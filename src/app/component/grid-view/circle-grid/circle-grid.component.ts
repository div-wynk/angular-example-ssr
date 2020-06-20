import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-circle-grid',
  templateUrl: "circle-grid.component.html",
  styleUrls: ["circle-grid.component.scss"]
})
export class CircleGridComponent implements OnInit {

  inputData: any;
  @Input('inputData')
  set _inputData(inputData:any){
    this.inputData = inputData;
    this.castList = this.inputData.items;
    this.updateCompWithView();
  }
  @Output() circleGridClickedEvent = new EventEmitter;
  public castList: any = [];

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.updateCompWithView();
  }

  updateCompWithView(){
    this.inputData && this.inputData.items.length > 5 ? this.inputData.items = this.inputData.items.slice(0, 5) : '';
  }

  circleGridClicked(data) {
    this.circleGridClickedEvent.emit();
    this.commonService.navigateToRoute(data);
  }

  showMore() {
    let el = document.getElementById('showMoreBtn');
    el.style.display = 'none';
    this.inputData.items = this.castList;
  }

  slideLeftRight(ev, id) {
    this.commonService.slideLeftRight(ev, id);
  }

}
