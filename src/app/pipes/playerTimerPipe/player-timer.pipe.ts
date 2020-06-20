import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'secondminutes'})
export class SecondToMinutes implements PipeTransform {
  transform(value): string {
    const minutes: number = Math.floor(value / 60);
    const seconds=(value - minutes * 60);
    let tempSeconds;
    if(!isNaN(minutes) && !isNaN(seconds)){
      if(Number(seconds.toFixed(0))<=9){
        tempSeconds="0"+seconds.toFixed(0);
      }
      else{
        tempSeconds=seconds.toFixed(0);
      }
      return  minutes+ ':' + tempSeconds;
    }
    else {
      return "00:00";
    }
    
  }
}