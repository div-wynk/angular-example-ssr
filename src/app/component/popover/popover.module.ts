import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
// import { PlaySongModule } from '../../directives/player/play-song.module';
// import { PlayNextModule } from '../../directives/play-next/play-next.module';
// import { NonStopMixModule } from '../../directives/non-stop-mix/non-stop-mix.module';
import { PopoverComponent } from './popover.component';
import { PipeModule } from '../../pipes/pipe.module';
// import { AddToQueueModule } from '../../directives/add-to-queue/add-to-queue.module';


@NgModule({
    imports: [CommonModule, RouterModule,PipeModule],
    exports: [PopoverComponent],
    declarations: [PopoverComponent],
    providers: [],
})
export class PopoverModule { }
