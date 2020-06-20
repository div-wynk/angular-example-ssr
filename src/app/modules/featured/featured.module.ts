import { NgModule } from '@angular/core';

import { FeaturedComponent } from './featured.component';
import { BannerComponent } from '../../component/banner/banner.component';
import { PipeModule } from '../../pipes/pipe.module';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ImageLazyLoadModule } from '../../directives/image-lazy-load/image-lazy-load.module';
// import { PlaySongModule } from '../../directives/player/play-song.module';
import { AppsflyerModule } from '../../component/apps-flyer/apps-flyer.module';
import { SingleHorizontalRailModule } from '../../component/rail/single-horizontal-rail/single-horizontal-rail.module';
import { SingleHorizontalGridModule } from '../../component/grid-view/single-horizontal-grid/single-horizontal-grid.module';
// import { HomeShimmeringModule } from '../../component/shimmering/home-shimmering/home-shimmering.module';
import { LazyLoadComponentModule } from '../../directives/lazy-load-component/lazy-load-component.module';
// import { DfpModule } from '../dfp/dfp.module';

const routes: Routes = [
    {
        path: '',
        component: FeaturedComponent
    }]
@NgModule({
    imports: [
        ImageLazyLoadModule,
        PipeModule,
        CommonModule,
        RouterModule.forChild(routes),
        // PlaySongModule,
        AppsflyerModule,
        SingleHorizontalRailModule,
        SingleHorizontalGridModule,
        // HomeShimmeringModule,
        LazyLoadComponentModule
        // DfpModule.forChild()
    ],
    exports: [FeaturedComponent,BannerComponent],
    declarations: [FeaturedComponent, BannerComponent],
    providers: [],
})
export class FeaturedModule {
    ngOnInit(){
        console.log("featured module");
    }
}
