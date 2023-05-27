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
	let seed = fxrand() * 123456789
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
			saveCanvas(title + "_" + ".jpg")
		} else if (pixelDensity() > 3) {
			saveCanvas(title + "_" + ".png")
			saveCanvas(title + "_" + ".jpg")
		}
	}

	let endTime = millis()
	let elapsedTime = (endTime - startTime) / 1000
	displayTime(elapsedTime)
	counter++
}

function weightedRnd(input) {
	let out = []

	for (let inp of input) {
		for (let i = 0; i < inp[1]; i++) {
			out.push(inp[0])
		}
	}

	let output = int(random(out.length))
	return out[output]
}

function drawComposition() {

	y = width / 30 + counter * gridSize;
	for (let x = width / 30; x < width - width / 30; x += gridSize) {

		let minDist = Infinity
		let nearestPolygon = null
		let insidePolygon = false
		let insideBigCircle = false

		let distToPolygon = isPointInsidePolygon(x, y, polygon)

		if (distToPolygon < minDist) {
			minDist = distToPolygon
			nearestPolygon = polygon
			insidePolygon = isPointInsidePolygon(x, y, polygon)

		}

		let distToBigCircle = dist(x, y, bigCircle.center.x, bigCircle.center.y) - bigCircle.radius
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
	compositionChoice = random()

	if (compositionChoice < 0.05) {
		//rect grid horizontal
		const numRectangles = int(random(3, 16))
		const margin = width / 15
		const rectHeight = (height - 2 * margin) / numRectangles

		for (let i = 0; i < numRectangles; i++) {
			const rectY = margin + i * rectHeight
			const rectWidth = (width - 2 * margin)
			const rectX = (width - rectWidth) / 2
			const rndShift = 0//width / 75
			const rectX1 = rectX + random(-rndShift, rndShift)
			const rectX2 = rectX + rectWidth + random(-rndShift, rndShift)

			polygon.push(createVector(rectX1, rectY + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX2, rectY + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX2, rectY + rectHeight + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX1, rectY + rectHeight + random(-rndShift, rndShift)))
		}
	} else if (compositionChoice < 0.1) {
		//rect grid vertical
		const numRectangles = int(random(2, 16))
		const margin = width / 30
		const rectWidth = (width - 2 * margin) / numRectangles

		for (let i = 0; i < numRectangles; i++) {
			const rectX = margin + i * rectWidth
			const rndShift = width / 75

			polygon.push(createVector(rectX + random(-rndShift, rndShift), margin + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX + rectWidth + random(-rndShift, rndShift), margin + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX + rectWidth + random(-rndShift, rndShift), height - margin + random(-rndShift, rndShift)))
			polygon.push(createVector(rectX + random(-rndShift, rndShift), height - margin + random(-rndShift, rndShift)))
		}
	} else if (compositionChoice < 0.3) {
		//rect grid collision
		for (let i = 0; i < 10; i++) {
			let x, y, w, h, pos, vectors;
		  
			do {
			  x = random(50, width - 50);
			  y = random(50, height - 50);
			  w = random(50, 1000);
			  h = random(50, 1000);
			  pos = createVector(x, y);
			  topLeft = pos.copy();
			  topRight = createVector(x + w, y);
			  bottomLeft = createVector(x, y + h);
			  bottomRight = createVector(x + w, y + h);
		  
			  vectors = [topLeft, topRight, bottomRight, bottomLeft]; // Store the four vectors
			} while (checkRectCollision(vectors));
		  
			polygon.push(createVector(pos.x, pos.y))
			polygon.push(createVector(topRight.x, topRight.y))
			polygon.push(createVector(bottomRight.x, bottomRight.y))
			polygon.push(createVector(bottomLeft.x, bottomLeft.y))
		  }
		  
		  
	} else if (compositionChoice < 0.8) {
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
	} else if (compositionChoice < 0.9) {
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
	} else if (compositionChoice < 1) {
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
	// duplicateAvoidX = map(Math.random(), 0, 1, -50, 50)
	// duplicateAvoidY = map(Math.random(), 0, 1, -50, 50)
	bigCircle = {
		center: createVector(random(width), random(height)),
		radius: random(height / 10, height / 4),
	}
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

	repellorInfluence = [
		[0, 30],
		[2, 65],
		[20, 5]
	]
	repInfl = weightedRnd(repellorInfluence)

	crayonSize = [
		[width / 375, 40],
		[width / 250, 20],
		[width / 187.5, 40]
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

	colCount = random()
	colorCount = random([0, 45, 90, 180])
}

function drawPolyOutlines() {
	if (dPressed == false) {
		let poiX = bigCircle.center.x
		let poiY = bigCircle.center.y

		for (let i = 0; i < polygon.length - 1; i++) {
			crayonLine(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y, 100)
			crayonLine(polygon[i].x, polygon[i].y, poiX, poiY, 5)

		}
		crayonLine(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y, 100)

	} else {
		pg.stroke(col3)
		pg.strokeWeight(width * 0.00133)
		for (let i = 0; i < polygon.length - 1; i++) {
			pg.line(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y)
		}
		pg.line(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y)

	}
}

function checkRectCollision(rectVectors) {
	for (let i = 0; i < polygon.length; i++) {
	  let other = polygon[i]
	  for (let j = 0; j < other.length; j++) {
		let corner = other[j]
		if (
		  rectVectors[0].x < corner.x &&
		  rectVectors[1].x > corner.x &&
		  rectVectors[0].y < corner.y &&
		  rectVectors[3].y > corner.y
		) {
		  return true
		}
	  }
	}

	if (
	  rectVectors[0].x < 50 ||
	  rectVectors[1].x > width - 50 ||
	  rectVectors[0].y < 50 ||
	  rectVectors[3].y > height - 50
	) {
	  return true
	}
  
	return false
}
  
function isPointInsidePolygon(px, py, vertices) {
	let inside = false;
	let i, j = vertices.length - 1;

	for (i = 0; i < vertices.length; i++) {
		if ((vertices[i].y < py && vertices[j].y >= py || vertices[j].y < py && vertices[i].y >= py) &&
			(vertices[i].x <= px || vertices[j].x <= px)) {
			if (vertices[i].x + (py - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < px) {
				inside = !inside;
			}
		}
		j = i;
	}

	return inside;
}

function distToLineSegment(px, py, x1, y1, x2, y2) {
	let lineLength = dist(x1, y1, x2, y2);

	if (lineLength === 0) {
		return dist(px, py, x1, y1);
	}

	let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (lineLength * lineLength);
	t = constrain(t, 0, 1);

	let closestX = x1 + t * (x2 - x1);
	let closestY = y1 + t * (y2 - y1);

	return dist(px, py, closestX, closestY);
}

function closestPointOnPolygon(px, py, vertices) {
	let minDist = Infinity;
	let closestPoint = null;

	for (let i = 0; i < vertices.length; i++) {
		let a = vertices[i];
		let b = vertices[(i + 1) % vertices.length];

		let point = closestPointOnLine(px, py, a.x, a.y, b.x, b.y);
		let distToPoint = dist(px, py, point.x, point.y);

		if (distToPoint < minDist) {
			minDist = distToPoint;
			closestPoint = point;
		}
	}

	return closestPoint;
}

function closestPointOnLine(px, py, x1, y1, x2, y2) {
	let line = createVector(x2 - x1, y2 - y1);
	let lineSqMag = line.magSq();

	if (lineSqMag === 0) {
		return createVector(x1, y1);
	}

	let point = createVector(px - x1, py - y1);
	let t = point.dot(line) / lineSqMag;

	t = min(max(t, 0), 1);

	return createVector(x1 + t * line.x, y1 + t * line.y);
}

function rectz(x, y, rectSz) {
	let waveDirectionX = Math.cos(waveAngle)
	let waveDirectionY = Math.log(waveAngle)
	let orthogonalDirectionX = Math.cos(waveAngle + dotWaveStretch)
	let orthogonalDirectionY = Math.sin(waveAngle + dotWaveStretch)//was (waveAngle + HALF_PI) before

	let projection = x * waveDirectionX + y * waveDirectionY
	let orthogonalProjection = x * orthogonalDirectionX + y * orthogonalDirectionY

	let waveValue = Math.sin(projection * dotWaveFreq) * dotWaveAmp
	let adjustedProjection = projection + waveValue

	let variabledotWaveThick = dotWaveThick + Math.sin(orthogonalProjection * dotWaveFreq) * dotWaveAmp
	let colorIndex = int(abs(adjustedProjection / variabledotWaveThick)) % colorzz.length

	let colz = colorzz[colorIndex]

	pg.noStroke()
	pg.fill(hue(colz) + random(-2, 2), saturation(colz) + random(-3, 3), brightness(colz) + random(-1, 1))
	pg.rect(x, y, rectSz)

}

function dot(x, y, r) {
	pg.beginShape()
	const sides = random(2, 4)
	const increment = PI / sides
	const randomOffset = random(width / 1500, width / 750)

	for (let a = 0; a < TWO_PI; a += increment) {
		const angle = a + randomOffset
		const sx = x + Math.cos(angle) * r
		const sy = y + Math.sin(angle) * r
		pg.curveVertex(sx, sy)
	}
	pg.endShape(CLOSE)
}

function dotHalftone(x, y, r) {
	pg.beginShape()
	const sides = random(2, 4)
	const increment = PI / sides
	const randomOffset = random(width / 1500, width / 750)
	pg.fill(backCol)
	pg.noStroke()
	for (let a = 0; a < TWO_PI; a += increment) {
		const angle = a + randomOffset
		const sx = x + Math.cos(angle) * r + random(width / 750, width / 375)
		const sy = y + Math.sin(angle) * r + random(width / 750, width / 375)
		pg.curveVertex(sx, sy)
	}
	pg.endShape(CLOSE)
}

function digitalLine(x, y, x1, y1, wobbliness) {
	if (colCount < 0.02) {
		colorCount = random([0, 45, 90, 180])
	}
	let controlPoints = [];
	let d = dist(x, y, x1, y1);
	let segments = d * 0.05;

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments;
		let yEnd = y + (y1 - y) * i / segments;
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002);
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2);
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2);
		controlPoints.push([xEnd + xOffset, yEnd + yOffset]);
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		startX = controlPoints[i][0];
		startY = controlPoints[i][1];
		endX = controlPoints[i + 1][0];
		endY = controlPoints[i + 1][1];

		let angle = atan2(endY - startY, endX - startX)
		angle = (angle * colorCount) / PI
		let colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
		let col2 = colorzz[colorIndex]

		pg.strokeWeight(width / 1500)
		pg.stroke(hue(col2), saturation(col2), brightness(col2));
		pg.line(startX, startY, endX, endY);
	}
}

function crayonLineSegment(x, y, x1, y1, wobbliness) {
	let repellorX = bigCircle.center.x
	let repellorY = bigCircle.center.y
	let repellorSize = bigCircle.radius * 2

	// let attractorX = bigCircle.center.x
	// let attractorY = bigCircle.center.y
	// let attractorSize = bigCircle.radius * 4

	if (colCount < 0.02) {
		colorCount = random([0, 45, 90, 180])
	}
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.4

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let pointX = controlPoints[i][0]
		let pointY = controlPoints[i][1]
		let baseWeight = width / 1250

		let rndX = random(-width / 1500, width / 1500)
		let rndY = random(-width / 1500, width / 1500)

		let angle = atan2(endY - startY, endX - startX)
		angle = (angle * colorCount) / PI
		let colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
		let briIndex = map(angle, -180, 180, -5, 5)
		let col2 = colorzz[colorIndex]

		if (taperswitch < 0.5) {
			weight = baseWeight * map(1 - i / segments, 0, 1, width / 937.5, crayonSz)
			saturationStart = saturation(col2) + 10
			saturationEnd = saturation(col2)
		} else {
			weight = baseWeight * map(i / segments, 0, 1, width / 937.5, crayonSz)
			saturationStart = saturation(col2) - 8
			saturationEnd = saturation(col2) + 8
		}

		noiseDetail(noiseDetTexture, noiseDetTexFallOff)
		let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
		let colVarDet = map(noise(x * 0.05, y * 0.05), 0, 1, -3, 3)
		noiseDetail(noiseDet, noiseDetFallOff)

		let distanceToRepellor = dist(pointX, pointY, repellorX, repellorY)
		// let distanceToAttractor = dist(pointX, pointY, attractorX, attractorY)

		// repellor forces with distance-based attenuation
		let repellorForce = 0

		if (distanceToRepellor < repellorSize) {
			repellorForce = map(distanceToRepellor, 0, repellorSize, repInfl, 0) //adding random([2, 5, 20]) to the force
		}

		// let attractorForce = 0;
		// if (distanceToAttractor < attractorSize) {
		// 	attractorForce = map(distanceToAttractor, 0, attractorSize, 0, 0); //4 4 the 4ce is good
		// }

		// Calculate the normalized distance from the center of the repellor/attractor
		let repellorDistanceNormalized = map(distanceToRepellor, 0, repellorSize, 1, 0)
		// let attractorDistanceNormalized = map(distanceToAttractor, 0, attractorSize, 1, 0);

		// Apply force with distance-based attenuation
		let finalX = pointX + repellorForce * (pointX - repellorX) * repellorDistanceNormalized// + attractorForce * (attractorX - pointX) * attractorDistanceNormalized
		let finalY = pointY + repellorForce * (pointY - repellorY) * repellorDistanceNormalized// + attractorForce * (attractorY - pointY) * attractorDistanceNormalized

			pg.stroke(hue(col2), saturationVal, brightness(col2) + colVarDet + briIndex)
		pg.strokeWeight(weight + random(-width / 7500, width / 7500))
		pg.point(finalX + rndX, finalY + rndY)
	}
}

function crayonLine(x, y, x1, y1, wobbliness) {
	taperswitch = random()
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.05

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let multX = Math.sin(noiseFactor * TWO_PI * 2)
		let multY = Math.cos(noiseFactor * TWO_PI * 2)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
		
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		startX = controlPoints[i][0]
		startY = controlPoints[i][1]
		endX = controlPoints[i + 1][0]
		endY = controlPoints[i + 1][1]
		rndspread = 2

		push()
		crayonLineSegment(
			startX + random(-rndspread, rndspread),
			startY + random(-rndspread, rndspread),
			endX + random(-rndspread, rndspread),
			endY + random(-rndspread, rndspread),
			5)
		pop()
	}

}

function smallSprayLineSegment(x, y, x1, y1, wobbliness) {
	let texCol = random(colorpalette.colors.filter(color => color !== backCol))
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.8

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let pointX = controlPoints[i][0]
		let pointY = controlPoints[i][1]
		let baseWeight = width / 1250

		let rndX = random(-width / 1500, width / 1500)
		let rndY = random(-width / 1500, width / 1500)

		if (taperswitch < 0.5) {
			weight = baseWeight * map(1 - i / segments, 0, 1, width / 30000, width / 15000)
			saturationStart = saturation(texCol) + 10
			saturationEnd = saturation(texCol)
		} else {
			weight = baseWeight * map(i / segments, 0, 1, width / 30000, width / 15000)
			saturationStart = saturation(texCol) - 5
			saturationEnd = saturation(texCol) + 5
		}
		let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd);

		scribbles.strokeWeight(weight + random(- width / 3000, width / 3000))
		scribbles.stroke(hue(texCol), saturationVal, brightness(texCol))
		scribbles.point(pointX + rndX, pointY + rndY)
		scribbles.strokeWeight(weight * 2 + random(-width / 7500, width / 7500))
		scribbles.point(pointX + rndX, pointY + rndY)
	}
}

function smallSprayLine(x, y, x1, y1, wobbliness) {
	taperswitch = random()
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.1

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		startX = controlPoints[i][0]
		startY = controlPoints[i][1]
		endX = controlPoints[i + 1][0]
		endY = controlPoints[i + 1][1]
		rndspread = 2

		push()
		smallSprayLineSegment(
			startX + random(-rndspread, rndspread),
			startY + random(-rndspread, rndspread),
			endX + random(-rndspread, rndspread),
			endY + random(-rndspread, rndspread),
			5)
		pop()
	}

}

function orbLineSegments(x, y, x1, y1, wobbliness) {

	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.3

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length; i++) {
		let pointX = controlPoints[i][0]
		let pointY = controlPoints[i][1]
		let baseWeight = width / 1250

		let rndX = random(-width / 1500, width / 1500)
		let rndY = random(-width / 1500, width / 1500)

		let waveDirectionX = Math.cos(waveAngle)
		let waveDirectionY = Math.log(waveAngle)
		let orthogonalDirectionX = Math.cos(waveAngle + dotWaveStretch)
		let orthogonalDirectionY = Math.sin(waveAngle + dotWaveStretch)//was (waveAngle + HALF_PI) before

		let projection = x * waveDirectionX + y * waveDirectionY
		let orthogonalProjection = x * orthogonalDirectionX + y * orthogonalDirectionY

		let waveValue = Math.sin(projection * dotWaveFreq) * dotWaveAmp
		let adjustedProjection = projection + waveValue

		let variabledotWaveThick = dotWaveThick + Math.sin(orthogonalProjection * dotWaveFreq) * dotWaveAmp
		let colorIndex = int(abs(adjustedProjection / variabledotWaveThick)) % colorzz.length

		let colz = colorzz[colorIndex]

		if (taperswitch < 0.5) {
			weight = baseWeight * map(1 - i / segments, 0, 1, width / 500, crayonSz * 1.25)
			saturationStart = saturation(colz) + 10
			saturationEnd = saturation(colz)
		} else {
			weight = baseWeight * map(i / segments, 0, 1, width / 500, crayonSz * 1.25)
			saturationStart = saturation(colz) - 8
			saturationEnd = saturation(colz) + 8
		}

		noiseDetail(noiseDetTexture, noiseDetTexFallOff)
		let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
		let colVarDet = map(noise(x * 0.005, y * 0.005), 0, 1, -3, 3)
		noiseDetail(noiseDet, noiseDetFallOff)

		pg.stroke(hue(colz), saturationVal, brightness(colz) + colVarDet)
		pg.strokeWeight(weight + random(-width / 7500, width / 7500))
		pg.point(pointX + rndX, pointY + rndY)
	}
}

function orbLine(x, y, x1, y1, wobbliness) {
	taperswitch = random()
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.05

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
		let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)
		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		startX = controlPoints[i][0]
		startY = controlPoints[i][1]
		endX = controlPoints[i + 1][0]
		endY = controlPoints[i + 1][1]
		rndspread = 2

		push()
		orbLineSegments(
			startX + random(-rndspread, rndspread),
			startY + random(-rndspread, rndspread),
			endX + random(-rndspread, rndspread),
			endY + random(-rndspread, rndspread),
			5)
		pop()
	}

}

function orbOutline(x, y, radius) {
	let density = 2
	let orbDrawStartStep = TWO_PI / density
	let strkW = random(1, 3)

	if (backCol === '#191818') {
		pg.fill('#DED5CA')
	} else {
		pg.fill(20, 10, 20)
	}

	// pencil outline
	pg.noStroke()
	for (let i = 0; i < density; i++) {
		let currentorbDrawStart = orbDrawStart + i * orbDrawStartStep;
		if (i === counter % density) {
			let xOutl = x + cos(currentorbDrawStart) * radius + random(-strkW, strkW);
			let yOutl = y + sin(currentorbDrawStart) * radius + random(-strkW, strkW);
			const weightVarFac = noise(xOutl * 0.01, yOutl * 0.01)
			const weight = map(weightVarFac, 0, 1, height / 6000, height / 4000)
			xOutl = constrain(xOutl, 50, width - 50)
			yOutl = constrain(yOutl, 50, height - 50)
			pencilPigments(xOutl, yOutl, weight)
		}
	}
	// dashed circle
	pg.stroke(col3)
	for (let i = 0; i < 1; i++) {
		let currentorbDrawStart = orbDrawStart + i * orbDrawStartStep;
		if (i === counter % density/2) {
			let xOutl = x + cos(currentorbDrawStart/8) * radius*1.2 + random(-strkW, strkW);
			let yOutl = y + sin(currentorbDrawStart/8) * radius*1.2 + random(-strkW, strkW);
			xOutl = constrain(xOutl, 50, width - 50)
			yOutl = constrain(yOutl, 50, height - 50)
			pg.strokeWeight(2)
			pg.point(xOutl, yOutl)
		}
	}
	orbDrawStart += TWO_PI / random(450, 500)
}

function drawOrb(x, y, wobble) {
	pg.push()
	pg.translate(-20, -20)
	if (random() < 0.5) {
		let rndOff = random(10, 40)
		let rndOff2 = random(-5, 5)
		let length = random(10, 40)
		let x2 = x + length + rndOff2
		let y2 = y + length + rndOff2

		orbLine(x + rndOff, y + rndOff, x2, y2, wobble)
	} else {
		let rndOff = random(10, 40)
		let rndOff2 = random(-5, 5)
		let length = random(10, 40)
		let x2 = x - length + rndOff2
		let y2 = y + length + rndOff2

		orbLine(x + rndOff, y + rndOff, x2, y2, wobble)
	}
	pg.pop()
}

function limbic(x, y, size, strokeNum) {

	let angle = map(counter, 0, strokeNum, 0, TWO_PI)
	let x1 = x + cos(angle)
	let y1 = y + sin(angle) * size * vari1
	let x2 = x + cos(angle) * size * vari2
	let y2 = y + sin(angle) * size * vari3
	let x3 = x + cos(angle) * size * vari4
	let y3 = y + sin(angle) * size * vari5
	let x4 = x + cos(angle) * size * vari6
	let y4 = y + sin(angle) * size * vari7
	if (dPressed == false) {

		pg.fill(hue(col3), saturation(col3), brightness(col3), random(0.2, 0.5))
		pg.noStroke()
		let length = dist(x1, y1, x2, y2)
		let length2 = dist(x3, y3, x4, y4)
		let noiVal = 40

		for (let i = 0; i < length; i += 8) {
			let x = lerp(x1, x2, i / length)
			let y = lerp(y1, y2, i / length)
			let xNoi = noise(x * 0.01, y * 0.01) * noiVal
			let yNoi = noise(x * 0.01, y * 0.01) * noiVal
			let weight = map(xNoi, 0, noiVal, width / 7500, width / 750)
			dot(x + xNoi, y + yNoi, weight)

		}

		for (let i = 0; i < length2; i += 8) {
			let x = lerp(x3, x4, i / length2)
			let y = lerp(y3, y4, i / length2)
			let xNoi = noise(x * 0.01, y * 0.01) * noiVal
			let yNoi = noise(x * 0.01, y * 0.01) * noiVal
			let weight = map(xNoi, 0, noiVal, width / 7500, width / 750)
			dot(x + xNoi, y + yNoi, weight)
		}
	} else {

		pg.fill(hue(col3), saturation(col3), brightness(col3), random(0.2, 0.5))
		pg.noStroke()
		let length = dist(x1, y1, x2, y2)
		let length2 = dist(x3, y3, x4, y4)

		for (let i = 0; i < length; i += 10) {
			let x = lerp(x1, x2, i / length)
			let y = lerp(y1, y2, i / length)

			pg.rect(x, y, width / 750)
		}

		for (let i = 0; i < length2; i += 10) {
			let x = lerp(x3, x4, i / length2)
			let y = lerp(y3, y4, i / length2)

			pg.rect(x, y, width / 750)
		}
	}

}

function tex() {
	for (let y = 0; y < height + 40; y += random(8, 13)) {
		rndX = random(-width / 1500, width / 1500)
		rndY = random(-width / 1500, width / 1500)

		texLines(-width / 75 + rndX, y - width / 75 + rndY, width + width / 10 + rndX, y - width / 75 + rndY)
	}

	for (let x = 0; x < width + 40; x += random(8, 13)) {
		rndX = random(-height / 1500, height / 1500)
		rndY = random(-height / 1500, height / 1500)

		texLines2(x - height / 75 + rndX, -height / 75 + rndY, x - height / 75 + rndX, height + height / 10 + rndY)
	}
}

function texLines(x, y, x1, y1) {
	overl.push()
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.05

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -30, 30)
		let yOffset = map(noiseFactor, 0, 1, -30, 30)

		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		overl.noFill()
		let startX = controlPoints[i][0]
		let startY = controlPoints[i][1]
		let endX = controlPoints[i + 1][0]
		let endY = controlPoints[i + 1][1]
		strk = random(0.5, 4)

		//shadows
		overl.stroke(0, 0, 10)
		overl.strokeWeight(strk * 2)
		overl.line(startX, startY, endX, endY)
		//highlights
		overl.stroke(0, 0, 90)
		overl.strokeWeight(strk * 0.8)
		overl.line(startX, startY - 2, endX, endY - 2)


	}
	overl.pop()
}

function texLines2(x, y, x1, y1) {
	overl.push()
	let controlPoints = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.05

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -30, 30)
		let yOffset = map(noiseFactor, 0, 1, -30, 30)

		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		overl.noFill()
		let startX = controlPoints[i][0]
		let startY = controlPoints[i][1]
		let endX = controlPoints[i + 1][0]
		let endY = controlPoints[i + 1][1]
		strk = random(0.5, 6)

		//shadows
		overl.stroke(0, 0, 10)
		overl.strokeWeight(strk * 2)
		overl.line(startX, startY, endX, endY)
		//highlights
		overl.stroke(0, 0, 90)
		overl.strokeWeight(strk * 0.8)
		overl.line(startX - 2, startY, endX - 2, endY)


	}
	overl.pop()
}

function grain(grainAmount) {
	loadPixels()
	let d = pixelDensity()
	let length = 4 * (width * d) * (height * d)
	let pixelsCopy = new Uint8ClampedArray(length)
	pixelsCopy.set(pixels)

	for (let i = 0; i < length; i += 4) {
		if (pixelsCopy[i + 3] > 0) {
			let grain = random(-grainAmount, grainAmount)
			pixelsCopy[i] += grain
			pixelsCopy[i + 1] += grain
			pixelsCopy[i + 2] += grain
		}
	}

	for (let i = 0; i < length; i++) {
		pixels[i] = pixelsCopy[i]
	}

	updatePixels()
}


function keyPressed() {
	if (key == 'p') saveCanvas(title + "_" + ".png")
	if (key == 'j') saveCanvas(title + "_" + ".jpg")

	if ("1" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(2, 1500, 2000)
		loop()
		draw()
	}

	if ("2" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(3, 1500, 2000)
		loop()
		draw()
	}

	if ("3" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(4, 1500, 2000)
		loop()
		draw()
	}

	if ("4" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(5, 1500, 2000)
		loop()
		draw()
	}

	if ("5" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(6, 1500, 2000)
		loop()
		draw()
	}

	if ("6" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(7, 1500, 2000)
		loop()
		draw()
	}

	if ("7" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(8, 1500, 2000)
		loop()
		draw()
	}

	if ("8" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(9, 1500, 2000)
		loop()
		draw()
	}

	if ("0" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(1, 1500, 2000)
		loop()
		draw()
	}

	if ("f" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		fPressed = true
		pxldrw(1, windowWidth * 2, windowHeight * 2)
		loop()
		draw()
	}

	if (fPressed && 'h' == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		pxldrw(4, windowWidth * 2, windowHeight * 2)
		loop()
		draw()
	}

	if ("d" == key) {
		fxrandminter = sfc32(...hashes)
		counter = 0
		dPressed = true
		pxldrw(1, 1500, 2000)
		loop()
		draw()
	}
}

function touchStarted() {
	if (touches.length === 1) {
		saveTimeout = setTimeout(saveCan, 2000)
		saving = true
	}
}

function touchEnded() {
	if (saving) {
		clearTimeout(saveTimeout)
		saving = false
	}
}

function saveCan() {
	saveCanvas(title + "_" + ".jpg")
}

function displayTime(time) {
	let display = nf(time, 0, 2); // Format time with 2 decimal places
	timeDisplay.html("Time: " + display + " seconds"); // Update the time display
}
