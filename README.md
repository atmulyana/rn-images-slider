# **rn-images-slider**

React Native component for image slider.

![Image Slider](./images/slider.gif)

## **How to install this package**

Because this is a React Native component, you must install it on a React Native project. Beside that, you must also install `rn-style-props`
package. You may use the console command below:

    npm i rn-style-props rn-images-slider

## **Example**

```javascript
import React from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text} from 'react-native';
import ImageSlider from 'rn-images-slider';

export default () => {
    const win = Dimensions.get('window');
    const [desc, setDesc] = React.useState('');
    const [_, setFlag] = React.useState(false);
    const onChange = React.useCallback(
        idx => setDesc(descriptions[idx] || ''),
        []
    );
    
    React.useEffect(() => {
        const forceUpdate = () => {
            setFlag(flag => !flag);
        };
        
        const listener = Dimensions.addEventListener('change', forceUpdate);
        return () => listener.remove();
    }, [])

    return <SafeAreaView
        style={[
            styles.main,
            {flexDirection: win.width > win.height ? 'row' : 'column'}
        ]}
    >
        <ImageSlider
            baseSrc="https://ichef.bbci.co.uk/images/ic/976x549_b/"
            onChange={onChange}
            style={styles.images}
            srcSet={srcSet}
        />
        <Text style={styles.desc}>{desc}</Text>
    </SafeAreaView>;
}

const styles = StyleSheet.create({
    main: {
        alignSelf: 'stretch', 
        flex: 1,
        padding: 5,
    },
    images: {
        backgroundColor: 'gray',
        flex: 1,
        borderWidth: 2,
        padding: 2,
        resizeMode: 'stretch',
    },
    desc: {
        flex: 1,
        fontSize: 14,
        padding: 5,
    },
});

const srcSet = [
    'p0493g9v.jpg',
    'p0493gpj.jpg',
    'p0493gtx.jpg',
    'p0493j1d.jpg',
    'p049jknr.jpg',
    'p049jkt5.jpg',
    'p049jkvt.jpg',
    'p049jkzx.jpg',
    'p049jl2w.jpg',
    'p049jl7c.jpg',
    'p049jlc7.jpg',
    'p04bkzwf.jpg',
    'p04bkzyl.jpg',
    'p04bl05c.jpg',
    'p04bl09v.jpg',
    'p04bl0h4.jpg',
];

const descriptions = [
    'A newly born Wildebeest calf has a moment of bonding with its mother.\nBlue Wildebeest (Connochaetes taurinus) South Africa',
    'A serval kitten hides from predators in the short grass.\nServal (Leptailurus serval) Masai Mara National Reserve, Kenya',
    'A young cheetah cub waits for mum to return.\nCheetah (Acinonyx jubatus)',
    'Young lion amongst its pride.\nLion (Felis leo) Masai Mara National Reserve, Kenya',
    'Baby harp seal perfectly camouflaged on the white ice.\nHarp Seal (Pagophilus groenlandicus) The White Sea, Russian Arctic',
    'A green turtle hatchling makes it safely to the open sea.\nGreen turtle (Chelonia mydas) Anano Island, Indonesia',
    'A newborn hippo takes a break on a riverbank.\nHippopotamus (Hippopotamus amphibius), South Luangwa',
    'Capybara babies huddle close to mum.\nCapybara (Hydrochoerus hydrochaeris) Pantanal, Brazil',
    'A freshly hatched Gentoo Penguin chick get’s a feed.\nGentoo Penguin (Pygoscelis papua) Antarctica',
    'A giant river otter family head down to the river.\nGiant river otter (Pteronura brasiliensis) Pantanal, Brazil',
    'Cute little duckling on grass.\nMallard (Anas platyrhynchos)',
    'A guanaco calf, wild ancestor of the llama.\nGuanaco (Lama guanicoe) Torres del Paine National Park, Patagonia, Chile',
    'A baby capuchin monkey gets a free ride from an adult.\nTufted capuchin (Sapajus paella)',
    'Two mountain goat kids make their way down a precipitous slope.\nMountain goat (Oreamnos americanus) Glacier National Park, Montana, USA',
    'Hyrax babies jostle for the best position.\nRock hyrax (Procavia capensis) Serengeti NP, Tanzania',
    'A pair of musk ox calves keep an eye out for danger.\nMusk ox (Ovibos moschatus)',
];
```

## **Image Slider Element Props**
- `baseSrc`   
  is the base URI of image URIs. Usually, the images come from the same directory. So, `baseSrc` can refer to the URI of that directory
  and you just write the file name of all images in `srcSet` prop.   
  Another case, perhaps, you have image URI pattern like `https://www.yoursite.com/image?id=1`. Different image has different id, so 
  each image URI is only differentiated by id value. For this case, you may set `baseSrc` to be `https://www.yoursite.com/image?id=`
  and in `srcSet` array, you only write the id value of each image.   
  **Please to note that**   
  + this `baseSrc` only affects to all string item (incomplete URI) in `srcSet` array. If you set the image source as an object,
    `baseSrc` is ignored.
  + `baseSrc` value is simply concatenated with URI string in `srcSet`. Because of that, you must add the trailing slash ('/') to
    `baseSrc` if needed.

- `noImage`   
  The element that will be displayed for items in `srcSet` which are `null` or `undefined`. Supposedly, the items are the image
  sources and `ImageSlider` displays those images. So, why `null`/`undefined` value is acceptable. It's useful when the image source
  hasn't been set in database but other informations, such as description, have been there. By default, when `null`/`undefined` item
  found, `ImageSlider` will display "NO IMAGE" text. Example:
  ```
  <ImageSlider
    noImage={<Image
        source={require('./images/no-image.png')}
        style={[
            StyleSheet.absoluteFill,
            {height: undefined, width: undefined, resizeMode: 'contain'}
        ]}
    />}
    ...
  />
  ```

- `onChange`   
  It's the callback function that will be invoked when the displayed image changes. The function has one parameter, that is the
  index/number (starting from 0) of currently displayed image. This index can be used to show the desciption of the displayed
  image as exemplified by the example above.

- `paging`   
  The paging component that will be used by the image slider. The paging here is the numbering for the images inside the image slider.
  Beside swiping gesture, the user can tap an item/number shown by the paging component to display different image. There are three
  paging components provided by the package:  
  
  + `NumberPaging`  
    This component will show the image numbers at bottom side of the image slider. The user can tap each number to show the image at
    the order of that number. The displayed image number will be highlighted. The example below shows how to use `NumberPaging`: 
    ```javascript
    ...
    import ImageSlider, {NumberPaging} from 'rn-images-slider';
    
    ...

     <ImageSlider paging={NumberPaging} ... />
    ...
    ```
  
  + `DotPaging`  
    Different from `NumberPaging`, this component replaces the numbers with the dots. You can see it in the picture above. This is
    the default paging component if you don't specify a paging component.
  
  + `ArrowPaging`   
    This component will show two arrows, each at the left and the right side of the image slider. The left arrow is to show the
    previous image in the order and the right one is to show the next image. The example to use `ArrowPaging` is similar to that
    for `NumberPaging`.   

  Beside the paging components provided by the package, you may create your own component. It is explained in the section **Custom Paging
  Component**.

- `pagingColor`  
  The color for the paging items: the color for the numbers (if using `NumberPaging`), the dots (`DotPaging`) or the arrows (`ArrowPaging`).

- `srcSet`   
  An array of the image sources. The images will be displayed in the order as in the array. An item in the array can be an image URI, an
  object that can be assigned to [`source`](https://reactnative.dev/docs/image#source) prop of `Image` component or a local image (such
  as `require('./images/pic.jpg')`).

- `style`   
  Defines the *style* for image slider. You can use all *style* props applicable to `Image` component. The *style* would affect to the
  images, such as `resizeMode`, it will be applied to the images.

## **Custom Paging Component**
Before explaining how to create a paging component, it's better to see the elements structure which construct the image slider.
```javascript
<View style={styleProp}> 
    <View style={styleFill}>
        <ScrollView
            ...
            horizontal
            style={styleFill}
        >
            {srcSetProp.map((src, idx) => 
                <Image
                    key={idx}
                    source={src}
                    style={[imageStyleProp, ...]}
                />
            )}
        </ScrollView>
        <PagingComponent
            color={pagingColorProp}
            count={srcSetProp.length}
            setIndex={setIndex}
            selectedIndex={selectedIndex}
        />
    </View>
</View>
```
You can see in the elements structure above, the slider is implemented by a `ScrollView` component and the paging component is placed
beneath the slider. Some props are set to the paging component. Let's talk about these props so you can make a paging component.
- `color`  
  The color for paging items. It's the same as `pagingColor` prop of image slider component.
- `count`   
  The count of images inside the slider.
- `setIndex`   
  The function to set the index/number (starting from 0) of the displayed image. In the other words, it can change the displayed image
  as the requested number. This function is intended to be called in `onPress` handler when the user taps an paging item.
- `selectedIndex`   
  The index/number (starting from 0) of the currently displayed image. It can be used to determine which paging item to be highlighted.

After knowing the explanation above, now we're ready to create a paging component.
```javascript
function MyNumberPaging({color = 'blue', count, setIndex, selectedIndex}) {
    const numbers = [];
    for (let idx = 0; idx < count; idx++) {
        const page = idx + 1;
        numbers.push(<Text
            key={idx}
            style={[
                styles.pagingNumber,
                {
                    color,
                    fontWeight: idx == selectedIndex ? 'bold' : 'normal'
                }
            ]}
            onPress={
                () => setIndex(idx)
            }
        >
            {page}
        </Text>);
    }

    return <View style={styles.pagingBar}>
        {numbers}
    </View>;
}

const styles = StyleSheet.create({
    pagingBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 3,
    },
    pagingNumber: {
        marginHorizontal: 3,
    },
});
```
And you use this page component as we did with `NumberPaging`:
```javascript
<ImageSlider paging={MyNumberPaging} ... />
```

This paging component makes the image number being displayed bold (you can notice the code
`fontWeight: idx == selectedIndex ? 'bold' : 'normal'`). The paging items will be placed under the image (outside the image area)
as we can expect from the structure of image slider elements. What if you want to place the numbers inside the image area. By
benefiting absolute positioning in *style*, we can do that. Now, we change `styles.pagingBar` to be
<pre>
    pagingBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 3,
        <strong>position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,</strong>
    },
</pre>

This new *style* will place the paging numbers at the bottom side inside the image area. If you replace `bottom` prop to be `top`,
the paging numbers will move to the top side. It can be understood easily that absolute positioning can place the paging numbers
anywhere inside the image area. However, there is one more chalenge, what if we want to place the numbers above the image
(outside the image area). We can still resolve this chalenge by doing the trick in *style*. But now, we need more effort. The
first, we replace `bottom` prop in `styles.pagingBar` above to be
<pre>
    pagingBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 3,
        position: 'absolute',
        left: 0,
        right: 0,
        <strong>top: -20,</strong>
    },
</pre>
Then the second, we need more *styling* for the image slider:
<pre>
    &lt;ImageSlide style={[..., {<strong>paddingTop: 20</strong>}]} ... /&gt;
</pre>

The negative value for `top` prop will place the numbers beyond the container `View` that makes the numbers positioned above
the image. The `paddingTop` prop for image slider is to make enough space to avoid overlapping between the paging numbers and
other contents.

By using the same idea (doing tricks in *style*), you can place the paging numbers on the left/right side of image
(outside/inside image area).


## **Some Tips and Tricks**

### **Sliding Images Automatically**
We can slide the images automatically without user interaction. We can use `setTimeout` function to call `setIndex` function.
Because we involve `setIndex` function, we must do it in a paging component. The example below is a paging component that
dispalys nothing but it slides the images.
```javascript
function TimerSlider({count, setIndex, selectedIndex}) {
    React.useEffect(() => {
        const t = setTimeout(() => {
            let idx = selectedIndex + 1;
            if (idx >= count) idx = 0;
            setIndex(idx);
        }, 2000);
        return () => clearTimeout(t);
    }, [selectedIndex]);
    return null;
}
```

### **Need More Props For Your Paging Component? (More About `DotPaging` and `NumberPaging`)**
In the section **Custom Paging Component**, we have seen that the paging items can be placed outside the image area. Sometimes,
it's preferred because the color of paging items can be similar to the image color so that they are hard to see. `DotPaging`
and `NumberPaging`, by default, place the paging items inside the image area. Actually these components have one more prop
(named `outside`) to set the paging items to be placed outside the image area beneath the image. To use this prop, do as follows
<pre>
    &lt;ImageSlider paging={<b>props =&gt; &lt;NumberPaging {...props} outside /&gt;</b>} ... /&gt;
</pre>
(Note: The first three dots, you must really type this. The second three dots means there may be the rest of code and you must
type the rest of code if really exists.)

This way can be used if you need more props in your custom paging component.