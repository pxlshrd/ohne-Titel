let fPressed = false
let dPressed = false
let title = 'time leaves dust'
let saveTimeout
let saving = false

let startTime
let timeDisplay

function setup() {
	let pxlDens = 1
	let w = 1500
	let h = 2000
	pxldrw(pxlDens, w, h)
}

function pxldrw(pxlDens, w, h) {
	fxrandminter = sfc32(...hashes)
	let seed = fxrandminter() * $fx.getParam("iteration")
	counter = 0
	stopCounter = false

	createCanvas(w, h)
	overl = createGraphics(w, h)
	pg = createGraphics(w, h)
	scribbles = createGraphics(w, h)
	printingCan = createGraphics(w, h)

	randomSeed(seed)
	noiseSeed(seed)
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

	colorMode(HSB)
	overl.colorMode(HSB)
	pg.colorMode(HSB)
	scribbles.colorMode(HSB)
	printingCan.colorMode(HSB)

	strokeCap(ROUND)
	frameRate(120)

	getColors()

	initglobalVariables()

	background(hue(backCol), saturation(backCol), brightness(backCol))

	polygon = []

	sdfFoundation()

	drawPolyOutlines()

	startTime = millis()
	timeDisplay = createP()
	timeDisplay.position(windowWidth - 150, 20)
	timeDisplay.style("color", "black")
	timeDisplay.style("font-size", "16px")

}

function draw() {
	y = width / 30 + counter * gridSize
	if (counter < 1) {
		drawAsemic()
		printing(printX, printY, printsz)
	}

	if (counter < 30 && dPressed == false) {
		pencilArcDraw()
	}

	if (counter > 20 && !stopCounter && dPressed == false) {
		if (counter % 12 == 0) {
			brushes()
		}
	}

	if (!stopCounter) {
		background(hue(backCol), saturation(backCol), brightness(backCol))
		limbic(width / 2, height / 2, 1000, 50)
		image(pg, 0, height - ((width / 15) + counter * gridSize), width, height)


		printingCan.fill(col3)
		typoPencilPigments(printX - printsz * 4 + counter * 2.2, printY + printsz * 1.1 + random(-50, 10), random(height / 2000, height / 500))
		image(printingCan, 0, height - ((width / 15) + counter * 1.2 * gridSize), width, height)
		drawComposition()

		sprayWalk()

	}

	if (y > height - (width / 30)) {
		stopCounter = true
		// drawAsemicEraser()
		if (dPressed == false) {
			for (i = 0; i < 50; i++) {
				texX = random(width)
				texY = random(height)
				smallSprayLine(texX, texY, texX + random(-width / 3, width / 3), texY + random(-width / 3, width / 3), random(1, 10))
			}
			image(scribbles, 0, 0, width, height)
		}

		if (pixelDensity() <= 3 && dPressed == false) {
			tex()
			push()
			blendMode(BLEND)
			tint(0, 0, 100, 0.03)
			image(overl, 0, 0, width, height)
			pop()
			grain(10)
		} else if (dPressed = true) {
			tex()
		}

		noLoop()
		fxpreview()

		if (pixelDensity() <= 3 && pixelDensity() > 1) {
			saveCanvas(title + "_" + $fx.getParam("iteration") + ".jpg")
		} else if (pixelDensity() > 3) {
			saveCanvas(title + "_" + $fx.getParam("iteration") + ".png")
			saveCanvas(title + "_" + $fx.getParam("iteration") + ".jpg")
		}
	}

	let endTime = millis()
	let elapsedTime = (endTime - startTime) / 1000
	displayTime(elapsedTime)
	counter++
}

function initglobalVariables() {
	gridSize = width / 187.5
	cnt = height - width / 30
	orbDrawStart = random(0, 10)
	if (random() < 0.05) {
		wobble = 200
	} else {
		wobble = random([30, 40, 50, 100])
	}
	if (random() < 0.8) {
		limit = 0
	} else {
		limit = 2
	}

	minDist = Infinity
	nearestPolygon = null
	insidePolygon = false
	insideBigCircle = false

	concentricPolyCenter = random()

	repellorInfluence = [
		[0, 30],
		[2, 68],
		[20, 2]
	]
	repInfl = weightedRnd(repellorInfluence)

	brushDir = random()
	crayonSize = [
		[width / 375, 10],
		[width / 250, 20],
		[width / 187.5, 70]
	]
	crayonSz = weightedRnd(crayonSize)

	waveAngle = random(TWO_PI)
	dotWaveFreq = random(0.001, 0.05)
	dotWaveAmp = random(10, 50)
	dotWaveThick = random(50, 250)
	dotWaveStretch = random([HALF_PI, TWO_PI])

	vari1 = random(0, 4)
	vari2 = random(0, 4)
	vari3 = random(0, 4)
	vari4 = random(0, 4)
	vari5 = random(0, 4)
	vari6 = random(0, 4)
	vari7 = random(0, 4)

	printX = width / 2
	printY = width / 7.5
	printsz = width / 21.428
	walkX = random(width)
	walkY = random(height)
}

function drawComposition() {

	for (let x = width / 30; x < width - width / 30; x += gridSize) {
		minDist = Infinity
		nearestPolygon = null
		insidePolygon = false
		insideBigCircle = false
		distToPolygon = isPointInsidePolygon(x, y, polygon)

		if (distToPolygon < minDist) {
			minDist = distToPolygon
			nearestPolygon = polygon
			insidePolygon = isPointInsidePolygon(x, y, polygon)

		}

		distToBigCircle = dist(x, y, bigCircle.center.x, bigCircle.center.y) - bigCircle.radius
		if (distToBigCircle < minDist) {
			minDist = distToBigCircle
			insideBigCircle = (distToBigCircle <= 0)
		}

		if (!insidePolygon && !insideBigCircle && random() < 0.7) {
			if (dPressed == false) {
				dotHalftone(x, y, random(width / 750, width / 500))
			} else {
				pg.push()
				pg.noStroke()
				pg.fill(backCol)
				pg.rect(x, y, random(width / 750, width / 300))
				pg.pop()
			}
		}


		if (insideBigCircle) {
			if (dPressed == false) {
				drawOrb(x, y, wobble)
				orbOutline(bigCircle.center.x, bigCircle.center.y, bigCircle.radius)
			} else {
				rectz(x, y, random(width / 187.5, width / 150))
			}
		}


		if (!insideBigCircle) {

			if (dPressed == false) {
				if (random() < 0.3) {
					let closestPoint = closestPointOnPolygon(x, y, nearestPolygon)
					let lineLength = dist(x, y, closestPoint.x, closestPoint.y)
					let smoothEdging = random(-width / 50, width / 50)
					if (lineLength > width / 5 + smoothEdging) {
						if (counter % limit == true) {
							crayonLine(x, y, closestPoint.x, closestPoint.y, wobble)
						}
					} else {
						crayonLine(x, y, closestPoint.x, closestPoint.y, wobble)
					}
				}
			} else {
				let closestPoint = closestPointOnPolygon(x, y, nearestPolygon)
				let lineLength = dist(x, y, closestPoint.x, closestPoint.y)
				if (lineLength > width / 5) {
					if (counter % limit == true) {
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
	compositionChoice = $fx.getParam("comp")//random()

	// duplicateAvoidX = map(Math.random(), 0, 1, -50, 50)
	// duplicateAvoidY = map(Math.random(), 0, 1, -50, 50)
	bigCircle = {
		center: createVector(random(width), random(height)),
		radius: random(height / 10, height / 4),
	}

	if (compositionChoice == "rect hor") {
		//rect grid horizontal
		const numRectangles = int(random(3, 16))
		const margin = width / 15
		const rectHeight = (height - 2 * margin) / numRectangles

		for (let i = 0; i < numRectangles; i++) {
			const rectY = margin + i * rectHeight
			const rectWidth = (width - 2 * margin)
			const rectX = (width - rectWidth) / 2
			const rndShift = width / 75
			const rectX1 = rectX + random(-rndShift, rndShift)
			const rectX2 = rectX + rectWidth + random(-rndShift, rndShift)

			polygon.push(createVector(rectX1, rectY + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX2, rectY + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX2, rectY + rectHeight + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX1, rectY + rectHeight + random(-rndShift, rndShift)))
		}
	} else if (compositionChoice == "rect vert") {
		//rect grid vertical
		const numRectangles = int(random(3, 16))
		const margin = height / 15
		const rectWidth = (width - 2 * margin) / numRectangles

		for (let i = 0; i < numRectangles; i++) {
			const rectX = margin + i * rectWidth
			const rectHeight = (height - 2 * margin)
			const rectY = (height - rectHeight) / 2
			const rndShift = height / 75
			const rectY1 = rectY + random(-rndShift, rndShift)
			const rectY2 = rectY + rectHeight + random(-rndShift, rndShift)

			polygon.push(createVector(rectX + random(-rndShift, rndShift), rectY1))
			polygon.push(createVector(rectX + random(-rndShift, rndShift), rectY2))
			polygon.push(createVector(rectX + rectWidth + random(-rndShift, rndShift), rectY2))
			polygon.push(createVector(rectX + rectWidth + random(-rndShift, rndShift), rectY1))
		}

	} else if (compositionChoice == "rect collision") {
		//rect grid collision
		for (let i = 0; i < 10; i++) {
			let x, y, w, h, pos, vectors

			do {
				x = random(50, width - 50)
				y = random(50, height - 50)
				w = random(50, 1000)
				h = random(50, 1000)
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
	} else if (compositionChoice == "randomized rectangle grid") {
		//randomized rectangle grid
		let x = 150
		let y = 150
		let w = width - 50
		let h = height - 50
		let numCols = random([5, 6, 7])
		let numRows = random([5, 6, 7])
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
	} else if (compositionChoice == "concentric poly") {
		//concentric poly
		const numCircles = int(random(5, 10))
		const circleSpacing = random(height / 10, height / 7)
		const maxVectors = 100
		let vectorsPushed = 0
		if (concentricPolyCenter < 0.5) {
			centerX = bigCircle.center.x
			centerY = bigCircle.center.y
		} else if (concentricPolyCenter < 0.7){
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

	} else if (compositionChoice == "rhombuses") {
		const numRhombusesRow = int(random(2, 10))
		const numRhombusesColumn = int(random(2, 10))
		const margin = 50
		const rhombusWidth = (width - 2 * margin) / numRhombusesRow
		const rhombusHeight = (height - 2 * margin) / numRhombusesColumn

		for (let i = 0; i < numRhombusesColumn; i++) {
			for (let j = 0; j < numRhombusesRow; j++) {
				const rhombusX = margin + j * rhombusWidth
				const rhombusY = margin + i * rhombusHeight
				const rndShift = width / 75

				const centerX = rhombusX + rhombusWidth / 2
				const centerY = rhombusY + rhombusHeight / 2

				polygon.push(createVector(centerX - rhombusWidth / 2 + random(-rndShift, rndShift), centerY + random(-rndShift, rndShift)))
				polygon.push(createVector(centerX + random(-rndShift, rndShift), centerY + rhombusHeight / 2 + random(-rndShift, rndShift)))
				polygon.push(createVector(centerX + rhombusWidth / 2 + random(-rndShift, rndShift), centerY + random(-rndShift, rndShift)))
				polygon.push(createVector(centerX + random(-rndShift, rndShift), centerY - rhombusHeight / 2 + random(-rndShift, rndShift)))
			}
		}
	} else if (compositionChoice == "polygrid") {
		//poly grid
		const polyGridSize = random([2, 3])
		const margin = width / 30
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
	} else if (compositionChoice == "poly 3") {
		//polys chaos 1
		const polyChaosSides = int(random(8, 25))
		const polyChaosRad = height / 4
		const margin = width / 30

		for (let i = 0; i < polyChaosSides; i++) {
			let angle = map(i, 0, polyChaosSides, 0, TWO_PI)
			let x = random(width - margin) + cos(angle) * polyChaosRad
			let y = random(height - margin) + sin(angle) * polyChaosRad / 2

			x = constrain(x, margin, width - margin)
			y = constrain(y, margin, height - margin)

			polygon.push(createVector(x, y))
		}
	} else if (compositionChoice == "poly chaos") {
		//polys chaos 2
		for (let i = 0; i < 3; i++) {
			const polyNormalSides = int(random(8, 25))
			const margin = width / 30
			const polyNormalX = random(width - margin)
			const polyNormalY = random(height - margin)
			const polyNormalRad = height / 5

			for (let i = 0; i < polyNormalSides; i++) {
				let angle = map(i, 0, polyNormalSides, 0, TWO_PI)
				let x = polyNormalX + cos(angle) * polyNormalRad
				let y = polyNormalY + sin(angle) * polyNormalRad / random([0.5, 1, 2])

				x = constrain(x, margin, width - margin)
				y = constrain(y, margin, height - margin)

				polygon.push(createVector(x, y))
			}
		}
	}
}
