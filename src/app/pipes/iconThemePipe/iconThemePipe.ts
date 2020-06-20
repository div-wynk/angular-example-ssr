import { Pipe, PipeTransform } from "@angular/core";
import { Constants } from "../../constant/constants";
import { CommonService } from "../../shared/services/common.service";

@Pipe({ name: "iconTheme" })

export class IconThemePipe implements PipeTransform {
    constructor() {}
    transform(value: string, theme:string ): string {  
        if(theme && value) return Constants.ICON_SRC[theme][value]
    }
  }