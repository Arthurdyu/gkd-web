import { ElMessage } from "element-plus";

export type Dict = Record<number, string>;
export type Enum = Array<{
  label: Dict[number]; // 选项框显示的文字
  value: keyof Dict; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  tagType?: string; // 当 tag 为 true 时，此选择会指定 tag 显示类型
  children?: Enum; // 为树形选择时，可以通过 children 属性指定子选项
}>;

export class EnumFactory {
  private enum: Enum = [];

  constructor(private dict: Dict) {
    this.toEnum();
  }

  set(label: keyof typeof this.dict, { prop, value }: { prop: keyof Omit<Enum[number], "label" | "value">; value: any }) {
    const item = this.enum.find(item => item.value === label);
    try {
      if (!item) throw new Error("标签不存在");
      item[prop] = value;
    } catch (err: any) {
      ElMessage.error(err.message);
    } finally {
      return this;
    }
  }

  public toEnum(): Enum {
    if (this.enum.length) return this.enum;
    for (const [k, v] of Object.entries(this.dict)) this.enum.push({ label: v, value: Number(k) });
    return this.enum;
  }

  public static build(dict: Dict): EnumFactory {
    return new EnumFactory(dict);
  }
}
