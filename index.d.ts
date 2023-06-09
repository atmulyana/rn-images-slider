/**
 * rn-images-slider
 * https://github.com/atmulyana/rn-images-slider
 *
 * @format
 */
import * as React from 'react';
import type {ColorValue} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {ImageStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type {ImageURISource} from 'react-native/Libraries/Image/ImageSource';

export type ImageSource = number | string | ImageURISource | null | undefined;

export interface PagingProp {
    color?: ColorValue,
    count: number,
    setIndex: (index: number) => void,
    selectedIndex: number,
}

export interface PagingPosProp extends PagingProp {
    outside?: boolean,
}

export type ImageSliderProp = {
    onChange?: (index: number) => any,
    paging?: typeof React.Component<PagingProp>,
    pagingColor?: ColorValue,
    srcSet?: ImageSource | Array<ImageSource>,
    style?: ImageStyle,
};

export default class ImageSlider extends React.Component<ImageSliderProp> {}
export class DotPaging extends React.Component<PagingPosProp> {}
export class NumberPaging extends React.Component<PagingPosProp> {}
export class ArrowPaging extends React.Component<PagingProp> {}