

"use strict";

var viewportHeight = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
);

function backToTop() {
  var currentScrollPos = window.pageYOffset;

  var component = document.getElementsByClassName("back-to-top")[0];

  if (currentScrollPos < viewportHeight) {
    component.style.transform = "translateY(100px)";
  }

  if (currentScrollPos > viewportHeight / 2) {
    component.style.transform = "translateY(-100px)";
  }
}

"use strict";

// Extracted from https://github.com/GoogleChromeLabs/sw-precache/blob/master/demo/app/js/service-worker-registration.js#L27
// Modified from https://serviceworke.rs/offline-status.html

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(function(e) {
        console.error("Error during service worker registration:", e);
      });
  });
}


/**
 * Zenscroll 4.0.2
 * https://github.com/zengabor/zenscroll/
 *
 * Copyright 2015–2018 Gabor Lenard
 *
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org>
 * 
 */

/*jshint devel:true, asi:true */

/*global define, module */


(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory())
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory()
	} else {
		(function install() {
			// To make sure Zenscroll can be referenced from the header, before `body` is available
			if (document && document.body) {
				root.zenscroll = factory()
			} else {
				// retry 9ms later
				setTimeout(install, 9)
			}
		})()
	}
}(this, function () {
	"use strict"


	// Detect if the browser already supports native smooth scrolling (e.g., Firefox 36+ and Chrome 49+) and it is enabled:
	var isNativeSmoothScrollEnabledOn = function (elem) {
		return elem && "getComputedStyle" in window &&
			window.getComputedStyle(elem)["scroll-behavior"] === "smooth"
	}


	// Exit if it’s not a browser environment:
	if (typeof window === "undefined" || !("document" in window)) {
		return {}
	}


	var makeScroller = function (container, defaultDuration, edgeOffset) {

		// Use defaults if not provided
		defaultDuration = defaultDuration || 999 //ms
		if (!edgeOffset && edgeOffset !== 0) {
			// When scrolling, this amount of distance is kept from the edges of the container:
			edgeOffset = 9 //px
		}

		// Handling the life-cycle of the scroller
		var scrollTimeoutId
		var setScrollTimeoutId = function (newValue) {
			scrollTimeoutId = newValue
		}

		/**
		 * Stop the current smooth scroll operation immediately
		 */
		var stopScroll = function () {
			clearTimeout(scrollTimeoutId)
			setScrollTimeoutId(0)
		}

		var getTopWithEdgeOffset = function (elem) {
			return Math.max(0, container.getTopOf(elem) - edgeOffset)
		}

		/**
		 * Scrolls to a specific vertical position in the document.
		 *
		 * @param {targetY} The vertical position within the document.
		 * @param {duration} Optionally the duration of the scroll operation.
		 *        If not provided the default duration is used.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToY = function (targetY, duration, onDone) {
			stopScroll()
			if (duration === 0 || (duration && duration < 0) || isNativeSmoothScrollEnabledOn(container.body)) {
				container.toY(targetY)
				if (onDone) {
					onDone()
				}
			} else {
				var startY = container.getY()
				var distance = Math.max(0, targetY) - startY
				var startTime = new Date().getTime()
				duration = duration || Math.min(Math.abs(distance), defaultDuration);
				(function loopScroll() {
					setScrollTimeoutId(setTimeout(function () {
						// Calculate percentage:
						var p = Math.min(1, (new Date().getTime() - startTime) / duration)
						// Calculate the absolute vertical position:
						var y = Math.max(0, Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)))
						container.toY(y)
						if (p < 1 && (container.getHeight() + y) < container.body.scrollHeight) {
							loopScroll()
						} else {
							setTimeout(stopScroll, 99) // with cooldown time
							if (onDone) {
								onDone()
							}
						}
					}, 9))
				})()
			}
		}

		/**
		 * Scrolls to the top of a specific element.
		 *
		 * @param {elem} The element to scroll to.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToElem = function (elem, duration, onDone) {
			scrollToY(getTopWithEdgeOffset(elem), duration, onDone)
		}

		/**
		 * Scrolls an element into view if necessary.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollIntoView = function (elem, duration, onDone) {
			var elemHeight = elem.getBoundingClientRect().height
			var elemBottom = container.getTopOf(elem) + elemHeight
			var containerHeight = container.getHeight()
			var y = container.getY()
			var containerBottom = y + containerHeight
			if (getTopWithEdgeOffset(elem) < y || (elemHeight + edgeOffset) > containerHeight) {
				// Element is clipped at top or is higher than screen.
				scrollToElem(elem, duration, onDone)
			} else if ((elemBottom + edgeOffset) > containerBottom) {
				// Element is clipped at the bottom.
				scrollToY(elemBottom - containerHeight + edgeOffset, duration, onDone)
			} else if (onDone) {
				onDone()
			}
		}

		/**
		 * Scrolls to the center of an element.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {offset} Optionally the offset of the top of the element from the center of the screen.
		 *        A value of 0 is ignored.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToCenterOf = function (elem, duration, offset, onDone) {
			scrollToY(Math.max(0, container.getTopOf(elem) - container.getHeight()/2 + (offset || elem.getBoundingClientRect().height/2)), duration, onDone)
		}

		/**
		 * Changes default settings for this scroller.
		 *
		 * @param {newDefaultDuration} Optionally a new value for default duration, used for each scroll method by default.
		 *        Ignored if null or undefined.
		 * @param {newEdgeOffset} Optionally a new value for the edge offset, used by each scroll method by default. Ignored if null or undefined.
		 * @returns An object with the current values.
		 */
		var setup = function (newDefaultDuration, newEdgeOffset) {
			if (newDefaultDuration === 0 || newDefaultDuration) {
				defaultDuration = newDefaultDuration
			}
			if (newEdgeOffset === 0 || newEdgeOffset) {
				edgeOffset = newEdgeOffset
			}
			return {
				defaultDuration: defaultDuration,
				edgeOffset: edgeOffset
			}
		}

		return {
			setup: setup,
			to: scrollToElem,
			toY: scrollToY,
			intoView: scrollIntoView,
			center: scrollToCenterOf,
			stop: stopScroll,
			moving: function () { return !!scrollTimeoutId },
			getY: container.getY,
			getTopOf: container.getTopOf
		}

	}


	var docElem = document.documentElement
	var getDocY = function () { return window.scrollY || docElem.scrollTop }

	// Create a scroller for the document:
	var zenscroll = makeScroller({
		body: document.scrollingElement || document.body,
		toY: function (y) { window.scrollTo(0, y) },
		getY: getDocY,
		getHeight: function () { return window.innerHeight || docElem.clientHeight },
		getTopOf: function (elem) { return elem.getBoundingClientRect().top + getDocY() - docElem.offsetTop }
	})


	/**
	 * Creates a scroller from the provided container element (e.g., a DIV)
	 *
	 * @param {scrollContainer} The vertical position within the document.
	 * @param {defaultDuration} Optionally a value for default duration, used for each scroll method by default.
	 *        Ignored if 0 or null or undefined.
	 * @param {edgeOffset} Optionally a value for the edge offset, used by each scroll method by default. 
	 *        Ignored if null or undefined.
	 * @returns A scroller object, similar to `zenscroll` but controlling the provided element.
	 */
	zenscroll.createScroller = function (scrollContainer, defaultDuration, edgeOffset) {
		return makeScroller({
			body: scrollContainer,
			toY: function (y) { scrollContainer.scrollTop = y },
			getY: function () { return scrollContainer.scrollTop },
			getHeight: function () { return Math.min(scrollContainer.clientHeight, window.innerHeight || docElem.clientHeight) },
			getTopOf: function (elem) { return elem.offsetTop }
		}, defaultDuration, edgeOffset)
	}


	// Automatic link-smoothing on achors
	// Exclude IE8- or when native is enabled or Zenscroll auto- is disabled
	if ("addEventListener" in window && !window.noZensmooth && !isNativeSmoothScrollEnabledOn(document.body)) {

		var isHistorySupported = "history" in window && "pushState" in history
		var isScrollRestorationSupported = isHistorySupported && "scrollRestoration" in history

		// On first load & refresh make sure the browser restores the position first
		if (isScrollRestorationSupported) {
			history.scrollRestoration = "auto"
		}

		window.addEventListener("load", function () {

			if (isScrollRestorationSupported) {
				// Set it to manual
				setTimeout(function () { history.scrollRestoration = "manual" }, 9)
				window.addEventListener("popstate", function (event) {
					if (event.state && "zenscrollY" in event.state) {
						zenscroll.toY(event.state.zenscrollY)
					}
				}, false)
			}

			// Add edge offset on first load if necessary
			// This may not work on IE (or older computer?) as it requires more timeout, around 100 ms
			if (window.location.hash) {
				setTimeout(function () {
					// Adjustment is only needed if there is an edge offset:
					var edgeOffset = zenscroll.setup().edgeOffset
					if (edgeOffset) {
						var targetElem = document.getElementById(window.location.href.split("#")[1])
						if (targetElem) {
							var targetY = Math.max(0, zenscroll.getTopOf(targetElem) - edgeOffset)
							var diff = zenscroll.getY() - targetY
							// Only do the adjustment if the browser is very close to the element:
							if (0 <= diff && diff < 9 ) {
								window.scrollTo(0, targetY)
							}
						}
					}
				}, 9)
			}

		}, false)

		// Handling clicks on anchors
		var RE_noZensmooth = new RegExp("(^|\\s)noZensmooth(\\s|$)")
		window.addEventListener("click", function (event) {
			var anchor = event.target
			while (anchor && anchor.tagName !== "A") {
				anchor = anchor.parentNode
			}
			// Let the browser handle the click if it wasn't with the primary button, or with some modifier keys:
			if (!anchor || event.which !== 1 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
				return
			}
			// Save the current scrolling position so it can be used for scroll restoration:
			if (isScrollRestorationSupported) {
				var historyState = history.state && typeof history.state === "object" ? history.state : {}
				historyState.zenscrollY = zenscroll.getY()
				try {
					history.replaceState(historyState, "")
				} catch (e) {
					// Avoid the Chrome Security exception on file protocol, e.g., file://index.html
				}
			}
			// Find the referenced ID:
			var href = anchor.getAttribute("href") || ""
			if (href.indexOf("#") === 0 && !RE_noZensmooth.test(anchor.className)) {
				var targetY = 0
				var targetElem = document.getElementById(href.substring(1))
				if (href !== "#") {
					if (!targetElem) {
						// Let the browser handle the click if the target ID is not found.
						return
					}
					targetY = zenscroll.getTopOf(targetElem)
				}
				event.preventDefault()
				// By default trigger the browser's `hashchange` event...
				var onDone = function () { window.location = href }
				// ...unless there is an edge offset specified
				var edgeOffset = zenscroll.setup().edgeOffset
				if (edgeOffset) {
					targetY = Math.max(0, targetY - edgeOffset)
					if (isHistorySupported) {
						onDone = function () { history.pushState({}, "", href) }
					}
				}
				zenscroll.toY(targetY, null, onDone)
			}
		}, false)

	}


	return zenscroll


}));

"use strict";

var prevScrollpos = window.pageYOffset;

var delta = 70;

var navBtn = document.getElementById("nav-menu-btn");

var component = document.getElementsByClassName("nav-bar")[0];

document.getElementsByTagName("body")[0].addEventListener("click", hideOnClick);

function hideOnClick(e) {
  if (!component.contains(e.target) && navBtn.checked) {
    event.preventDefault();
    navBtn.checked = false;
  }
}

function hideMenu() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    return;
  }

  var currentScrollPos = window.pageYOffset;

  if (prevScrollpos > currentScrollPos + delta) {
    component.style.transform = "translateY(0px)";
    prevScrollpos = currentScrollPos;
  }

  if (prevScrollpos < currentScrollPos - delta) {
    component.style.transform = "translateY(-" + component.offsetHeight + "px)";

    navBtn.checked = false;

    prevScrollpos = currentScrollPos;
  }
}


"use strict";

window.onscroll = function() {
  hideMenu();
  backToTop();
};


/*!
  hey, [be]Lazy.js - v1.8.2 - 2016.10.25
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
(function(q,m){"function"===typeof define&&define.amd?define(m):"object"===typeof exports?module.exports=m():q.Blazy=m()})(this,function(){function q(b){var c=b._util;c.elements=E(b.options);c.count=c.elements.length;c.destroyed&&(c.destroyed=!1,b.options.container&&l(b.options.container,function(a){n(a,"scroll",c.validateT)}),n(window,"resize",c.saveViewportOffsetT),n(window,"resize",c.validateT),n(window,"scroll",c.validateT));m(b)}function m(b){for(var c=b._util,a=0;a<c.count;a++){var d=c.elements[a],e;a:{var g=d;e=b.options;var p=g.getBoundingClientRect();if(e.container&&y&&(g=g.closest(e.containerClass))){g=g.getBoundingClientRect();e=r(g,f)?r(p,{top:g.top-e.offset,right:g.right+e.offset,bottom:g.bottom+e.offset,left:g.left-e.offset}):!1;break a}e=r(p,f)}if(e||t(d,b.options.successClass))b.load(d),c.elements.splice(a,1),c.count--,a--}0===c.count&&b.destroy()}function r(b,c){return b.right>=c.left&&b.bottom>=c.top&&b.left<=c.right&&b.top<=c.bottom}function z(b,c,a){if(!t(b,a.successClass)&&(c||a.loadInvisible||0<b.offsetWidth&&0<b.offsetHeight))if(c=b.getAttribute(u)||b.getAttribute(a.src)){c=c.split(a.separator);var d=c[A&&1<c.length?1:0],e=b.getAttribute(a.srcset),g="img"===b.nodeName.toLowerCase(),p=(c=b.parentNode)&&"picture"===c.nodeName.toLowerCase();if(g||void 0===b.src){var h=new Image,w=function(){a.error&&a.error(b,"invalid");v(b,a.errorClass);k(h,"error",w);k(h,"load",f)},f=function(){g?p||B(b,d,e):b.style.backgroundImage='url("'+d+'")';x(b,a);k(h,"load",f);k(h,"error",w)};p&&(h=b,l(c.getElementsByTagName("source"),function(b){var c=a.srcset,e=b.getAttribute(c);e&&(b.setAttribute("srcset",e),b.removeAttribute(c))}));n(h,"error",w);n(h,"load",f);B(h,d,e)}else b.src=d,x(b,a)}else"video"===b.nodeName.toLowerCase()?(l(b.getElementsByTagName("source"),function(b){var c=a.src,e=b.getAttribute(c);e&&(b.setAttribute("src",e),b.removeAttribute(c))}),b.load(),x(b,a)):(a.error&&a.error(b,"missing"),v(b,a.errorClass))}function x(b,c){v(b,c.successClass);c.success&&c.success(b);b.removeAttribute(c.src);b.removeAttribute(c.srcset);l(c.breakpoints,function(a){b.removeAttribute(a.src)})}function B(b,c,a){a&&b.setAttribute("srcset",a);b.src=c}function t(b,c){return-1!==(" "+b.className+" ").indexOf(" "+c+" ")}function v(b,c){t(b,c)||(b.className+=" "+c)}function E(b){var c=[];b=b.root.querySelectorAll(b.selector);for(var a=b.length;a--;c.unshift(b[a]));return c}function C(b){f.bottom=(window.innerHeight||document.documentElement.clientHeight)+b;f.right=(window.innerWidth||document.documentElement.clientWidth)+b}function n(b,c,a){b.attachEvent?b.attachEvent&&b.attachEvent("on"+c,a):b.addEventListener(c,a,{capture:!1,passive:!0})}function k(b,c,a){b.detachEvent?b.detachEvent&&b.detachEvent("on"+c,a):b.removeEventListener(c,a,{capture:!1,passive:!0})}function l(b,c){if(b&&c)for(var a=b.length,d=0;d<a&&!1!==c(b[d],d);d++);}function D(b,c,a){var d=0;return function(){var e=+new Date;e-d<c||(d=e,b.apply(a,arguments))}}var u,f,A,y;return function(b){if(!document.querySelectorAll){var c=document.createStyleSheet();document.querySelectorAll=function(a,b,d,h,f){f=document.all;b=[];a=a.replace(/\[for\b/gi,"[htmlFor").split(",");for(d=a.length;d--;){c.addRule(a[d],"k:v");for(h=f.length;h--;)f[h].currentStyle.k&&b.push(f[h]);c.removeRule(0)}return b}}var a=this,d=a._util={};d.elements=[];d.destroyed=!0;a.options=b||{};a.options.error=a.options.error||!1;a.options.offset=a.options.offset||100;a.options.root=a.options.root||document;a.options.success=a.options.success||!1;a.options.selector=a.options.selector||".b-lazy";a.options.separator=a.options.separator||"|";a.options.containerClass=a.options.container;a.options.container=a.options.containerClass?document.querySelectorAll(a.options.containerClass):!1;a.options.errorClass=a.options.errorClass||"b-error";a.options.breakpoints=a.options.breakpoints||!1;a.options.loadInvisible=a.options.loadInvisible||!1;a.options.successClass=a.options.successClass||"b-loaded";a.options.validateDelay=a.options.validateDelay||25;a.options.saveViewportOffsetDelay=a.options.saveViewportOffsetDelay||50;a.options.srcset=a.options.srcset||"data-srcset";a.options.src=u=a.options.src||"data-src";y=Element.prototype.closest;A=1<window.devicePixelRatio;f={};f.top=0-a.options.offset;f.left=0-a.options.offset;a.revalidate=function(){q(a)};a.load=function(a,b){var c=this.options;void 0===a.length?z(a,b,c):l(a,function(a){z(a,b,c)})};a.destroy=function(){var a=this._util;this.options.container&&l(this.options.container,function(b){k(b,"scroll",a.validateT)});k(window,"scroll",a.validateT);k(window,"resize",a.validateT);k(window,"resize",a.saveViewportOffsetT);a.count=0;a.elements.length=0;a.destroyed=!0};d.validateT=D(function(){m(a)},a.options.validateDelay,a);d.saveViewportOffsetT=D(function(){C(a.options.offset)},a.options.saveViewportOffsetDelay,a);C(a.options.offset);l(a.options.breakpoints,function(a){if(a.width>=window.screen.width)return u=a.src,!1});setTimeout(function(){q(a)})}});

window.addEventListener('load', function () {
    var bLazy = new Blazy({
        offset: 300
      });
});

!function(){function e(t,i,n){function s(l,r){if(!i[l]){if(!t[l]){var a="function"==typeof require&&require;if(!r&&a)return a(l,!0);if(o)return o(l,!0);var u=new Error("Cannot find module '"+l+"'");throw u.code="MODULE_NOT_FOUND",u}var d=i[l]={exports:{}};t[l][0].call(d.exports,function(e){var i=t[l][1][e];return s(i?i:e)},d,d.exports,e,t,i,n)}return i[l].exports}for(var o="function"==typeof require&&require,l=0;l<n.length;l++)s(n[l]);return s}return e}()({1:[function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};Object.defineProperty(i,"__esModule",{value:!0});var l="function"==typeof Symbol&&"symbol"===o(Symbol.iterator)?function(e){return"undefined"==typeof e?"undefined":o(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":"undefined"==typeof e?"undefined":o(e)},r=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=e("./util/dom"),u=e("./util/throwIfMissing"),d=n(u),c=37,h=39,g="undefined"!=typeof document&&"animation"in document.createElement("div").style,p=function(){function e(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};s(this,e),this._sizeImgWrapperEl=function(){var e=t.imgWrapperEl.style;e.width=t.innerEl.clientWidth+"px",e.maxWidth=t.innerEl.clientWidth+"px",e.height=t.innerEl.clientHeight-t.captionEl.clientHeight+"px",e.maxHeight=t.innerEl.clientHeight-t.captionEl.clientHeight+"px"},this._handleKeydown=function(e){e.keyCode==c?t.showPrevious():e.keyCode==h&&t.showNext()},this.showNext=function(){t.settings._gallery&&(t.currentTrigger=t.settings._gallery.nextTrigger(t.currentTrigger),t._updateImgSrc(),t._updateCaption(),t._sizeImgWrapperEl())},this.showPrevious=function(){t.settings._gallery&&(t.currentTrigger=t.settings._gallery.previousTrigger(t.currentTrigger),t._updateImgSrc(),t._updateCaption(),t._sizeImgWrapperEl())},this._completeOpen=function(){t.el.removeEventListener("animationend",t._completeOpen,!1),(0,a.removeClasses)(t.el,t.openingClasses)},this._completeClose=function(){t.el.removeEventListener("animationend",t._completeClose,!1),(0,a.removeClasses)(t.el,t.openClasses),(0,a.removeClasses)(t.el,t.closingClasses)};var n=i.namespace,o=void 0===n?null:n,l=i.parentEl,r=void 0===l?(0,d["default"])():l,u=i.triggerEl,g=void 0===u?(0,d["default"])():u,p=i.sourceAttribute,f=void 0===p?(0,d["default"])():p,m=i.caption,v=void 0===m?null:m,y=i.includeImgixJSClass,b=void 0!==y&&y,E=i._gallery,_=void 0===E?null:E,C=i._arrowNavigation,w=void 0===C?null:C;if(this.settings={namespace:o,parentEl:r,triggerEl:g,sourceAttribute:f,caption:v,includeImgixJSClass:b,_gallery:_,_arrowNavigation:w},!(0,a.isDOMElement)(this.settings.parentEl))throw new TypeError("`new Lightbox` requires a DOM element passed as `parentEl`.");this.currentTrigger=this.settings.triggerEl,this.openClasses=this._buildClasses("open"),this.openingClasses=this._buildClasses("opening"),this.closingClasses=this._buildClasses("closing"),this.hasBeenLoaded=!1,this.elementBuilt=!1}return r(e,[{key:"_buildClasses",value:function(e){var t=["lum-"+e],i=this.settings.namespace;return i&&t.push(i+"-"+e),t}},{key:"_buildElement",value:function(){this.el=document.createElement("div"),(0,a.addClasses)(this.el,this._buildClasses("lightbox")),this.innerEl=document.createElement("div"),(0,a.addClasses)(this.innerEl,this._buildClasses("lightbox-inner")),this.el.appendChild(this.innerEl);var e=document.createElement("div");(0,a.addClasses)(e,this._buildClasses("lightbox-loader")),this.innerEl.appendChild(e),this.imgWrapperEl=document.createElement("div"),(0,a.addClasses)(this.imgWrapperEl,this._buildClasses("lightbox-image-wrapper")),this.innerEl.appendChild(this.imgWrapperEl);var t=document.createElement("span");(0,a.addClasses)(t,this._buildClasses("lightbox-position-helper")),this.imgWrapperEl.appendChild(t),this.imgEl=document.createElement("img"),(0,a.addClasses)(this.imgEl,this._buildClasses("img")),t.appendChild(this.imgEl),this.captionEl=document.createElement("p"),(0,a.addClasses)(this.captionEl,this._buildClasses("lightbox-caption")),t.appendChild(this.captionEl),this.settings._gallery&&this._setUpGalleryElements(),this.settings.parentEl.appendChild(this.el),this._updateImgSrc(),this._updateCaption(),this.settings.includeImgixJSClass&&this.imgEl.classList.add("imgix-fluid")}},{key:"_setUpGalleryElements",value:function(){this._buildGalleryButton("previous",this.showPrevious),this._buildGalleryButton("next",this.showNext)}},{key:"_buildGalleryButton",value:function(e,t){var i=document.createElement("button");this[e+"Button"]=i,i.innerText=e,(0,a.addClasses)(i,this._buildClasses(e+"-button")),(0,a.addClasses)(i,this._buildClasses("gallery-button")),this.innerEl.appendChild(i),i.addEventListener("click",function(e){e.stopPropagation(),t()},!1)}},{key:"_updateCaption",value:function(){var e=l(this.settings.caption),t="";"string"===e?t=this.settings.caption:"function"===e&&(t=this.settings.caption(this.currentTrigger)),this.captionEl.innerHTML=t}},{key:"_updateImgSrc",value:function(){var e=this,t=this.currentTrigger.getAttribute(this.settings.sourceAttribute);if(!t)throw new Error("No image URL was found in the "+this.settings.sourceAttribute+" attribute of the trigger.");var i=this._buildClasses("loading");this.hasBeenLoaded||(0,a.addClasses)(this.el,i),this.imgEl.onload=function(){(0,a.removeClasses)(e.el,i),e.hasBeenLoaded=!0},this.imgEl.setAttribute("src",t)}},{key:"open",value:function(){this.elementBuilt||(this._buildElement(),this.elementBuilt=!0),this.currentTrigger=this.settings.triggerEl,this._updateImgSrc(),this._updateCaption(),(0,a.addClasses)(this.el,this.openClasses),this._sizeImgWrapperEl(),window.addEventListener("resize",this._sizeImgWrapperEl,!1),this.settings._arrowNavigation&&window.addEventListener("keydown",this._handleKeydown,!1),g&&(this.el.addEventListener("animationend",this._completeOpen,!1),(0,a.addClasses)(this.el,this.openingClasses))}},{key:"close",value:function(){window.removeEventListener("resize",this._sizeImgWrapperEl,!1),this.settings._arrowNavigation&&window.removeEventListener("keydown",this._handleKeydown,!1),g?(this.el.addEventListener("animationend",this._completeClose,!1),(0,a.addClasses)(this.el,this.closingClasses)):(0,a.removeClasses)(this.el,this.openClasses)}},{key:"destroy",value:function(){this.el&&this.settings.parentEl.removeChild(this.el)}}]),e}();i["default"]=p},{"./util/dom":6,"./util/throwIfMissing":7}],2:[function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o,l,r,a=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),u=e("./util/dom"),d=e("./injectBaseStylesheet"),c=n(d),h=e("./Lightbox"),g=n(h);t.exports=(l=o=function(){function e(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(s(this,e),r.call(this),this.isOpen=!1,this.trigger=t,!(0,u.isDOMElement)(this.trigger))throw new TypeError("`new Luminous` requires a DOM element as its first argument.");var n=i.namespace,o=void 0===n?null:n,l=i.sourceAttribute,a=void 0===l?"href":l,d=i.caption,h=void 0===d?null:d,g=i.openTrigger,p=void 0===g?"click":g,f=i.closeTrigger,m=void 0===f?"click":f,v=i.closeWithEscape,y=void 0===v||v,b=i.closeOnScroll,E=void 0!==b&&b,_=i.appendToSelector,C=void 0===_?"body":_,w=i.onOpen,x=void 0===w?null:w,S=i.onClose,L=void 0===S?null:S,O=i.includeImgixJSClass,T=void 0!==O&&O,k=i.injectBaseStyles,I=void 0===k||k,M=i._gallery,N=void 0===M?null:M,W=i._arrowNavigation,B=void 0===W?null:W;this.settings={namespace:o,sourceAttribute:a,caption:h,openTrigger:p,closeTrigger:m,closeWithEscape:y,closeOnScroll:E,appendToSelector:C,onOpen:x,onClose:L,includeImgixJSClass:T,injectBaseStyles:I,_gallery:N,_arrowNavigation:B},this.settings.injectBaseStyles&&(0,c["default"])(),this._buildLightbox(),this._bindEvents()}return a(e,[{key:"_buildLightbox",value:function(){this.lightbox=new g["default"]({namespace:this.settings.namespace,parentEl:document.querySelector(this.settings.appendToSelector),triggerEl:this.trigger,sourceAttribute:this.settings.sourceAttribute,caption:this.settings.caption,includeImgixJSClass:this.settings.includeImgixJSClass,_gallery:this.settings._gallery,_arrowNavigation:this.settings._arrowNavigation})}},{key:"_bindEvents",value:function(){this.trigger.addEventListener(this.settings.openTrigger,this.open,!1),this.settings.closeWithEscape&&window.addEventListener("keyup",this._handleKeyup,!1)}},{key:"_bindCloseEvent",value:function(){this.lightbox.el.addEventListener(this.settings.closeTrigger,this.close,!1)}},{key:"_unbindEvents",value:function(){this.trigger.removeEventListener(this.settings.openTrigger,this.open,!1),this.lightbox.el&&this.lightbox.el.removeEventListener(this.settings.closeTrigger,this.close,!1),this.settings.closeWithEscape&&window.removeEventListener("keyup",this._handleKeyup,!1)}}]),e}(),r=function(){var e=this;this.VERSION="2.0.0",this.open=function(t){t&&"function"==typeof t.preventDefault&&t.preventDefault();var i=e.lightbox.elementBuilt;e.lightbox.open(),i||e._bindCloseEvent(),e.settings.closeOnScroll&&window.addEventListener("scroll",e.close,!1);var n=e.settings.onOpen;n&&"function"==typeof n&&n(),e.isOpen=!0},this.close=function(t){t&&"function"==typeof t.preventDefault&&t.preventDefault(),e.settings.closeOnScroll&&window.removeEventListener("scroll",e.close,!1),e.lightbox.close();var i=e.settings.onClose;i&&"function"==typeof i&&i(),e.isOpen=!1},this._handleKeyup=function(t){e.isOpen&&27===t.keyCode&&e.close()},this.destroy=function(){e._unbindEvents(),e.lightbox.destroy()}},l)},{"./Lightbox":1,"./injectBaseStylesheet":4,"./util/dom":6}],3:[function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var o=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),l=(e("./util/dom"),e("./Luminous")),r=n(l),a=function(){function e(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};s(this,e),this.boundMethod=function(){};var o=i.arrowNavigation,l=void 0===o||o;this.settings={arrowNavigation:l},this.triggers=t,this.luminousOpts=n,this.luminousOpts._gallery=this,this.luminousOpts._arrowNavigation=this.settings.arrowNavigation,this._constructLuminousInstances()}return o(e,[{key:"_constructLuminousInstances",value:function(){this.luminousInstances=[];for(var e=this.triggers.length,t=0;t<e;t++){var i=this.triggers[t],n=new r["default"](i,this.luminousOpts);this.luminousInstances.push(n)}}},{key:"nextTrigger",value:function(e){var t=Array.prototype.indexOf.call(this.triggers,e)+1;return t>=this.triggers.length?this.triggers[0]:this.triggers[t]}},{key:"previousTrigger",value:function(e){var t=Array.prototype.indexOf.call(this.triggers,e)-1;return t<0?this.triggers[this.triggers.length-1]:this.triggers[t]}},{key:"destroy",value:function(){}}]),e}();i["default"]=a},{"./Luminous":2,"./util/dom":6}],4:[function(e,t,i){"use strict";function n(){if(!document.querySelector(".lum-base-styles")){var e=document.createElement("style");e.type="text/css",e.classList.add("lum-base-styles"),e.appendChild(document.createTextNode(s));var t=document.head;t.insertBefore(e,t.firstChild)}}Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=n;var s="\n@keyframes lum-noop {\n  0% { zoom: 1; }\n}\n\n.lum-lightbox {\n  position: fixed;\n  display: none;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.lum-lightbox.lum-open {\n  display: block;\n}\n\n.lum-lightbox.lum-opening, .lum-lightbox.lum-closing {\n  animation: lum-noop 1ms;\n}\n\n.lum-lightbox-inner {\n  position: absolute;\n  top: 0%;\n  right: 0%;\n  bottom: 0%;\n  left: 0%;\n\n  overflow: hidden;\n}\n\n.lum-lightbox-loader {\n  display: none;\n}\n\n.lum-lightbox-inner img {\n  max-width: 100%;\n  max-height: 100%;\n}\n\n.lum-lightbox-image-wrapper {\n  vertical-align: middle;\n  display: table-cell;\n  text-align: center;\n}\n"},{}],5:[function(e,t,i){(function(t){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}var n=e("./Luminous"),s=i(n),o=e("./LuminousGallery"),l=i(o);t.Luminous=s["default"],t.LuminousGallery=l["default"]}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./Luminous":2,"./LuminousGallery":3}],6:[function(e,t,i){"use strict";function n(e){return a?e instanceof HTMLElement:e&&"object"===("undefined"==typeof e?"undefined":r(e))&&null!==e&&1===e.nodeType&&"string"==typeof e.nodeName}function s(e,t){t.forEach(function(t){e.classList.add(t)})}function o(e,t){t.forEach(function(t){e.classList.remove(t)})}var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};Object.defineProperty(i,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"===l(Symbol.iterator)?function(e){return"undefined"==typeof e?"undefined":l(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":"undefined"==typeof e?"undefined":l(e)};i.isDOMElement=n,i.addClasses=s,i.removeClasses=o;var a="object"===("undefined"==typeof HTMLElement?"undefined":r(HTMLElement))},{}],7:[function(e,t,i){"use strict";function n(){throw new Error("Missing parameter")}Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=n},{}]},{},[5]);