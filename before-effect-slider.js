/*
*
* before-effect-slider.js | V 1.0
*
* Copyright (C) 2020 Amine Jafur
*
* www.aminejafur.com/beforeEffectslider
*
*/

(function(root, factory){
    if(typeof define === 'function' && define.amd){
        define([], function(){
            return factory(root);
        });
    }else if(typeof exports === 'object'){
        module.exports = factory(root);
    }else{
        root.beforeEffectslider = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function(root){

  // stay strict, stay clean!
  'use strict';
  
  // helpers
    const logError = message => console.log(`%c ${message} `, "color:red;font-weight:bold;");

    const createNode = element => document.createElement(element);
  
    const append = (parent, el) => parent.appendChild(el);
  
    const onMultiListener = (el, s, fn)  => {
      s.split(' ').forEach(e => el.addEventListener(e, fn, false));
    }
  
    const setAttributes = elem => {
        for (let i = 1; i < arguments.length; i+=2) {
            elem.setAttribute(arguments[i], arguments[i+1]);
        }
    }

  // feature test
  const supports = 'querySelectorAll' in document && 'addEventListener' in root;
  
  // our main function
  const beforeEffectslider = options => {

      // validate feature test
      if(!supports) return logError("beforeEffectslider is not supported on this browser");
      // validate passed data
      if(!!options && typeof options !== 'object') return logError("Option error, please check the documentation");
  
      // default params
      const defaults = {
        Selector: "#beforeEffectslider", // Element that the slider will be build in
        Vertical: false, // Vertical is false as default 
        BeforeImage: "https://raw.githubusercontent.com/aminejafur/before-effect-slider.js/master/img/before.jpg",  // Before Image
        BeforeAlt: "Before image",  // Before Image Alt
      	AfterImage: "https://raw.githubusercontent.com/aminejafur/before-effect-slider.js/master/img/after.jpg", // After Image
        AftereAlt: "After image", // After Image Alt
        DragFrom:50, // Percent % of before Image
      	MaxDrag: 0,  //Max drag from right or bottom if vertical
        MinDrag: 30, //Min drag from left or top if vertical
        DragIcon: '↔', //no html, only codes
        IconSize: '24', //Icon size
        IconColor:'#FFF', //Icon Color
        LineColor:'#282828', //Line size
        ButtonGradient:['#282828','#000000'], // Line Button gradient (keep same color for no gradient)
        ButtonBorder:'#000000', //Line Button Border Color
        ButtonRaduis:50, // Line Button Raduis
        Cursor:'ew-resize', // Cursor style on button hover, for more: https://developer.mozilla.org/fr/docs/Web/CSS/cursor
        Buttons:true, // Show before and after buttons ?
        ButtonsText:{ //After Before Buttons Texts
          before:'Before',
          after:'After'
        },
        Border:{ // Border properties
                width:5, // 0 for no border
                style:'solid',
                color:'black'
               },
        callbackBefore: () => {}, //Callback Before building slider
        callbackAfter: () => {} //Callback After building slider
      };
  
    // Merge user options with default ones
    if(!!options){
      if(!!options.Border){
        Object.assign(options.Border, Object.assign(defaults.Border, options.Border));
      }
      if(!!options.ButtonsText){
        Object.assign(options.ButtonsText, Object.assign(defaults.ButtonsText, options.ButtonsText));
      }
    } 

    Object.assign(defaults, options || {});

    //get mainElement
  	const mainElement = document.querySelector(defaults.Selector);
    // store all elements for resize on windows Resize
    (root.beforeEffectsliderElements = root.beforeEffectsliderElements || []).push(mainElement);

    // does it exist?
    if(!!!mainElement){
        logError(`beforeEffectslider : Error cannot find ${defaults.Selector} element`);
        return false;
    }

    // elements
    let mainDiv = null , 
      beforeImage = null , 
      resizeDiv = null , 
      afterImage = null , 
      handler = null;

    //Classes
    let mainDivClass = '.before-effect-main-div',
        resizableDivClass = '.before-effect-resizable-div',
        lineClass = 'before-effect-line',
        pluginBeforeButton = 'before-effect-button',
        pluginLeftButton = 'after-effect-button',
        pluginRightButton = 'before-effect-button-right',
        dragginClass = 'dragging',
        resizingClass = 'resizable';

    // da work!
    const beforeEffect = {
          init: function() {
                  // call back before
                  defaults.callbackBefore();
                  /*
                  *
                  *   Create the UI
                  *
                  *
                  *   <div class="before-effect-main-div">
                  *   <img src="BeforeImage" alt="Before image">
                  *   <div class="before-effect-button before-effect-button-label">Before</div>
                  *       <div class="before-effect-resizable-div">
                  *       <div class="before-effect-button">After</div>
                  *          <img src="AfterImage" alt="After image">
                  *       </div>
                  *   <span class="before-effect-line"></span>
                  *   </div>
                  *
                  */
                  mainDiv = createNode("div");
                  mainDiv.classList.add('before-effect-main-div');
                  beforeImage = createNode("img");
                  beforeImage.src=defaults.BeforeImage;
                  beforeImage.alt=defaults.BeforeAlt;

                  // styling border
                  mainDiv.style.border = `${defaults.Border.width}px ${defaults.Border.style} ${defaults.Border.color} `;

                  append(mainDiv,beforeImage);

                  resizeDiv = createNode("div");
                  resizeDiv.classList.add('before-effect-resizable-div');

                  if(defaults.Buttons){

                  // After button and before buttons
                  let beforeButton = createNode("div");
                  beforeButton.classList.add(pluginBeforeButton);
                  beforeButton.classList.add(pluginRightButton);
                  beforeButton.innerHTML = defaults.ButtonsText.before

                  // appending to selected div
                  append(mainDiv,beforeButton); 
                  let afterButton = createNode("div");
                  afterButton.classList.add(pluginBeforeButton);
                  afterButton.classList.add(pluginLeftButton);
                  afterButton.innerHTML = defaults.ButtonsText.after

                  // appending buttons
                  append(resizeDiv,afterButton); 
                  } 

                  // is vertical ?
                  resizeDiv.style.width = defaults.Vertical ? '100%' : `${defaults.DragFrom}%`;
                  resizeDiv.style.height = defaults.Vertical ? `${defaults.DragFrom}%` : '100%';

                  afterImage = createNode("img");
                  afterImage.src=defaults.AfterImage;
                  afterImage.alt=defaults.AftereAlt;
                  append(resizeDiv,afterImage);
                  append(mainDiv,resizeDiv);
                
                  handler = createNode("span");
                  handler.classList.add(lineClass);

                  // styling
                  handler.style.setProperty('--icon',`"${defaults.DragIcon}"`)
                  handler.style.setProperty('--LineColor',`${defaults.LineColor}`)
                  handler.style.setProperty('--buttonG1',`${defaults.ButtonGradient[0]}`)
                  handler.style.setProperty('--buttonG2',`${defaults.ButtonGradient[1]}`)
                  handler.style.setProperty('--ButtonBorder',`${defaults.ButtonBorder}`)
                  handler.style.setProperty('--ButtonRaduis',`${defaults.ButtonRaduis}%`)
                  handler.style.setProperty('--IconSize',`${defaults.IconSize}px`)
                  handler.style.setProperty('--IconColor',`${defaults.IconColor}`)
                  handler.style.setProperty('--Cursor',`${defaults.Cursor}`)
                  
                  // is vertical ?
                  handler.style.top = defaults.Vertical ? `${defaults.DragFrom}%` : '0';
                  handler.style.left = defaults.Vertical ? '0' : `${defaults.DragFrom}%`;
                  handler.style.width = defaults.Vertical ? '100%' : '4px';
                  handler.style.height = defaults.Vertical ? '4px' : '100%';
                  handler.style.setProperty('--IconPosT',defaults.Vertical ? '0' : '50%')
                  handler.style.setProperty('--IconPosR',defaults.Vertical ? '50%' : '-27')

                  append(mainDiv,handler);
                
                  // appending to selected div
                  append(mainElement,mainDiv);

                  //adjust width
                  this.adjustwidth();



                  //On resize function, fix focus on last only
                  window.onresize = function(){
                    this.adjustwidth()
                  }.bind(this)

                  // call back after
                  defaults.callbackAfter();

                  // call draggingStarted on drag events
                  this.draggingStarted(handler, resizeDiv, mainDiv);
          },
          adjustwidth: function() {
                [...beforeEffectsliderElements].forEach(el => {
                  mainDiv = el.querySelector(mainDivClass);
                  // Adjust the slider
                  let width = mainDiv.getBoundingClientRect().width+'px';

                  mainDiv.querySelector(resizableDivClass).querySelector('img').style.width = width;
                  mainDiv.querySelector('img').style.width = width;
                })
          },
          draggingStarted: function(dragdHandler, resizableImage, parentNode) {
              
              // Initialize the dragging event on mousedown.
              onMultiListener(dragdHandler, 'mousedown touchstart', e => {
          
                dragdHandler.classList.add(dragginClass);
                resizableImage.classList.add(resizingClass);
                
                // Check if its a mouse or touch event and get starting cursor position
                let CursorStartPos = defaults.Vertical 
                      ? (e.pageY) 
                        ? e.pageY 
                        : e.originalEvent.touches[0].pageY 
                      : (e.pageX) 
                        ? e.pageX 
                        : e.originalEvent.touches[0].pageX;

                // Get positions
                let parentNodeBorder = parseInt(parentNode.style.borderWidth.replace(/px|%|/g,  (x) => '')),
                    dragOffset_h_w = defaults.Vertical ? dragdHandler.offsetHeight : dragdHandler.offsetWidth,
                    dragOffset_t_l = defaults.Vertical ? dragdHandler.offsetTop : dragdHandler.offsetLeft,
                    calcPos = dragOffset_t_l + dragOffset_h_w + parentNodeBorder - CursorStartPos,
                    parentNodeOffset = defaults.Vertical ? parentNode.offsetHeight : parentNode.offsetWidth;

                // Set limits
                let minDrag = defaults.MinDrag;
                let MaxDrag = parentNodeOffset - dragOffset_h_w - defaults.MaxDrag;
                
                // Dragging distance on mousemove.
                onMultiListener(parentNode, 'mousemove touchmove', e => {

                  // Check if its a mouse or touch event and get current cursor position
                  let cursorCurrentPos = defaults.Vertical 
                      ? (e.pageY) 
                        ? e.pageY 
                        : e.originalEvent.touches[0].pageY 
                      : (e.pageX) 
                        ? e.pageX 
                        : e.originalEvent.touches[0].pageX;
            
                  let leftOrTopValue = cursorCurrentPos + calcPos - dragOffset_h_w;
                  
                  // Prevent going off limits
                  if ( leftOrTopValue < minDrag) {
                    leftOrTopValue = minDrag;
                  } else if (leftOrTopValue > MaxDrag) {
                    leftOrTopValue = MaxDrag;
                  }
                  
                  // handle's value to divs width.
                  let currentDragPosition = (leftOrTopValue + dragOffset_h_w/2)*100/parentNodeOffset+'%';

                  // Changing to new values
                  if(!!document.querySelector(`.${dragginClass}`)){ 
                    if(defaults.Vertical){
                      document.querySelector(`.${dragginClass}`).style.top = currentDragPosition;
                      resizableImage.style.height = currentDragPosition;
                    }else{
                      document.querySelector(`.${dragginClass}`).style.left = currentDragPosition;
                      resizableImage.style.width = currentDragPosition;
                    }
                }
            
                });
          
                onMultiListener(parentNode, 'mouseup touchend touchcancel', e => {
                  dragdHandler.classList.remove(dragginClass);
                  resizableImage.classList.remove(resizingClass);
                });
  
                e.preventDefault();
              });
                onMultiListener(root, 'mouseup', e => {
                  dragdHandler.classList.remove(dragginClass);
                  resizableImage.classList.remove(resizingClass);
                });
          },
    }

    // call init
    return beforeEffect.init();
    }

    return beforeEffectslider;

}); // End