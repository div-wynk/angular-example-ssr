import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'replaceWhiteSpace' })
export class ReplaceWhiteSpace implements PipeTransform {
  transform(value: string): string {
    value = value.trim().replace(/[`~!@#$%^&*()_–|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '').trim().replace(/ /g, "-").replace(/-+/g, '-');
    return value === "" ? "-" : value;
  }
}