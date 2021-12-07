import {
  Pipe,
  PipeTransform,
  Directive,
  ElementRef,
  OnInit,
  Input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string) {
    console.log({ html });
    const bypass = this.sanitizer.bypassSecurityTrustHtml(html);
    console.log({ bypass });
    return bypass;
  }
}

function loadScript(src: string, target: HTMLElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.src = src;
    scriptElem.async = false;
    scriptElem.onerror = function (err) {
      reject(err);
    };

    scriptElem.onload = function () {
      console.log(src, 'onLoad');
      resolve();
    };
    target.appendChild(scriptElem);
  });
}

const loadScripts = (
  scripts: HTMLCollectionOf<HTMLScriptElement>,
  target: HTMLElement
): Promise<void[]> => {
  const scriptsPromises: Promise<void>[] = [];
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const scriptCopy: HTMLScriptElement = document.createElement('script');

    scriptCopy.type = script.type ? script.type : 'text/javascript';
    const src = script.getAttribute('src');
    if (script.innerHTML) {
      scriptCopy.innerHTML = script.innerHTML;
      scriptCopy.async = false;
      script.parentNode!.replaceChild(scriptCopy, script);
    } else if (src) {
      scriptsPromises.push(loadScript(src, target));
    }
  }

  return Promise.all(scriptsPromises);
};
@Directive({ selector: '[runScripts]' })
export class RunScriptsDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}
  @Input('runScripts') rawHtml = '';
  ngOnInit(): void {
    setTimeout(() => {
      // wait for DOM rendering
      this.reinsertScripts();
    });
  }
  async reinsertScripts(): Promise<void> {
    const parsed = new DOMParser().parseFromString(this.rawHtml, 'text/xml');
    const head: HTMLHeadElement = parsed.getElementsByTagName('head')[0];
    const headerScripts = head.getElementsByTagName('script');
    const body: HTMLBodyElement = parsed.getElementsByTagName('body')[0];
    const bodyScripts = body.getElementsByTagName('script');

    const startTime = +Date.now();
    console.info(`---- starting`);

    await loadScripts(headerScripts, document.head);
    console.info(
      `---- loaded headers scripts (${headerScripts.length}) in ${
        +Date.now() - startTime
      }ms`
    );
    await loadScripts(bodyScripts, this.elementRef.nativeElement);
    console.info(
      `---- loaded body scripts (${bodyScripts.length}) in ${
        +Date.now() - startTime
      }ms`
    );
  }
}
