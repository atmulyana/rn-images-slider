/**
 * rn-images-slider
 * https://github.com/atmulyana/rn-images-slider
 *
 * @format
 */
import React from 'react';
import {isValidElementType} from "react-is";
import {Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import PropTypes from 'prop-types';
import {extractImageStyle} from 'rn-style-props';

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
        color: 'black',
        fontSize: 20,
        fontWeight: '900',
        opacity: 0.5,
        overflow: 'hidden',
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

const ImageSlider = React.memo(function ImageSlider({onChange, paging = DotPaging, pagingColor, srcSet, style}) {
    style = extractImageStyle(style);
    
    if (['string', 'number', 'object'].includes(typeof(srcSet)) && !Array.isArray(srcSet)) srcSet = [srcSet];
    else if (!Array.isArray(srcSet) || srcSet.length < 1) srcSet = [null];
    
    const imageCount = srcSet.length,
        scrollRef = React.useRef(null),
        [imageSize, setImageSize] = React.useState({width: 0, height: 0}),
        [selectedIndex, setSelectedIndex] = React.useState(0),
        pageWidth = imageSize.width + MARGIN,
        onLayout = React.useCallback(
            ({nativeEvent: {layout: {width, height}}}) => setImageSize({width, height}),
            []
        );
        onScroll = React.useCallback(
            ({nativeEvent: {contentOffset: {x}}}) => {
                setSelectedIndex( Math.round(x / pageWidth) );
            },
            [pageWidth]
        ),
        scrollTo = idx => scrollRef.current?.scrollTo({
            x: idx * pageWidth,
            y: 0,
            animated: true,
        });
        setIndex = React.useCallback(
            idx => {
                idx = parseInt(idx) || 0;
                if (idx < 0) idx = 0;
                else if (idx >= imageCount) idx = imageCount - 1;
                setSelectedIndex(idx);
            },
            [imageCount]
        ),
        imageStyle = [styles.image, style.image, imageSize];
    
    React.useEffect(() => {
        scrollTo(selectedIndex);
        if (typeof(onChange) == 'function') onChange(selectedIndex);
    }, [selectedIndex]);
    React.useEffect(() => {
        scrollTo(selectedIndex);
    }, [pageWidth]);
    
    if (imageCount > 1 && isValidElementType(paging)) {
        const Paging = paging;
        paging = <Paging
            color={pagingColor}
            count={imageCount}
            setIndex={setIndex}
            selectedIndex={selectedIndex}
        />;
    }
    else {
        paging = null;
    }
    
    return <View style={style.view}> 
        <View style={styles.fill}>
            <ScrollView
                bounces={false}
                contentContainerStyle={[styles.images, {width: imageCount * pageWidth - MARGIN}]}
                contentOffset={{x: selectedIndex * pageWidth, y: 0}}
                horizontal
                onLayout={onLayout}
                onMomentumScrollEnd={onScroll}
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                snapToInterval={pageWidth}
                style={styles.fill}
            >
                {srcSet.map((src, idx) => src || src === 0 ?
                    <Image
                        key={idx}
                        source={typeof(src) == 'string' ? {uri: src} : src}
                        style={imageStyle}
                    /> :
                    <Text key={idx} style={[styles.noImage, imageSize]}>
                        NO IMAGE
                    </Text>
                )}
            </ScrollView>
            {paging}
        </View>
    </View>;
});
ImageSlider.propTypes = {
    onChange: PropTypes.func,
    paging: PropTypes.elementType,
    pagingColor: PropTypes.string,
    srcSet: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.object,
                PropTypes.string,
                PropTypes.number,
            ])
        ),
        PropTypes.object,
        PropTypes.string,
        PropTypes.number,
    ]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
// ImageSlider.defaultProps = {
//     paging: DotPaging,
// };

const DotPaging = React.memo(function DotPaging({color, count, outside = false, setIndex, selectedIndex}) {
    const colorStyle = color ? {backgroundColor: color} : null;
    return <View style={[styles.pagingBottom, outside ? styles.pagingBottomOutside : styles.pagingBottomInside]}>
        {new Array(count).fill(null).map((_, i) => 
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

const NumberPaging = React.memo(function NumberPaging({color, count, outside = false, setIndex, selectedIndex}) {
    const colorStyle = color ? {color: color} : null;
    const PageNumber = ({number}) => 
        <Text
            onPress={() => setIndex(number - 1)}
            style={[
                styles.pagingNumber,
                colorStyle,
                number - 1 == selectedIndex ? styles.pagingNumberSelected : null,
            ]}
        >
            {number}
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
    const numbers = [];
    for (let number = start; number <= end; number++) {
        if (number == 1) isFirstVisible = true;
        if (number == count) isLastVisible = true;
        numbers.push(<PageNumber key={number} number={number} />);
    }

    return <View style={[styles.pagingBottom, outside ? styles.pagingBottomOutside : styles.pagingBottomInside]}>
        <View style={{flexDirection: 'row', opacity: isFirstVisible ? 0 : 1}}>
            <PageNumber number={1} />
            <Text style={colorStyle}>...</Text>
        </View>

        <Text onPress={() => setIndex(selectedIndex - 1)} style={[styles.pagingNumber, colorStyle, {opacity: selectedIndex <= 0 ? 0 : 1}]}>&lt;</Text>
        {numbers}
        <Text onPress={() => setIndex(selectedIndex + 1)} style={[styles.pagingNumber, colorStyle, {opacity: selectedIndex >= count - 1 ? 0 : 1}]}>&gt;</Text>
        
        <View style={{flexDirection: 'row', opacity: isLastVisible ? 0 : 1}}>
            <Text style={colorStyle}>...</Text>
            <PageNumber number={count} />
        </View>
    </View>;
});

const ArrowPaging = React.memo(function ArrowPaging({color, count, setIndex, selectedIndex}) {
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