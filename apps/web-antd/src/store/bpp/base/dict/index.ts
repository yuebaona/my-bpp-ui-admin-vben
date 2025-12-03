import { acceptHMRUpdate, defineStore } from 'pinia';

export interface DictItem {
  colorType?: string;
  cssClass?: string;
  label: string;
  value: string;
}

export type BppBaseDict = Record<string, DictItem[]>;

interface DictState {
  bppBaseDictDictCache: BppBaseDict;
}

export const bppBaseDictStore = defineStore('bpp-base-dict', {
  actions: {
    /**
     * 根据字典类型和值获取字典项
     */
    getBppBaseDictData(dictType: string, value: any) {
      const dict = this.bppBaseDictDictCache[dictType];
      if (!dict) {
        return undefined;
      }
      return (
        dict.find((d) => d.value === value || d.value === value.toString()) ??
        undefined
      );
    },
    /**
     * 获取字典选项列表
     */
    getBppBaseDictOptions(dictType: string) {
      const dictOptions = this.bppBaseDictDictCache[dictType];
      if (!dictOptions) {
        return [];
      }
      return dictOptions;
    },

    /**
     * 设置字典缓存
     */
    setBppBaseDictCache(dicts: BppBaseDict) {
      this.bppBaseDictDictCache = dicts;
    },

    /**
     * 通过API设置字典缓存
     */
    setBppBaseDictCacheByApi(
      api: (params: Record<string, any>) => Promise<Record<string, any>[]>,
      params: Record<string, any> = {},
      labelField: string = 'label',
      valueField: string = 'value',
    ) {
      return api(params).then((dicts) => {
        const dictCacheData: BppBaseDict = {};
        dicts.forEach((dict) => {
          dictCacheData[dict.dictType] = dicts
            .filter((d) => d.dictType === dict.dictType)
            .map((d) => ({
              colorType: d.colorType,
              cssClass: d.cssClass,
              label: d[labelField],
              value: d[valueField],
            }));
        });
        this.setBppBaseDictCache(dictCacheData);
        return dictCacheData;
      });
    },
    setBppBaseDictCacheByData(
      dicts: Record<string, any>[],
      labelField: string = 'label',
      valueField: string = 'value',
    ) {
      const dictCacheData: BppBaseDict = { ...this.bppBaseDictDictCache };

      // 按 dictType 分组
      const dictTypeGroups = dicts.reduce((groups, dict) => {
        if (!dict.dictType) return groups;

        if (!groups.has(dict.dictType)) {
          groups.set(dict.dictType, []);
        }
        groups.get(dict.dictType)!.push(dict);
        return groups;
      }, new Map<string, any[]>());

      // 处理每个字典类型
      dictTypeGroups.forEach((items, dictType) => {
        const existingItems = dictCacheData[dictType] || [];

        // 将现有项转换为 Map（按 value 索引）
        const itemMap = new Map(existingItems.map(item => [item.value, item]));

        // 更新或添加新项
        items.forEach(item => {
          const value = item[valueField] || item.dictValue || item.value || '';
          if (value) {
            itemMap.set(value, {
              colorType: item.colorType,
              cssClass: item.cssClass,
              label: item[labelField] || item.dictLabel || item.label || '',
              value: value,
            });
          }
        });

        dictCacheData[dictType] = Array.from(itemMap.values());
      });

      this.setBppBaseDictCache(dictCacheData);
    },
    /**
     * 清除所有缓存
     */
    clearCache() {
      this.bppBaseDictDictCache = {};
    },
  },
  persist: {
    // 持久化
    pick: ['bppBaseDictDictCache'],
  },
  state: (): DictState => ({
    bppBaseDictDictCache: {},
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(bppBaseDictStore, hot));
}
