/**
 * rn-images-slider
 * https://github.com/atmulyana/rn-images-slider
 *
 * @format
 * @flow strict-local
 */
import * as React from 'react';
import {isValidElementType} from "react-is";
import {Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import type {ColorValue, ImageStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {ImageURISource} from 'react-native/Libraries/Image/ImageSource';
import type {LayoutEvent, ScrollEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {extractImageStyle} from 'rn-style-props';

type ScrollViewRef = null | React.ElementRef<typeof ScrollView>;
export type ImageSource = number | string | ImageURISource;

export interface PagingProp {
    color?: ColorValue,
    count: number,
    setIndex: number => void,
    selectedIndex: number,
}

export interface PagingPosProp extends PagingProp {
    outside?: boolean,
}

export type PagingComponent = React.AbstractComponent<PagingProp>;
export type PagingPosComponent = React.AbstractComponent<PagingPosProp>;

export type ImageSliderProp = {
    baseSrc?: string,
    noImage?: React.MixedElement,
    onChange?: number => mixed,
    paging?: PagingComponent,
    pagingColor?: ColorValue,
    srcSet?: ?ImageSource | Array<?ImageSource>,
    style?: ImageStyleProp,
};

const MARGIN = 10,
      MAX_VISIBLE_PAGE_NUMBER = 5,
      MIDDLE_PAGE_DISTANCE = Math.floor(MAX_VISIBLE_PAGE_NUMBER / 2);

const styles = StyleSheet.create({
    fill: {
        alignSelf: 'stretch',
        flex: 1,
    },
    image: {
        resizeMode: 'contain',
    },
    images: {
        justifyContent: 'space-between',
    },
    noImage: {
        backgroundColor: '#aaa',
        opacity: 0.5,
        overflow: 'hidden',
    },
    noImageText: {
        ...StyleSheet.absoluteFill,
        color: 'black',
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    pagingArrow: {
        borderColor: 'white',
        height: 30,
        opacity: 0.5,
        top: -15,
        transform: [{rotate: '45deg'}],
        width: 30,
    },
    pagingArrowBox: {
        height: 15,
        position: 'absolute',
        top: '50%',
        width: 30,
    },
    pagingArrowBoxLeft: {
        left: 15,
    },
    pagingArrowBoxRight: {
        right: 15,
    },
    pagingArrowLeft: {
        borderBottomWidth: 5,
        borderLeftWidth: 5,
    },
    pagingArrowRight: {
        borderRightWidth: 5,
        borderTopWidth: 5,
    },
    pagingBottom: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    pagingBottomInside: {
        bottom: 0,
        height: 20,
        left: 0,
        position: 'absolute',
        right: 0,
    },
    pagingBottomOutside: {
        paddingVertical: 2,
    },
    pagingDot: {
        backgroundColor: 'black',
        borderRadius: 5,
        height: 10,
        marginHorizontal: 5,
        opacity: 0.25,
        width: 10,
    },
    pagingDotSelected: {
        opacity: 0.5,
    },
    pagingNumber: {
        color: 'blue',
        fontSize: 14,
        textAlign: 'center',
        width: 24,
    },
    pagingNumberSelected: {
        fontSize: 15,
        fontWeight: '900',
        textDecorationLine: 'underline',
    },
});

const ImageSlider: React.AbstractComponent<ImageSliderProp> = React.memo(function ImageSlider(
    {baseSrc, noImage, onChange, paging = DotPaging, pagingColor, srcSet, style}
) {
    let _baseSrc = (baseSrc || '').trim(); //removes trailing slash(es) form `baseSrc`

    let _srcSet: Array<?ImageSource>;
    if (['string', 'number', 'object'].includes(typeof(srcSet)) && !Array.isArray(srcSet)) _srcSet = [srcSet]; //null, number, URI, source object
    else if (!Array.isArray(srcSet) || srcSet.length < 1) _srcSet = [null]; //undefined and empty array
    else _srcSet = srcSet; //array
    
    const imageCount = _srcSet.length,
        scrollRef = React.useRef<ScrollViewRef>(null),
        [imageSize, setImageSize] = React.useState({width: 0, height: 0}),
        [selectedIndex, setSelectedIndex] = React.useState(0),
        pageWidth = imageSize.width + MARGIN,
        onLayout: LayoutEvent => mixed = React.useCallback(
            ({nativeEvent: {layout: {width, height}}}) => setImageSize({width, height}),
            []
        ),
        onScroll: ScrollEvent => void = React.useCallback(
            ({nativeEvent: {contentOffset: {x}}}) => {
                setSelectedIndex( Math.round(x / pageWidth) );
            },
            [pageWidth]
        ),
        scrollTo = (idx: number) => scrollRef.current?.scrollTo({
            x: idx * pageWidth,
            y: 0,
            animated: true,
        }),
        setIndex = React.useCallback(
            (idx: number) => {
                let _idx = parseInt(idx) || 0; //runtime check
                if (_idx < 0) _idx = 0;
                else if (_idx >= imageCount) _idx = imageCount - 1;
                setSelectedIndex(_idx);
            },
            [imageCount]
        ),
        _style = extractImageStyle(style),
        imageStyle = [styles.image, _style.image, imageSize],
        noImageStyle = [styles.noImage, imageSize];
    
    React.useEffect(() => {
        scrollTo(selectedIndex);
        if (typeof(onChange) == 'function') onChange(selectedIndex);
    }, [selectedIndex]);
    React.useEffect(() => {
        scrollTo(selectedIndex);
    }, [pageWidth]);
    
    const noImageText = <Text style={styles.noImageText}>NO IMAGE</Text>;
    
    let pagingElement: React.Node = null;
    if (imageCount > 1 && isValidElementType(paging)) {
        const Paging = paging;
        pagingElement = <Paging
            color={pagingColor}
            count={imageCount}
            setIndex={setIndex}
            selectedIndex={selectedIndex}
        />;
    }
    
    return <View style={_style.view}> 
        <View style={styles.fill}>
            <ScrollView
                bounces={false}
                contentContainerStyle={[styles.images, {width: imageCount * pageWidth - MARGIN}]}
                contentOffset={{x: selectedIndex * pageWidth, y: 0}}
                decelerationRate="normal"
                disableIntervalMomentum={true}
                horizontal
                onLayout={onLayout}
                onMomentumScrollEnd={onScroll}
                pagingEnabled={true}
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                snapToInterval={pageWidth}
                style={styles.fill}
            >
                {_srcSet.map((src, idx) => src || src === 0 ?
                    <Image
                        key={idx}
                        source={
                            typeof(src) == 'string'
                                ? {uri: _baseSrc + src.trim()}
                                : src
                        }
                        style={imageStyle}
                    /> :
                    <View key={idx} style={noImageStyle}>
                        {noImage ?? noImageText}
                    </View>
                )}
            </ScrollView>
            {pagingElement}
        </View>
    </View>;
});
// ImageSlider.defaultProps = {
//     paging: DotPaging,
// };

const DotPaging: PagingPosComponent = React.memo(function DotPaging({color, count, outside = false, setIndex, selectedIndex}) {
    const colorStyle = color ? {backgroundColor: color} : null;
    return <View style={[styles.pagingBottom, outside ? styles.pagingBottomOutside : styles.pagingBottomInside]}>
        {new Array<mixed>(count).fill(null).map((_, i) => 
            <TouchableWithoutFeedback
                key={i}
                onPress={() => setIndex(i)}
            >
                <View style={[
                    styles.pagingDot,
                    colorStyle,
                    i == selectedIndex ? styles.pagingDotSelected : null
                ]} />
            </TouchableWithoutFeedback>
        )}
    </View>;
});

const NumberPaging: PagingPosComponent = React.memo(function NumberPaging({color, count, outside = false, setIndex, selectedIndex}) {
    const colorStyle = color ? {color: color} : null;
    const PageNumber: {page: number} => React.Node = ({page}) => 
        <Text
            onPress={() => setIndex(page - 1)}
            style={[
                styles.pagingNumber,
                colorStyle,
                page - 1 == selectedIndex ? styles.pagingNumberSelected : null,
            ]}
        >
            {page}
        </Text>;
    
    let start = selectedIndex - MIDDLE_PAGE_DISTANCE + 1;
    if (start < 1) start = 1;
    let end = start + MAX_VISIBLE_PAGE_NUMBER - 1;
    if (end > count) {
        end = count;
        start = end - MAX_VISIBLE_PAGE_NUMBER + 1;
        if (start < 1) start = 1;
    }
    let isFirstVisible = false, isLastVisible = false;
    const numbers: Array<React.Node> = [];
    for (let page: number = start; page <= end; page++) {
        if (page == 1) isFirstVisible = true;
        if (page == count) isLastVisible = true;
        numbers.push(<PageNumber key={page} page={page} />);
    }

    return <View style={[styles.pagingBottom, outside ? styles.pagingBottomOutside : styles.pagingBottomInside]}>
        <View style={{flexDirection: 'row', opacity: isFirstVisible ? 0 : 1}}>
            <PageNumber page={1} />
            <Text style={colorStyle}>...</Text>
        </View>

        <Text onPress={() => setIndex(selectedIndex - 1)} style={[styles.pagingNumber, colorStyle, {opacity: selectedIndex <= 0 ? 0 : 1}]}>&lt;</Text>
        {numbers}
        <Text onPress={() => setIndex(selectedIndex + 1)} style={[styles.pagingNumber, colorStyle, {opacity: selectedIndex >= count - 1 ? 0 : 1}]}>&gt;</Text>
        
        <View style={{flexDirection: 'row', opacity: isLastVisible ? 0 : 1}}>
            <Text style={colorStyle}>...</Text>
            <PageNumber page={count} />
        </View>
    </View>;
});

const ArrowPaging: PagingComponent = React.memo(function ArrowPaging({color, count, setIndex, selectedIndex}) {
    const colorStyle = color ? {borderColor: color} : null;
    return <>
        <View style={[styles.pagingArrowBox, styles.pagingArrowBoxLeft]}>
            <TouchableWithoutFeedback onPress={() => setIndex(selectedIndex - 1)}>
                <View style={[styles.pagingArrow, styles.pagingArrowLeft, colorStyle, {opacity: selectedIndex <= 0 ? 0 : 1}]} />
            </TouchableWithoutFeedback>
        </View>
        <View style={[styles.pagingArrowBox, styles.pagingArrowBoxRight]}>
            <TouchableWithoutFeedback onPress={() => setIndex(selectedIndex + 1)}>
                <View style={[styles.pagingArrow, styles.pagingArrowRight, colorStyle, {opacity: selectedIndex >= count - 1 ? 0 : 1}]} />
            </TouchableWithoutFeedback>
        </View>
    </>;
});

export default ImageSlider;
export {
    ArrowPaging,
    DotPaging,
    NumberPaging
};