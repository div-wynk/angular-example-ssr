import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning-popup',
  templateUrl: 'warning-popup.component.html',
  styleUrls: ['warning-popup.component.css']
})
export class WarningPopupComponent implements OnInit {

  @Input() message: string;
  @Input() heading: string;
  @Input() leftBtn: string;
  @Input() rightBtn: string;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
  }

}
