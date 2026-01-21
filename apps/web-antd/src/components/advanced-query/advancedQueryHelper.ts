import { bppBaseDictStore } from '#/store/bpp/base/dict';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { getTableColumnList} from '#/api/bpp/advanced/query';
const bppBaseDict = bppBaseDictStore();
export async function getFields(params: string[]) {
  // 调用表单数据
  const res = await getTableColumnList({
    tableNameList: params,
  });

  const transformedData = await Promise.all(
    res.map(async (item) => {
      // 定义类型映射
      const typeMap = {
        'datetime': 'date',
        'date': 'date',
        'input': 'string',
        'textarea': 'string',
        'select': 'select',
        'time': 'time',
      };

      const result = {
        fldName: `${item.tableName}.${item.columnName}`,
        fldLabel: item.columnComment,
        fldType: typeMap[item.htmlType] || item.htmlType, // 使用映射后的类型
        dictType: item.dictType,
        tableName: item.tableName,
        dataType: item.dataType,
        isNullable: item.isNullable,
        id: item.id,
      };

      // 如果是选择类型且有字典类型
      if (item.htmlType === 'select' && item.dictType) {
        try {
          bppBaseDict.setBppBaseDictCacheByData(
            (
              await getDictDataPage({
                dictType: item.dictType,
                pageNo: 1,
                pageSize: 100,
              })
            ).list,
            item.dictType,
          );
          result.options = bppBaseDict.getBppBaseDictOptions(item.dictType);
        } catch (error) {
          result.options = [];
        }
      }

      return result;
    })
  );
  return transformedData;
}
