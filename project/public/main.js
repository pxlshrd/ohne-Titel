let title = 'time leaves dust'
let fPressed = false
let dPressed = false
let touchCount = 0
let saveTimeout
let saving = false
let closeLastRhombus = false
let isFirstIteration = true
let pxlswp
let pg
let dissolve = false
let shaderAnimationTime = 0.0
let canvasSize
let adaptiveCanvasSize = false
let isMuted = false
let currentGain = -60
let targetGain = -0.7
let rampTime = 2.5

let startTime
let timeDisplay

function setup() {
	const pxlDens = 1
	const w = 1500
	const h = 2000
	pxldrw(pxlDens, w, h)
}

function pxldrw(pxlDens, w, h) {
	fxrandminter = sfc32(...hashes)
	const seed = fxrandminter() * $fx.getParam("seeds")
	randomSeed(seed)
	noiseSeed(seed)
	counter = 0
	stopCounter = false

	createCanvas(w, h)
	overl = createGraphics(w, h)
	pg = createGraphics(w, h)
	scribbles = createGraphics(w, h)
	printingCan = createGraphics(w, h)
	polyOutTop = createGraphics(w, h)
	combinedBuffer = createGraphics(w, h)
	canvasSize = createVector(width, height)

	noiseDet = int(random(2, 5))
	noiseDetFallOff = 0.5
	noiseDetTexture = 6
	noiseDetTexFallOff = 0.99
	noiseDetail(noiseDet, noiseDetFallOff)

	pixelDensity(pxlDens)
	pg.pixelDensity(pxlDens)
	scribbles.pixelDensity(pxlDens)
	overl.pixelDensity(pxlDens)
	printingCan.pixelDensity(pxlDens)
	polyOutTop.pixelDensity(pxlDens)
	combinedBuffer.pixelDensity(pxlDens)

	colorMode(HSB)
	overl.colorMode(HSB)
	pg.colorMode(HSB)
	scribbles.colorMode(HSB)
	printingCan.colorMode(HSB)
	polyOutTop.colorMode(HSB)
	combinedBuffer.colorMode(HSB)

	strokeCap(ROUND)
	frameRate(120)

	getColors()

	initVars()

	background(hue(backCol), saturation(backCol), brightness(backCol))

	sdfFoundation()

	drawPolyOutlines()
	µziq()

	startTime = millis()
	timeDisplay = createP()
	timeDisplay.position(windowWidth - 150, 20)
	timeDisplay.style("color", "black")
	timeDisplay.style("font-size", "16px")

}

function draw() {
	// translate(-width / 2, -height / 2)
	
	if (!dissolve) {

		resetShader()
		y = 50 + counter * gridSize
		if (counter < 1) {
			drawAsemic()
			printing(printX, printY, printsz)
		}

		if (counter < 30 && !dPressed) {
			pencilArcDraw()
		}

		if (counter > 20 && !stopCounter && !dPressed && counter % 12 === 0) {
			brushes()
		}


		if (!stopCounter) {
			background(hue(backCol), saturation(backCol), brightness(backCol))
			limbic(width / 2, height / 2, 1000, 50)
			image(pg, 0, height - (100 + counter * gridSize), width, height)


			printingCan.fill(col3)
			typoPencilPigments(printX - printsz * 4 + counter * 2.2, printY + printsz * 1.1 + random(-50, 10), random(1, 4))
			image(printingCan, 0, height - (100 + counter * 1.2 * gridSize), width, height)
			drawComposition()

			sprayWalk()

		}

		if (y > height - 50) {
			stopCounter = true
			noLoop()
			// drawAsemicEraser()
			if (!dPressed) {
				for (i = 0; i < 50; i++) {
					texX = random(width)
					texY = random(height)
					smallSprayLine(texX, texY, texX + random(-500, 500), texY + random(-500, 500), random(1, 10))
				}
				image(scribbles, 0, 0, width, height)

				drawPolyOutlinesTop()
				image(polyOutTop, 0, 0)


			}

			if (pixelDensity() <= 3 && !dPressed) {
				tex()
				push()
				blendMode(BLEND)
				tint(0, 0, 100, opacNoiseGlobal)
				image(overl, 0, 0, width, height)
				pop()
				grain(10)
			} else if (!dPressed) {
				tex()
			}
			combinedBuffer.image(get(), 0, 0, width, height)
			fxpreview()

			if (pixelDensity() <= 3 && pixelDensity() > 1) {
				saveCanvas(title + "_" + $fx.getParam("seeds") + ".jpg")
			} else if (pixelDensity() > 3) {
				saveCanvas(title + "_" + $fx.getParam("seeds") + ".png")
				saveCanvas(title + "_" + $fx.getParam("seeds") + ".jpg")
			}
		}

		let endTime = millis()
		let elapsedTime = (endTime - startTime) / 1000
		displayTime(elapsedTime)
		counter++
	} else {
		
		Tone.Transport.start()
		dynamicVarsAudio()
	
		shader(pxlswp)

		// Update shader uniforms
		pxlswp.setUniform('u_time', millis() / 1000.0)
		pxlswp.setUniform('u_canvasSize', [canvasSize.x, canvasSize.y])
		pxlswp.setUniform('u_image', combinedBuffer)
		pxlswp.setUniform('u_rndPos', aniNoiseRnd)

		noStroke()
		rect(-width / 2, -height / 2, width, height);

	}
}

function initVars() {
	polygon = []
	gridSize = 8
	cnt = height - width / 30
	orbDrawStart = random(0, 10)
	wobble = random() < 0.05 ? 200 : random([30, 40, 50, 100])
	insanity = random() < 0.05 ? 1000 : 50
	limit = random() < 0.8 ? 0 : 2

	lengthOutside = random(width / 8, width / 5)

	minDist = Infinity
	nearestPolygon = null
	insidePolygon = false
	insideBigCircle = false
	bigCircRad = random()

	concentricPolyCenter = random()

	repellorInfluence = [
		[0, 30],
		[2, 68],
		[20, 2]
	]
	repInfl = weightedRnd(repellorInfluence)

	brushDir = random()

	crayonSize = [
		[4, 10],
		[6, 20],
		[8, 70]
	]
	crayonSz = weightedRnd(crayonSize)

	waveAngle = random(TWO_PI)
	dotWaveFreq = random(0.001, 0.05)
	dotWaveAmp = random(10, 50)
	dotWaveThick = random(50, 250)
	dotWaveStretch = random([HALF_PI, TWO_PI])

	dotWaveFreq2 = random(0.005, 0.01)
	dotWaveAmp2 = random(10, 30)
	dotWaveThick2 = random(100, 250)

	vari1 = random(0, 4)
	vari2 = random(0, 4)
	vari3 = random(0, 4)
	vari4 = random(0, 4)
	vari5 = random(0, 4)
	vari6 = random(0, 4)
	vari7 = random(0, 4)

	printX = width / 2
	printY = 200
	printsz = 70
	walkX = random(width)
	walkY = random(height)

	aniNoiseRnd = Math.random() * 1000
}

function drawComposition() {

	for (let x = 50; x < width - 50; x += gridSize) {
		minDist = Infinity
		nearestPolygon = null
		insidePolygon = false
		insideBigCircle = false
		distToPolygon = isPip(x, y, polygon)

		if (distToPolygon < minDist) {
			minDist = distToPolygon
			nearestPolygon = polygon
			insidePolygon = isPip(x, y, polygon)

		}

		distToBigCircle = dist(x, y, bigCircle.center.x, bigCircle.center.y) - bigCircle.radius
		if (distToBigCircle < minDist) {
			minDist = distToBigCircle
			insideBigCircle = (distToBigCircle <= 0)
		}

		if (!insidePolygon && !insideBigCircle && random() < 0.7) {
			if (!dPressed) {
				dotHalftone(x, y, random(2, 3))
			} else {
				pg.push()
				pg.noStroke()
				pg.fill(backCol)
				pg.rect(x, y, random(2, 5))
				pg.pop()
			}
		}


		if (insideBigCircle) {
			if (!dPressed) {
				drawOrb(x, y, wobble)
				orbOutline(bigCircle.center.x, bigCircle.center.y, bigCircle.radius)
			} else {
				rectz(x, y, random(8, 10))
			}
		}


		if (!insideBigCircle) {

			if (!dPressed) {
				if (random() < 0.3) {
					const closestPoint = closestPointOnPolygon(x, y, nearestPolygon)
					const lineLength = dist(x, y, closestPoint.x, closestPoint.y)
					const smoothEdging = random(-30, 30)
					if (lineLength > lengthOutside + smoothEdging) {
						if (counter % limit) {
							crayonLine(x, y, closestPoint.x, closestPoint.y, wobble)
						}
					} else {
						crayonLine(x, y, closestPoint.x, closestPoint.y, wobble)
					}
				}
			} else {
				const closestPoint = closestPointOnPolygon(x, y, nearestPolygon)
				const lineLength = dist(x, y, closestPoint.x, closestPoint.y)
				if (lineLength > 300) {
					if (counter % limit) {
						digitalLine(x, y, closestPoint.x, closestPoint.y, wobble)
					}
				} else {
					digitalLine(x, y, closestPoint.x, closestPoint.y, wobble)
				}
			}
		}
	}
}

function sdfFoundation() {
	compositionChoice = random()
	rectHor = false
	rectVert = false
	rectCollision = false
	rndRectGrid = false
	spiral = false
	concentric = false
	rhombuses = false
	polyGrid = false
	poly3 = false
	polyChaos = false


	// duplicateAvoidX = map(Math.random(), 0, 1, -50, 50)
	// duplicateAvoidY = map(Math.random(), 0, 1, -50, 50)
	if (bigCircRad < 0.01) {
		bigCircle = {
			center: createVector(random(width), random(height)),
			radius: height / 2
		}
	} else {
		bigCircle = {
			center: createVector(random(width), random(height)),
			radius: random(height / 10, height / 4),
		}
	}

	if (compositionChoice < 0.05) {
		rectHor = true
		//rect grid horizontal
		const numRectangles = int(random(3, 16))
		const margin = 100
		const rectHeight = (height - 2 * margin) / numRectangles

		for (let i = 0; i < numRectangles; i++) {
			const rectY = margin + i * rectHeight
			const rectWidth = (width - 2 * margin)
			const rectX = (width - rectWidth) / 2
			const rndShift = 20
			const rectX1 = rectX + random(-rndShift, rndShift)
			const rectX2 = rectX + rectWidth + random(-rndShift, rndShift)

			polygon.push(createVector(rectX1, rectY + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX2, rectY + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX2, rectY + rectHeight + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX1, rectY + rectHeight + random(-rndShift, rndShift)))
		}
	} else if (compositionChoice < 0.1) {
		rectVert = true
		//rect grid vertical
		const numRectangles = int(random(3, 16))
		const margin = 100
		const rectWidth = (width - 2 * margin) / numRectangles

		for (let i = 0; i < numRectangles; i++) {
			const rectX = margin + i * rectWidth
			const rectHeight = (height - 2 * margin)
			const rectY = (height - rectHeight) / 2
			const rndShift = 20
			const rectY1 = rectY + random(-rndShift, rndShift)
			const rectY2 = rectY + rectHeight + random(-rndShift, rndShift)

			polygon.push(createVector(rectX + random(-rndShift, rndShift), rectY1))
			polygon.push(createVector(rectX + random(-rndShift, rndShift), rectY2))
			polygon.push(createVector(rectX + rectWidth + random(-rndShift, rndShift), rectY2))
			polygon.push(createVector(rectX + rectWidth + random(-rndShift, rndShift), rectY1))
		}

	} else if (compositionChoice < 0.15) {
		rectCollision = true
		//rect grid collision
		for (let i = 0; i < 10; i++) {
			let x, y, w, h, pos, vectors

			do {
				x = random(50, width - 50)
				y = random(50, height - 50)
				w = random(width / 30, width / 1.5)
				h = random(width / 30, width / 1.5)
				pos = createVector(x, y)
				topLeft = pos.copy()
				topRight = createVector(x + w, y)
				bottomLeft = createVector(x, y + h)
				bottomRight = createVector(x + w, y + h)

				vectors = [topLeft, topRight, bottomRight, bottomLeft]
			} while (checkRectCollision(vectors))

			polygon.push(createVector(pos.x, pos.y))
			polygon.push(createVector(topRight.x, topRight.y))
			polygon.push(createVector(bottomRight.x, bottomRight.y))
			polygon.push(createVector(bottomLeft.x, bottomLeft.y))
		}
	} else if (compositionChoice < 0.25) {
		rndRectGrid = true
		//randomized rectangle grid
		const x = 150
		const y = 150
		const w = width - 50
		const h = height - 50
		const numCols = random([5, 6, 7])
		const numRows = random([5, 6, 7])
		const colWidth = (w - x) / numCols
		const rowHeight = (h - y) / numRows

		for (let i = 0; i < numCols; i++) {
			for (let j = 0; j < numRows; j++) {
				const rx = x + i * colWidth
				const ry = y + j * rowHeight
				const rw = colWidth * random()
				const rh = rowHeight * random()

				polygon.push(createVector(rx, ry))
				polygon.push(createVector(rx + rw, ry))
				polygon.push(createVector(rx + rw, ry + rh))
				polygon.push(createVector(rx, ry + rh))
			}
		}
	} else if (compositionChoice < 0.3) {
		spiral = true
		//spiral
		let numElements = 100
		let spiralRadiusIncrement = random(8, 15)
		let angleIncrement = random(0.1, 1)

		for (let i = 0; i < numElements; i++) {
			let angle = angleIncrement * i
			let radius = spiralRadiusIncrement * i
			let x = width / 2 + radius * Math.cos(angle)
			let y = height / 2 + radius * Math.sin(angle)
			polygon.push(createVector(x, y))
		}
	} else if (compositionChoice < 0.45) {
		concentric = true
		//concentric poly
		const numCircles = int(random(5, 10))
		const circleSpacing = random(height / 10, height / 7)
		const maxVectors = 100
		let vectorsPushed = 0
		if (concentricPolyCenter < 0.5) {
			centerX = bigCircle.center.x
			centerY = bigCircle.center.y
		} else if (concentricPolyCenter < 0.7) {
			centerX = width / 2
			centerY = height / 2
		} else {
			centerX = random(width)
			centerY = random(height)
		}

		for (let i = 0; i < numCircles; i++) {
			const circleRadius = (i + 1) * circleSpacing
			const numPoints = int(random(6, 15))

			for (let j = 0; j < numPoints; j++) {
				if (vectorsPushed >= maxVectors) {
					break
				}

				const angle = map(j, 0, numPoints, 0, TWO_PI)
				let x = centerX + cos(angle) * circleRadius
				let y = centerY + sin(angle) * circleRadius

				x = constrain(x, 50, width - 50)
				y = constrain(y, 50, height - 50)

				polygon.push(createVector(x, y))
				vectorsPushed++
			}

			if (vectorsPushed >= maxVectors) {
				break
			}
		}

	} else if (compositionChoice < 0.55) {
		rhombuses = true
		//rhombuses
		const numRhombusesRow = int(random(2, 10))
		const numRhombusesColumn = int(random(2, 10))
		const margin = 50
		const rhombusWidth = (width - 2 * margin) / numRhombusesRow
		const rhombusHeight = (height - 2 * margin) / numRhombusesColumn

		for (let i = 0; i < numRhombusesColumn; i++) {
			for (let j = 0; j < numRhombusesRow; j++) {
				const rhombusX = margin + j * rhombusWidth
				const rhombusY = margin + i * rhombusHeight
				const centerX = rhombusX + rhombusWidth / 2
				const centerY = rhombusY + rhombusHeight / 2

				if (isFirstIteration && i === 0 && j === 0) {
					// Create the first rhombus
					polygon.push(createVector(centerX - rhombusWidth / 2, centerY))
					polygon.push(createVector(centerX, centerY + rhombusHeight / 2))
					polygon.push(createVector(centerX + rhombusWidth / 2, centerY))
					polygon.push(createVector(centerX, centerY - rhombusHeight / 2))
				}

				polygon.push(createVector(centerX - rhombusWidth / 2, centerY))
				polygon.push(createVector(centerX, centerY + rhombusHeight / 2))
				polygon.push(createVector(centerX + rhombusWidth / 2, centerY))
				polygon.push(createVector(centerX, centerY - rhombusHeight / 2))
				if (i === numRhombusesColumn - 1 && j === numRhombusesRow - 1) {
					closeLastRhombus = true
				}
			}
			if (closeLastRhombus) {
				const rhombusX = margin + (numRhombusesRow - 1) * rhombusWidth
				const rhombusY = margin + (numRhombusesColumn - 1) * rhombusHeight
				const centerX = rhombusX + rhombusWidth / 2
				const centerY = rhombusY + rhombusHeight / 2

				polygon.push(createVector(centerX - rhombusWidth / 2, centerY))
				polygon.push(createVector(centerX, centerY + rhombusHeight / 2))
				polygon.push(createVector(centerX + rhombusWidth / 2, centerY))
				polygon.push(createVector(centerX, centerY - rhombusHeight / 2))
			}

		}

	} else if (compositionChoice < 0.80) {
		polyGrid = true
		//poly grid
		const polyGridSize = random([2, 3])
		const margin = 50
		const cellWidth = (width - 2 * margin) / polyGridSize
		const cellHeight = (height - 2 * margin) / polyGridSize

		for (let row = 0; row < polyGridSize; row++) {
			for (let col = 0; col < polyGridSize; col++) {
				polyNormalSides = int(random(4, 16))

				const polyNormalX = margin + col * cellWidth + cellWidth / 2
				const polyNormalY = margin + row * cellHeight + cellHeight / 2
				const polyNormalRad = Math.min(cellWidth, cellHeight) / random([0.5, 1, 2, 3])

				for (let i = 0; i < polyNormalSides; i++) {
					let angle = map(i, 0, polyNormalSides, 0, TWO_PI)
					let x = polyNormalX + cos(angle) * polyNormalRad
					let y = polyNormalY + sin(angle) * polyNormalRad

					x = constrain(x, margin, width - margin)
					y = constrain(y, margin, height - margin)

					polygon.push(createVector(x, y))
				}
			}
		}
	} else if (compositionChoice < 0.9) {
		poly3 = true
		//polys chaos 1
		const polyChaosSides = int(random(8, 25))
		const polyChaosRad = height / 4
		const margin = 50

		for (let i = 0; i < polyChaosSides; i++) {
			const angle = map(i, 0, polyChaosSides, 0, TWO_PI)
			let x = random(width - margin) + cos(angle) * polyChaosRad
			let y = random(height - margin) + sin(angle) * polyChaosRad / 2

			x = constrain(x, margin, width - margin)
			y = constrain(y, margin, height - margin)

			polygon.push(createVector(x, y))
		}
	} else if (compositionChoice < 1) {
		polyChaos = true
		//polys chaos 2
		for (let i = 0; i < 3; i++) {
			const polyNormalSides = int(random(8, 25))
			const margin = 50
			const polyNormalX = random(width - margin)
			const polyNormalY = random(height - margin)
			const polyNormalRad = height / 5

			for (let i = 0; i < polyNormalSides; i++) {
				const angle = map(i, 0, polyNormalSides, 0, TWO_PI)
				let x = polyNormalX + cos(angle) * polyNormalRad
				let y = polyNormalY + sin(angle) * polyNormalRad / random([0.5, 1, 2])

				x = constrain(x, margin, width - margin)
				y = constrain(y, margin, height - margin)

				polygon.push(createVector(x, y))
			}
		}
	}
}
