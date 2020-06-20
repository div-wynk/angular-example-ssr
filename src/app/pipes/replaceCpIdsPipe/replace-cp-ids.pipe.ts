import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../../constant/constants';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
@Pipe({name: 'replaceCpIds'})
export class ReplaceCpIds implements PipeTransform {
  constructor(private _localStorageWrapperService: LocalStorageWrapperService){}

  transform(value: string, args: string): string {
    const config = JSON.parse(this._localStorageWrapperService.getItem('config'));
    const cpmapping = config != null && config.cpmapping ? config.cpmapping : Constants.STATIC_CPMAPPING;
    let ids=[];
    if((value.includes(",") && (value.split(",").length) > 1 && value.split("_") && (value.split(",")[0].split("_").length) == 4)){
      return this.replaceMoodsCpIds(value, cpmapping);
    }
    if(value.includes(",")){
        ids=value.split(",");
    }
    if((value.split('_').length) >= 4 && !value.includes(",")){
       const tempData = value.split('_');
       return value.replace(tempData[0]+'_'+tempData[1], cpmapping[tempData[0]+'_'+tempData[1]]);
    }
    if(ids.length>1){
      ids.forEach((ele,index)=>{
        const defaultId = ele.substring(0, ele.lastIndexOf('_'));
        ids[index]=ele.replace(defaultId,cpmapping[defaultId]);
      })
      return ids.toString();
    }
    else{
      const defaultId = value.substring(0, value.lastIndexOf('_'));
      if(cpmapping[defaultId]){
        return value.replace(defaultId, cpmapping[defaultId]);
      }
      return value;
      
    }
  }

  replaceMoodsCpIds(value, cpmapping){
    let ids=[];
    if(value.includes(",")){
      ids=value.split(",");
    }
    let tmpIds = [];
    ids.forEach(id => {
      const lng = id.substring(id.lastIndexOf('_'));
      let valu = id.substring(0, id.lastIndexOf('_'));
      const defaultId = valu.substring(0, valu.lastIndexOf('_'));
      valu = valu.replace(defaultId, cpmapping[defaultId]);
      tmpIds.push(valu+lng);
    })
    return tmpIds.toString();
  }
}