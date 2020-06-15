// ==UserScript==
// @name        c4console
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @run-at      document-start
// @grant       none
// @version     3.0.5
// @author      Tut 'UniBreakfast' Ninin
// @description 15.06.2020, 06:31:18
// ==/UserScript==

{
  let lastTime

  const getTime =()=> new Date().toLocaleTimeString('en', {hour12: false}),

    img =(src, size=0.4, label=' ')=> {
      if (src.match(/^data:image\/.*;base64,/))
        return assign(new Image(), {src, onload() {
          log(`%c${label}`,`background: no-repeat url(${src});
            padding:0 ${this.width*size}px ${this.height*size}px 4px;
              background-size:contain`)
        }})
      fetch(src).then(r => r.blob()).then(blob => assign(new FileReader(),
        {onload() { img(this.result, size) }}).readAsDataURL(blob))
    },

    ls = localStorage,  {defineProperty, assign} = Object,  {log, dir} = console,
    objProto = Object.prototype,  promProto = Promise.prototype,   win = window,
    def =(obj, prop, value)=> defineProperty(obj, prop,
      {value, enumerable: false, editable: true, configurable: true})

  c4 = win.c4console = {
    cGlobalFn: (...args)=> (args.length==1 && (args[0] instanceof Element ||
      args[0]==document)? dir : log)(...args) || args.length>1? args : args[0],

    cGenericMethod(label) {
      const time = getTime(),  val = this.valueOf(),
        isDOMel = val instanceof Element || val==document
      log(...time == lastTime? [] : [lastTime = time],
        ...typeof label=='string'? [label+':'] : typeof label=='number'?
          [label+'.'] : [], ...isDOMel? [] : [val])
      if (isDOMel) dir(val)
      return val
    },

    cPromiseMethod(label) {
      let onresolve = _ => _,  onreject = _ => _
      const time = getTime(),  start = new Date,  body = 'response body',
        report =(res, status)=> {
          log(...time == lastTime? [] : [lastTime = time],
            ...typeof label=='string'? [label+':'] : typeof label=='number'?
              [label+'.'] : [], `${status} in ${new Date()-start}ms`, res)
          if (res instanceof Response && res.status==200) {
            if ((res.headers.get('content-type')||'').startsWith('image/'))
              res.clone().blob().then(blob => assign(new FileReader(),
                {onload() { img(this.result, 0.4, body) }})
                  .readAsDataURL(blob))
            else res.clone().text().then(text =>
              { try { JSON.parse(text).c(body) } catch { text.c(body) } })
          }
        },
        resolve = val => report(val, 'resolved') || onresolve(val),
        reject = err => report(err, 'rejected') || onreject(err),
        prom = this.then(resolve, reject)
      this.then =(cb1, cb2)=> {
        if (cb1) onresolve = cb1
        if (cb2) onreject = cb2
        return prom
      }
      this.catch = prom.catch = cb => (onreject = cb) && prom
      return this
    },

    on() {
      console.img = this.img
      win.c = this.cGlobalFn
      def(objProto, 'c', this.cGenericMethod)
      def(promProto, 'c', this.cPromiseMethod)
      if (this.status().includes('OFF'))
        this.off(), log('sorry, unable to turn ON')
    },

    off() {
      if (console.img==this.img) delete console.img
      if (win.c==this.cGlobalFn) delete win.c
      if (objProto.c==this.cGenericMethod) delete objProto.c
      if (promProto.c==this.cPromiseMethod) delete promProto.c
    },

    status() {
      return (win.c==this.cGlobalFn && objProto.c==this.cGenericMethod
        && promProto.c==this.cPromiseMethod? 'ON':'OFF') + ' / ' +
          (ls.c4=='enabled'? 'enabled' : 'disabled')
    },

    enable() { ls.c4 = 'enabled'; c4.on() },
    disable() { ls.c4 = 'disabled'; c4.off() },

    img,  getTime,  get lastTime() { return lastTime },

    greet() {
      log(`Hi. c4console is now ${ this.status() } and c4console.help() is there for you`)
    },

    help() {
      log(`c4console is now ${ this.status() }

c4console provides following methods:

  .help() - shows the text you are reading;
  .on() - turns ON c4console functionality (see below) for this page just until reload;
  .off() - turns OFF ... the same as previous;
  .enable() - enables c4console functionality for this page until disabled;
  .disable() - disables ... the same until enabled

it isn't enabled by default because many big sites won't load if they see that standard prototypes were modified before they themselves did that same thing (like Facebook, YouTube or Google). So you can turn c4console ON on those too BUT don't enable it for them by default or do not forget how to disable it.

c4console functionality includes:

  c(...args) - global function like console.log but it also returns the stuff it outputs;
  any_variable_or_value.c(?label) - method available on (almost) any value that allows you to output that value to the console and that call is "transparent" for the chaining methdods - it returns the thing if was called from, so you can insert it in the middle of any expression without breaking anything;
  any_promise.c(?label) - method available on any promise that also outputs to the console the final status of the promise, time it took and its value, and, if it was a fetch response, it outputs the response body below - as text, json-parsed object/array or image;
  console.img(src, ?size, ?label) - function to show images in console, prefers Base64 strings as a source but can also fetch images implicitly if url provided instead
`
      )
    }
  }

  if (ls.c4=='enabled') c4.on()
  c4.greet()
}
