import { ILike, Like } from 'typeorm';

export function isUN(value) {
  return value === undefined || value === null || value === '';
}
export function validateIf(object, value) {
  return !isUN(value);
}

async function getUserEntityFields(metadata): Promise<any> {
  const fields: object = {};
  metadata.columns.forEach((column) => {
    fields[column.propertyName] = column.type;
  });

  return fields;
}

export function findDataWhere(
  data,
  repository,
  options: Record<string, any> = {},
) {
  const { pageStart = 1, pageSize = 20 } = data;
  const where = {};
  const { isILike = {} } = options;
  const skitProperty = ['createdAt'];
  const entity = repository ? repository.metadata.propertiesMap : {};
  Object.keys(data).forEach((item) => {
    if (skitProperty.includes(item)) return;
    const itemValue = data[item];
    if (entity[item] && !isUN(itemValue)) {
      where[item] = isILike[item] ? ILike(`%${itemValue}%`) : itemValue;
    }
  });
  const result = {
    where,
    skip: (pageStart - 1) * pageSize,
    take: pageSize,
  };
  return result;
}
