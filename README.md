# before-effect-slider.js
**Build your fully customizable responsive before & after comparison slider.**

## Vartical
![](https://github.com/aminejafur/before-effect-slider.js/blob/master/gifs/300-green-screen.gif)
## Horizontal
![](https://github.com/aminejafur/before-effect-slider.js/blob/master/gifs/dogs-photoshop.gif)

### Demo
You can check a [Codepen demo here](https://codepen.io/aminejafur/pen/ZEQWLQV).

## How to use :
## Installation

Start by including `before-effect-slider.js` and `before-effect-slider.css` or the minified versions in HTML:

```html
<link rel="stylesheet" type="text/css" href="before-effect-slider.css"/>
<script type="text/javascript" src="before-effect-slider.js"></script>
```

## Usage & Customization

Start by creating a div in which you want to wrap the Slider, make sure to add the class or id that will be used by the plugin to build the Slider.

Default Selector is `#beforeEffectslider`
```html
<div id="beforeEffectslider"></div>
```

Or you can initiate Before Effect Slider with the following options :

`You can use tagName,Classe or ID in Selector option`

```js
beforeEffectslider({
  Selector: "#definedID", // Element that the slider will be build in
  Vertical:true, // this Slider is Vertical! (false is default value)
  BeforeImage: "../img/300-before.jpg", // Before Image
  BeforeAlt: "Before image", // Before Image Alt
  AfterImage: "../img/300-after.jpg", // After Image
  AftereAlt: "After image", // After Image Alt
  DragFrom:90, // Percent % of before Image
  MaxDrag: 30, //Max drag from right or bottom if vertical
  MinDrag:20, //Min drag from left or top if vertical
  DragIcon: '↨', //no html, only codes
  IconSize:10, //Icon size
  IconColor:'#7fe980', //Icon Color
  LineColor:'#29732a', //Line Color
  ButtonGradient:['#13b135','#086502'], // Line Button gradient (keep same color for no gradient)
  ButtonBorder:'#0a5003', //Line Button Border Color
  ButtonRaduis:10, // Line Button Raduis
  Cursor:'grab', // Cursor style on button hover, for more: https://developer.mozilla.org/fr/docs/Web/CSS/cursor
  Buttons:true, // Show before and after buttons ?
  ButtonsText:{ //After Before Buttons Texts
    after:'Edited',
    before:'Green Screen'
  },
  Border:{ // Border properties
          color:'green',
          width:5, // 0 for no border
          style:'solid'
         },
  callbackBefore : () => alert('before build'), //Callback Before building slider
  callbackAfter : () => alert('after build') //Callback After building slider
});
```
