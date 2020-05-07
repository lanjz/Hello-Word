import { warn as baseWarn, noop, extend } from '../utils'
import parseModules from './parser/modules'
function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}

export function createCompileToFunctionFn (compile) {
  const cache = Object.create(null)
  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, {
    	modules: parseModules
	})
    const warn = baseWarn
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }

    // compile
    const compiled = compile(template, options)
    // turn code into functions
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })
	  
    return (cache[key] = res)
  }
}
