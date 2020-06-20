import { IconThemePipe } from './iconThemePipe/iconThemePipe';
import { NgModule } from '@angular/core';

import { ImagePipe } from './imagePipe/image.pipe';
import { ReplaceWhiteSpace } from './replaceWhitespacePipe/replace-whitespace.pipe';
import { ReplaceCpIds } from './replaceCpIdsPipe/replace-cp-ids.pipe';
import { SecondToMinutes } from './playerTimerPipe/player-timer.pipe';

@NgModule({
    imports: [],
    exports: [ImagePipe, ReplaceWhiteSpace, ReplaceCpIds,SecondToMinutes,IconThemePipe],
    declarations: [ImagePipe, ReplaceWhiteSpace, ReplaceCpIds,SecondToMinutes,IconThemePipe],
    providers: [],
})
export class PipeModule { }
