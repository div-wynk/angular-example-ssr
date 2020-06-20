import { Component, ApplicationRef, ViewChild, ElementRef, Input } from '@angular/core';
import { ToastrService, ToastPackage, ToastNoAnimation } from 'ngx-toastr';

@Component({
  selector: 'app-toastr',
  templateUrl: 'toastr.component.html',
  styleUrls: ['toastr.component.scss']
})

export class ToastrComponent extends ToastNoAnimation {
  
  @ViewChild('messageRef', {static:false}) messageRef: ElementRef;
  @Input() thumbnail: string;
  
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    protected appRef: ApplicationRef
  ) {
    super(toastrService, toastPackage, appRef);
  }

  action(event: Event) {
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }

}