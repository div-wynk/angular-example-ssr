import { Injectable } from '@angular/core';

import { Constants } from '../../constant/constants';

export interface HTMLScriptElementLoadEvent { path: string; loaded: boolean; }

@Injectable({ providedIn: 'root' })
export class ScriptInjectorService {

  public inject(url: string, async: boolean): Promise<HTMLScriptElementLoadEvent> {
    const script = this.prepareScript(url, async);
    return new Promise((resolve, reject) => {
      script.onload = () =>
        resolve({
          path: document.location.protocol + url,
          loaded: true
        });
      script.onerror = () =>
        reject({
          path: document.location.protocol + url,
          loaded: false
        });
    });
  }

  private prepareScript(url: string, async: boolean): HTMLScriptElement {
    const script = this.buildScript(url, async);
    return this.loadScript(script);
  }

  private buildScript(url: string, async: boolean): HTMLScriptElement {
    const script = document.createElement('script');
    script.async = async;
    script.type = Constants.SCRIPT_TYPE;
    script.src = document.location.protocol + url;
    return script;
  }

  private loadScript(script): HTMLScriptElement {
    const head = document.head || document.querySelector('head');
    head.appendChild(script);
    return script;
  }
}
