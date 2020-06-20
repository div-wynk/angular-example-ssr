import { Component, Input } from '@angular/core';
import { Constants } from '../../../../constant/constants';


@Component({
  selector: 'app-filter-list',
  templateUrl: 'filter-list.component.html',
  styleUrls: ['filter-list.component.scss']
})

export class FilterListComponent  {
  
    @Input() customType: any = null;
    @Input() currentLanguage: any = null;
    
    public isCollapsed:boolean =true;
    public languageMap: any = null;
    public languageMapKeyArray: any = null;
    public langTypeMap : any = {
      "ALBUMS":'album_package_id',
      "SONGS":'song_package_id',
      "PLAYLISTS":'playlist_package_id'
    }
  
    constructor(
    ) { 
      this.languageMap = {...Constants.LANGUGE_PAGES_MAP};
      this.filterData();
    }
    
    toggleMenu() {
      this.isCollapsed = !this.isCollapsed;
      this.filterData();
    }
  
    filterData() {      
      if(this.languageMap)  {
        delete this.languageMap['all_language'];                     
        this.languageMapKeyArray = Object.keys(this.languageMap);
      }
  
    }
  
    ngOnDestroy() {
    }
  }
  