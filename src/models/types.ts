export type ValueOf<T> = T[keyof T];

//  eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

//  eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Obj<V = any> = { [attr: string]: V };

//  eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjsByKey<V = any> = { [key: string]: Obj<V> };

export type PartialValues<M> = Partial<M & Obj>;

export type SelectOption<D extends Obj = Obj> = {
  label: any;
  value: string | number;
  data?: D;
};

export type ExportOption = {
  label: string;
  value: string | string[];
};

export type GeneralInputEvent<V = Any> = {
  target: {
    value: V;
  };
};

export type ID = string | number;
