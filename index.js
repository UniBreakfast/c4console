
{
  let lastTime
  const {log} = console,
    getTime =()=> new Date().toLocaleTimeString('en', {hour12: false}),
    def =(obj, prop, value)=> Object.defineProperty(obj, prop,
      {value, enumerable: false, editable: true, configurable: true})

  global.c =(...args)=>
    log(...args) || args.length>1? args : args[0]

  def(Object.prototype, 'c', function(label) {
    const time = getTime(),  val = this.valueOf()
    log(...time == lastTime? [] : [lastTime = time],
      ...typeof label=='string'? [label+':'] : typeof label=='number'?
        [label+'.'] : [], val)
    return val
  })

  def(Promise.prototype, 'c', function(label) {
    let onresolve = _ => _,  onreject = _ => _
    const time = getTime(),  start = new Date,
      report =(res, status)=> {
        log(...time == lastTime? [] : [lastTime = time],
          ...typeof label=='string'? [label+':'] : typeof label=='number'?
            [label+'.'] : [], `${status} in ${new Date()-start}ms`, res)
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
  })
}

setTimeout(c, 1e9)