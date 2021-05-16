/*
MIT License

Copyright (c) 2021 nab622

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
    --1--
  |       |
  2   8   3
  |       |
    --4--
  |       |
  5   9   6
  |       |
    --7--  0 (Zero)
*/

sevenSegCharacters = {
	// Each entry in this object should be filled with an array of numbers, corresponding to the segments that must be lit up for that character
	'0':	[ 1, 2, 3, 5, 6, 7 ],
	'1':	[ 3, 6 ],
	'2':	[ 1, 3, 4, 5, 7 ],
	'3':	[ 1, 3, 4, 6, 7 ],
	'4':	[ 2, 3, 4, 6 ],
	'5':	[ 1, 2, 4, 6, 7 ],
	'6':	[ 2, 4, 5, 6, 7 ],
	'7':	[ 1, 3, 6 ],
	'8':	[ 1, 2, 3, 4, 5, 6, 7 ],
	'9':	[ 1, 2, 3, 4, 6, 7 ],
	'.':	[ 0 ],
	'~':	[ 1 ],
	'-':	[ 4 ],
	'_':	[ 7 ],
	'=':	[ 4, 7 ],
	'`':	[ 2 ],
	'/':	[ 4, 8, 9 ],
	':':	[ 8, 9 ],
	'\'':	[ 3 ],
	'"':	[ 2, 3 ],
	'|':	[ 2, 5 ],
	'[':	[ 1, 2, 5, 7 ],
	']':	[ 1, 3, 6, 7 ],
	'A':	[ 1, 2, 3, 4, 5, 6 ],
	'B':	[ 2, 4, 5, 6, 7 ],
	'C':	[ 1, 2, 5, 7 ],
	'D':	[ 3, 4, 5, 6, 7 ],
	'E':	[ 1, 2, 4, 5, 7 ],
	'F':	[ 1, 2, 4, 5 ],
	'G':	[ 1, 2, 5, 6, 7 ],
	'H':	[ 2, 3, 4, 5, 6 ],
	'I':	[ 3, 6 ],
	'J':	[ 3, 5, 6, 7 ],
//	'K':	[ 2, 5, 8, 9 ],	//Doesn't really look much like a K...
	'L':	[ 2, 5, 7 ],
//	'M':	[  ],
	'N':	[ 4, 5, 6 ],
	'O':	[ 4, 5, 6, 7 ],
	'P':	[ 1, 2, 3, 4, 5 ],
	'Q':	[ 1, 2, 3, 4, 6 ],
	'R':	[ 4, 5 ],
	'S':	[ 1, 2, 4, 6, 7 ],
//	'T':	[ 1, 8, 9 ],	//Doesn't really look much like a T...
	'U':	[ 2, 3, 5, 6, 7 ],
//	'V':	[  ],
//	'W':	[  ],
//	'X':	[  ],
	'Y':	[ 2, 3, 4, 6, 7 ],
//	'Z':	[  ],
}

function sevenSegJoin(charList) {
	output = []
	for (key in charList) {
		output.push(key)
	}
	return output.join('')
}

function sevenSegCloneArray(inputArray) {
	// We have to do this because arrays are copied by reference - and we CANNOT do that, since we'll be modifying them!
	return [].concat(inputArray)
}

function sevenSegParseRenderString(inputObject) {
	output = []

	inputString = sevenSegGetValue(inputObject, 'value', '')
	if(typeof(inputString) != "string") {
		inputString = inputString.toString()
	}
	inputString = inputString.toUpperCase()

	numDigits = sevenSegGetNumericValue(inputObject, 'numDigits', -1)

	align = sevenSegGetValue(inputObject, 'align', 'right')
	align = align.toLowerCase()

	i = 0
	while((numDigits > 0 && output.length < numDigits && i < inputString.length ) || (numDigits <= 0 && i < inputString.length)) {
		segmentList = []

		if(inputString[i] == '{') {
			i++
			while(inputString[i] != '}' && i < inputString.length) {
				segmentList.push(inputString[i])
				i++
			}
		} else {
			segmentList = sevenSegCloneArray(sevenSegGetValue(sevenSegCharacters, inputString[i], []))
		}

		i++
		// If the next character is a period, we need to add it to the current character and skip the next one
		if(i < inputString.length) {
			if(!sevenSegContainedIn(segmentList, 0)) {
				test = sevenSegGetValue(sevenSegCharacters, inputString[i], [])
				if(test.length == 1 && test[0] == 0) {
					segmentList.push(0)
					i++
				}
			}
		}
		output.push({ 'segments': segmentList })
	}

	// Pad the output to match the correct length
	while(output.length < numDigits) {
		if(align == 'right') {
			output.unshift({ 'segments': [] })
		} else {
			output.push({ 'segments': [] })
		}
	}

	return output
}

function sevenSegClearElement(e) {
	for (let i = e.children.length - 1; i >= 0; i--)
	{
		let c = e.children[i]
		e.removeChild(c)
	}
}

function sevenSegSplitString(inputString) {
	let output = []
	let i = 0

	while(i < inputString.length) {
		let temp = ''

		if(inputString[i] == '.') {
			temp += inputString[i]
		} else {
			if(inputString[i] == '{') {
				while(inputString[i] != '}' && i < inputString.length) {
					temp += inputString[i]
					i++
				}
				temp = temp + '}'
			} else {
				temp += inputString[i]
			}

			if(i + 1 < inputString.length && inputString[i + 1] == '.') {
				i++
				temp += inputString[i]
			}
		}
		output.push(temp)
		i++
	}

	return output
}

function sevenSegCounter(displayObject, increment, delay) {
	// inputObject must be the same object that is used to render a 7seg normally
	// increment is the amount that will be added with each iteration
	// delay is the number of milliseconds between iterations

	sevenSegDraw(displayObject)
	displayObject.value += increment
	setTimeout(()=>{ sevenSegCounter(displayObject, increment, delay) }, delay)
}

function sevenSegAnimate(inputObject, animation, delay, count = 0) {
	// inputObject must be the same object that is used to render a 7seg normally
	// animation must be an array of values you want the 7seg to display, starting with the first one
	// delay is the number of milliseconds each animation frame will last

	// Enforce a minimum value here so we don't get stuck
	if(delay < 10) delay = 10

	count %= animation.length

	inputObject.value = animation[count]
	sevenSegDraw(inputObject)
	setTimeout(()=>{sevenSegAnimate(inputObject, animation, delay, count + 1)}, delay)
}

function sevenSegMarquee(inputObject, delay, reverse = false) {
	// inputObject must be the same object that is used to render a 7seg normally
	// delay is the number of milliseconds each animation frame will last

	// Enforce a minimum value here so we don't get stuck
	if(delay < 10) delay = 10

	sevenSegDraw(inputObject)
	if(inputObject.value.length > 0) {
		temp = sevenSegSplitString(inputObject.value)
		if(reverse == true) {
			temp.unshift(temp.pop())
		} else {
			temp.push(temp.shift())
		}

		inputObject.value = temp.join('')
		setTimeout(()=>{sevenSegMarquee(inputObject, delay, reverse)}, delay)
	}
}

function sevenSegCreateElement(inputValues)
{
	let new_element = null
	if(inputValues && inputValues.elementType)
	{
		new_element = document.createElement(inputValues.elementType)
		for (var key in inputValues)
		{
			switch(key) {
				case 'elementType':
					continue
				case 'style':
					for(let styleKey in inputValues.style)
					{
							 new_element.style[styleKey] = inputValues.style[styleKey]
					}
					break
				case 'text':
					if(inputValues.elementType == 'div')
					{
						let text_element = document.createElement('span')
						text_element.appendChild(document.createTextNode(inputValues[key]))
						new_element.appendChild(text_element)
					}
					else
					{
						new_element.appendChild(document.createTextNode(inputValues[key]))
					}
					break
				case 'children':
					for (let i = 0; i < inputValues.children.length; i++) {
						new_element.appendChild(sevenSegCreateElement(inputValues.children[i]))
					}
					break
				default:
					new_element[key] = inputValues[key]
			}
		}
	}
	return new_element
}

function sevenSegContainedIn(haystack, needle) {
	if(!haystack) return false
	for(let i = 0; i < haystack.length; i++) {
		if(needle == haystack[i]) {
			return true
		}
	}
	return false
}

function sevenSegPercent(inputValue) {
	return inputValue.toString() + '%'
}

function sevenSegGetValue(inputObject, getThisValue, defaultValue) {
	if(inputObject[getThisValue]) {
		return inputObject[getThisValue]
	}
	return defaultValue
}

function sevenSegGetNumericValue(inputObject, getThisValue, defaultValue) {
	if(inputObject[getThisValue]  && !isNaN(inputObject[getThisValue]) && inputObject[getThisValue] > 0 ) {
		return inputObject[getThisValue]
	}
	return defaultValue
}

function sevenSegDraw(displayObject){
	renderObjects = []

	element = displayObject.parentElementID
	sevenSegClearElement(element)

	// These values are all percentages, based off of the COLUMN SIZE.
	// The row size will calculate values based on these and the aspect ratio
	lineSize = sevenSegGetNumericValue(displayObject, 'lineSize', 10)				// The width of the lines in the 7seg
	paddingSize = sevenSegGetNumericValue(displayObject, 'paddingSize', 3)						// The amount of padding between elements
	borderPadding = sevenSegGetNumericValue(displayObject, 'borderPadding', 15)		// The amount of padding at the outer edge of the element

	renderArray = sevenSegParseRenderString(displayObject)

	totalDigits = renderArray.length

	if(displayObject.align && displayObject.align.toLowerCase() == 'right') {
		alignment = 'right'
	} else {
		alignment = 'left'
	}


	defaultRenderHeight = 90
	defaultAspectRatio = 2 / 3

	renderHeight = sevenSegGetNumericValue(displayObject, 'height', defaultRenderHeight)		//Must be in pixels!
	renderWidth = sevenSegGetNumericValue(displayObject, 'width', renderHeight * defaultAspectRatio)	//Must be in pixels! Also, use renderHeight here, not defaultRenderHeight
	aspectRatio = renderWidth / renderHeight		// Aspect ratio (Width divided by height)

	// Apply the width and height to the element we are populating
	element.style.width = renderWidth * totalDigits + 'px'
	element.style.height = renderHeight + 'px'

	backgroundColor = sevenSegGetValue(displayObject, 'backgroundColor', '#000')
	element.style.backgroundColor = backgroundColor
	element.style.display = 'flex'

	centerColumnWidth = (100 - ((lineSize * 3) + (paddingSize * 2) + (borderPadding * 2))) / 2
	gridTemplateColumns = []
	gridTemplateColumns.push(sevenSegPercent(borderPadding))
	gridTemplateColumns.push(sevenSegPercent(lineSize))
	gridTemplateColumns.push(sevenSegPercent(paddingSize))
	gridTemplateColumns.push(sevenSegPercent(centerColumnWidth))
	gridTemplateColumns.push(sevenSegPercent(lineSize))
	gridTemplateColumns.push(sevenSegPercent(centerColumnWidth))
	gridTemplateColumns.push(sevenSegPercent(paddingSize))
	gridTemplateColumns.push(sevenSegPercent(lineSize))
	gridTemplateColumns.push(sevenSegPercent(borderPadding))
	gridTemplateColumns = gridTemplateColumns.join(' ')

	// Convert these to be used on the rows
	rowLineSize = lineSize * aspectRatio
	rowPaddingSize = paddingSize * aspectRatio
	rowBorderPadding = borderPadding * aspectRatio

	lineHeight = (100 - ((rowLineSize * 5) + (rowPaddingSize * 4) + (rowBorderPadding * 2))) / 4
	gridTemplateRows = []
	gridTemplateRows.push(sevenSegPercent(rowBorderPadding))
	gridTemplateRows.push(sevenSegPercent(rowLineSize))
	gridTemplateRows.push(sevenSegPercent(rowPaddingSize))
	gridTemplateRows.push(sevenSegPercent(lineHeight))
	gridTemplateRows.push(sevenSegPercent(rowLineSize))
	gridTemplateRows.push(sevenSegPercent(lineHeight))
	gridTemplateRows.push(sevenSegPercent(rowPaddingSize))
	gridTemplateRows.push(sevenSegPercent(rowLineSize))
	gridTemplateRows.push(sevenSegPercent(rowPaddingSize))
	gridTemplateRows.push(sevenSegPercent(lineHeight))
	gridTemplateRows.push(sevenSegPercent(rowLineSize))
	gridTemplateRows.push(sevenSegPercent(lineHeight))
	gridTemplateRows.push(sevenSegPercent(rowPaddingSize))
	gridTemplateRows.push(sevenSegPercent(rowLineSize))
	gridTemplateRows.push(sevenSegPercent(rowBorderPadding))
	gridTemplateRows = gridTemplateRows.join(' ')

	customClassName = sevenSegGetValue(displayObject, 'className', '')
	customActiveClassName = sevenSegGetValue(displayObject, 'activeClassName', '')

	for(let i = 0; i < renderArray.length; i++) {
		renderCharacter = renderArray[i]

		newDisplay = { elementType: 'div',
		style : {
			'display': 'grid',
			'grid-template-columns': gridTemplateColumns,
			'grid-template-rows': gridTemplateRows,
			'grid-gap': '0%',
			'width': '100%',
			'height': '100%',
			'overflow': 'hidden',
			},
		children: [] }

		let segmentColor = sevenSegGetValue(displayObject, 'color', '#F00')

		// These objects are used for the styles on the HTML elements
		let sevenSegLights =	{ 'background-color': segmentColor, 'margin': 0, 'padding': 0 }
		let sevenSegActive =	{ 'background-image': 'radial-gradient(15px, #0000 0%, #0002 100%)' }
		let sevenSegInactive =	{ 'background-image': 'radial-gradient(15px, #000000E5 0%, #000000F0 100%)' }

		let glowAmount = 0
		glowAmount = sevenSegGetNumericValue(displayObject, 'glow', renderHeight * defaultAspectRatio * (lineSize / 100) / 2)
		if(glowAmount > 0) {
			Object.assign(sevenSegActive, { 'boxShadow' : '0px 0px ' + glowAmount + 'px ' + segmentColor })
		}

		let segment1 = { 'gridColumn': '4 / span 3', 'gridRow': '2 / span 1' }
		let segment2 = { 'gridColumn': '2 / span 1', 'gridRow': '4 / span 3' }
		let segment3 = { 'gridColumn': '8 / span 1', 'gridRow': '4 / span 3' }
		let segment4 = { 'gridColumn': '4 / span 3', 'gridRow': '8 / span 1' }
		let segment5 = { 'gridColumn': '2 / span 1', 'gridRow': '10 / span 3' }
		let segment6 = { 'gridColumn': '8 / span 1', 'gridRow': '10 / span 3' }
		let segment7 = { 'gridColumn': '4 / span 3', 'gridRow': '14 / span 1' }
		let segment8 = { 'gridColumn': '5 / span 1', 'gridRow': '5 / span 1' }
		let segment9 = { 'gridColumn': '5 / span 1', 'gridRow': '11 / span 1' }
		let segment0 = { 'gridColumn': '8 / span 1', 'gridRow': '14 / span 1' }

		let segment1on = false
		let segment2on = false
		let segment3on = false
		let segment4on = false
		let segment5on = false
		let segment6on = false
		let segment7on = false
		let segment8on = false
		let segment9on = false
		let segment0on = false

		if(sevenSegContainedIn(renderCharacter.segments, 1)) segment1on = true
		if(sevenSegContainedIn(renderCharacter.segments, 2)) segment2on = true
		if(sevenSegContainedIn(renderCharacter.segments, 3)) segment3on = true
		if(sevenSegContainedIn(renderCharacter.segments, 4)) segment4on = true
		if(sevenSegContainedIn(renderCharacter.segments, 5)) segment5on = true
		if(sevenSegContainedIn(renderCharacter.segments, 6)) segment6on = true
		if(sevenSegContainedIn(renderCharacter.segments, 7)) segment7on = true
		if(sevenSegContainedIn(renderCharacter.segments, 8)) segment8on = true
		if(sevenSegContainedIn(renderCharacter.segments, 9)) segment9on = true
		if(sevenSegContainedIn(renderCharacter.segments, 0)) segment0on = true

		Object.assign( segment1, sevenSegLights, ((segment1on) ? sevenSegActive : sevenSegInactive ), ((segment1on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ), displayObject.style )
		Object.assign( segment2, sevenSegLights, ((segment2on) ? sevenSegActive : sevenSegInactive ), ((segment2on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ), displayObject.style )
		Object.assign( segment3, sevenSegLights, ((segment3on) ? sevenSegActive : sevenSegInactive ), ((segment3on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ), displayObject.style )
		Object.assign( segment4, sevenSegLights, ((segment4on) ? sevenSegActive : sevenSegInactive ), ((segment4on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ), displayObject.style )
		Object.assign( segment5, sevenSegLights, ((segment5on) ? sevenSegActive : sevenSegInactive ), ((segment5on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ), displayObject.style )
		Object.assign( segment6, sevenSegLights, ((segment6on) ? sevenSegActive : sevenSegInactive ), ((segment6on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ), displayObject.style )
		Object.assign( segment7, sevenSegLights, ((segment7on) ? sevenSegActive : sevenSegInactive ), ((segment7on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ), displayObject.style )
		Object.assign( segment8, sevenSegLights, displayObject.style, { 'border-radius': '100%' }, ((segment8on) ? sevenSegActive : sevenSegInactive ), ((segment8on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ),  )
		Object.assign( segment9, sevenSegLights, displayObject.style, { 'border-radius': '100%' }, ((segment9on) ? sevenSegActive : sevenSegInactive ), ((segment9on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ),  )
		Object.assign( segment0, sevenSegLights, displayObject.style, { 'border-radius': '100%', 'transform': 'translate(75%, 25%)' }, ((segment0on) ? sevenSegActive : sevenSegInactive ), ((segment0on) ? sevenSegGetValue(displayObject, 'activeStyle', {}) : {} ),  )

		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment1, className: customClassName + ((segment1on) ? customActiveClassName: '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment2, className: customClassName + ((segment2on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment3, className: customClassName + ((segment3on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment4, className: customClassName + ((segment4on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment5, className: customClassName + ((segment5on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment6, className: customClassName + ((segment6on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment7, className: customClassName + ((segment7on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment8, className: customClassName + ((segment8on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment9, className: customClassName + ((segment9on) ? customActiveClassName : '') })
		newDisplay.children = newDisplay.children.concat({ elementType: 'div', style: segment0, className: customClassName + ((segment0on) ? customActiveClassName : '') })

		element.appendChild(sevenSegCreateElement(newDisplay))
	}
}
