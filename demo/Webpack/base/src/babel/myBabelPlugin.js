module.exports = (babel) => {
	return {
		visitor: {
			Identifier(path, state) {
				const node = path.node;
				console.log('node.name', node.name)
			}
		}
	}
};