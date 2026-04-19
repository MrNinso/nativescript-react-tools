import { useMemo } from 'react';
import { RNSStyle } from 'react-nativescript';

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ThemeConfig = Record<string, any>;
export type Variants = Record<string, Record<string, RNSStyle>>;
export type VariantsConfig<V extends Variants> = { base: RNSStyle; configs: V };
export type VariantsBuilderCallBack<T extends ThemeConfig, V extends Variants> = (theme: T) => VariantsConfig<V>;

export type GetPropsVariants<T extends VariantsImpl<any, any>> = T extends VariantsImpl<any, infer V extends Variants> ? GetPropsFromVariants<V> : never;

export type GetPropsFromVariants<V extends Variants> = {
  -readonly [K in keyof V]: keyof V[K];
} & { cstyle?: RNSStyle };

export type VariantComponentProps<T extends VariantsImpl<any, any>, TIntrinsic extends keyof JSX.IntrinsicElements> = Prettify<GetPropsVariants<T>> & Omit<JSX.IntrinsicElements[TIntrinsic], 'style'>;

export class VariantsFactory<const T extends ThemeConfig> {
  constructor(public readonly themeConfig: T) {}

  public variants<const V extends Variants>(builder: VariantsBuilderCallBack<T, V>): VariantsImpl<T, V> {
    return new VariantsImpl(builder, this.themeConfig);
  }
}

export class VariantsImpl<const T extends ThemeConfig, const V extends Variants> {
  constructor(
    public readonly builder: VariantsBuilderCallBack<T, V>,
    public readonly themeConfig: T,
  ) {}

  public useVariants(props: GetPropsFromVariants<V>) {
    const result = useMemo(() => this.builder(this.themeConfig), [this.themeConfig]);

    const base = result.base;
    const variants = result.configs;

    return useMemo<RNSStyle>(() => {
      const result: RNSStyle = { ...base };

      for (const variantKey in variants) {
        const variantValue = props[variantKey];
        if (!variantValue) continue;

        const variantGroup = variants[variantKey];
        if (!variantGroup) continue;

        const variantStyle = variantGroup[String(variantValue)];
        if (!variantStyle) continue;

        Object.assign(result, variantStyle);
      }

      if (props.cstyle) {
        Object.assign(result, props.cstyle);
      }

      return result;
    }, [
      ...Object.keys(variants)
        .sort()
        .map((k) => props[k]),
      JSON.stringify(props.stylesCustom ?? {}),
    ]);
  }
}
