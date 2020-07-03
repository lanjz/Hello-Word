/*const { render, staticRenderFns } =  compileToFunctions(template, {
	shouldDecodeNewlines,
	shouldDecodeNewlinesForHref,
	delimiters: options.delimiters,
	comments: options.comments
}, this)
options.render = render
options.staticRenderFns = staticRenderFns*/

// src/compiler/index.js
import { createCompileToFunctionFn } from './to-function.js'
import { parse } from './parser'
import { generate } from './codegen'

function baseCompile(
	template,
	options
) {
	const ast = parse(template.trim(), options)
	console.log('ast', ast)
	const code = generate(ast, options)
	console.log('render字符串', code)
	return {
		ast,
		render: code.render,
		staticRenderFns: code.staticRenderFns
	}
}

function compile(template, options) {
	const compiled = baseCompile(template.trim(), options)
	return compiled
}

const compileToFunctions = createCompileToFunctionFn(compile)

export { compile, compileToFunctions }
