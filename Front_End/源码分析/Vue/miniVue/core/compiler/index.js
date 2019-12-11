/*const { render, staticRenderFns } =  compileToFunctions(template, {
	shouldDecodeNewlines,
	shouldDecodeNewlinesForHref,
	delimiters: options.delimiters,
	comments: options.comments
}, this)
options.render = render
options.staticRenderFns = staticRenderFns*/

// import baseOptions from './options/index.js'
import { createCompileToFunctionFn } from './to-function.js'
import { parse } from './parser/index.js'
import { generate } from './codegen/index.js'

function baseCompile(
	template,
	options
) {
	const ast = parse(template.trim(), options)
	if (options.optimize !== false) {
		// optimize(ast, options) // 对AST做进一步优化,这里我们就略过了
	}
	console.log('ast', ast)
	const code = generate(ast, options)
	console.log('code', code)
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
