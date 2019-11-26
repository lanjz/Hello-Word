function createCompilerCreator(baseCompile) {
	return function createCompiler(baseOptions) {
		function compile(tempile, options) {
			const finalOptions = Object.create(baseOptions)
			const errors = []
			const tips = []
			if(options) {
				// merge custom modules
				if (options.modules) {
					finalOptions.modules =
						(baseOptions.modules || []).concat(options.modules)
				}
				// merge custom directives
				if (options.directives) {
					finalOptions.directives = extend(
						Object.create(baseOptions.directives || null),
						options.directives
					)
				}
				// copy other options
				for (const key in options) {
					if (key !== 'modules' && key !== 'directives') {
						finalOptions[key] = options[key]
					}
				}
			}
			const compiled = baseCompile(template.trim(), finalOptions)
			return compiled
		}
		return {
			compile,
			compileToFunctions: createCompileToFunctionFn(compile)
		}
	}
}

const createCompiler =  createCompilerCreator(function baseCompile(
	template,
	options
) {
	const ast = parse(template.trim(), options)
	if (options.optimize !== false) {
		optimize(ast, options)
	}
	const code = generate(ast, options)
	return {
		ast,
		render: code.render,
		staticRenderFns: code.staticRenderFns
	}
})

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
