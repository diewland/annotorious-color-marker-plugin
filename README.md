# anno-colors
Draw annotorious in color

### Demo

* https://diewland.github.io/anno-colors/

### Usage

```js
anno.addPlugin('ColorPlugin', {
  img_id: 'myImage',                        // image id   [require]
  color_list: [                             // color list [require]
    { label: 'positive', color: 'lime' },
    { label: 'negative', color: 'red' },
    { label: 'not-sure', color: 'blue' },
  ],
  controller: true,                         // show color panel (optional)
});

// draw color annotations
anno.addColorAnnotation('red', {            // color must be in color_list
  src : document.querySelector('#myImage').src,
  text: 'Test red color',
  shapes : [{
    type : 'rect',
    units: 'pixel',
    geometry : { x : 100, y: 100, width : 100, height: 100 }
  }]
});

// print annotations group by color
console.log(anno.getColorAnnotations());
```

### References
* https://github.com/annotorious/annotorious
