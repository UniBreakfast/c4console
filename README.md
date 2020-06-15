# c4console for NodeJS
### just `"npm i c4console"` and then `require('c4console')`
#### (don't bother saving to the variable - it returns nothing)
## versions for the browsers are [here (readable)](https://greasyfork.org/en/scripts/405385-c4console) and [here (minified)](https://greasyfork.org/en/scripts/405348-c4console-min)
### to use those you need the [ViolentMonkey extension](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en) or a similar one

Chainable any_value.c() for console.log(value) && return value in-place! MUCH more convenient than console.log(...) w/o vars or debugger when all you need is to see what's there at a point. Try it with promises! Also adds c(...args) function that are similar to console.log but returns what was passed into it as well.

Browser versions also can autoenable/disable themselves on any page, show DOM elements as objects, preview fetch response body (as text, parsed json or image - yes, images are shown in console).
