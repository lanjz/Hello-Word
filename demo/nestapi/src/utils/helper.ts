import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
	tableName(targetName: string, userSpecifiedName: string): string {
		return userSpecifiedName ? userSpecifiedName : this.snakeCase(targetName);
	}

	columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
		return this.snakeCase(embeddedPrefixes.concat(customName || propertyName).join('_'));
	}

	private snakeCase(name: string): string {
		return name.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
	}

	// 你还可以重写其他方法以自定义其他命名部分
}
