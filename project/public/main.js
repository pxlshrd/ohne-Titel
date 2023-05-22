let fPressed = false
let dPressed = false
let title = 'lamento'
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
	noiseDet = random([2, 5])
	noiseDetFallOff = 0.5
	noiseDetTexture = 6
	noiseDetTexFallOff = 0.99
	noiseDetail(noiseDet, noiseDetFallOff)

	pixelDensity(pxlDens)
	pg.pixelDensity(pxlDens)
	scribbles.pixelDensity(pxlDens)
	overl.pixelDensity(pxlDens)
	printingCan.pixelDensity(pxlDens)

	pg.smooth()
	scribbles.smooth()
	overl.smooth()
	printingCan.smooth()

	colorMode(HSB)
	overl.colorMode(HSB)
	pg.colorMode(HSB)
	scribbles.colorMode(HSB)
	printingCan.colorMode(HSB)

	strokeCap(ROUND)
	frameRate(120)

	getColors()

	gridSize = 8
	cnt = height - 50
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

	waveAngle = random(TWO_PI)
	dotWaveFreq = random(0.001, 0.05)
	dotWaveAmp = random(10, 50)
	dotWaveThick = random(50, 250)
	dotWaveStretch = random([HALF_PI, TWO_PI])

	laughs = []
	polygon = []

	if (random() < 0.5) {
		//polys 1
		polyChaosSides = random([8, 25])
		polyChaosRad = height / 4

		polyChaosSides = random([8, 25])
		polyChaosRad = height / 4

		for (let i = 0; i < polyChaosSides; i++) {
			let angle = map(i, 0, polyChaosSides, 0, TWO_PI)
			let x = random(width - 50) + cos(angle) * polyChaosRad
			let y = random(height - 50) + sin(angle) * polyChaosRad / 2

			x = constrain(x, 50, width - 50)
			y = constrain(y, 50, height - 50)

			polygon.push(createVector(x, y))
		}
	} else {
		//polys 2
		for (let i = 0; i < 3; i++) {
			polyNormalSides = random([8, 25])
			polyNormalX = random(width - 50)
			polyNormalY = random(height - 50)
			polyNormalRad = height / 5
			for (let i = 0; i < polyNormalSides; i++) {
				let angle = map(i, 0, polyNormalSides, 0, TWO_PI)
				let x = polyNormalX + cos(angle) * polyNormalRad
				let y = polyNormalY + sin(angle) * polyNormalRad / random([0.5, 1, 2])

				x = constrain(x, 50, width - 50)
				y = constrain(y, 50, height - 50)

				polygon.push(createVector(x, y))
			}
		}
	}

	bigCircle = {
		center: createVector(random(width), random(height)),
		radius: random(height / 10, height / 4),
	}

	background(backCol)

	vari1 = random(0, 4)
	vari2 = random(0, 4)
	vari3 = random(0, 4)
	vari4 = random(0, 4)
	vari5 = random(0, 4)
	vari6 = random(0, 4)
	vari7 = random(0, 4)

	//poly outlines
	if (dPressed == false) {
		let poiX = bigCircle.center.x
		let poiY = bigCircle.center.y

		for (let i = 0; i < polygon.length - 1; i++) {
			wobblyLineDrawn(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y, 100)
			pg.line(polygon[i].x, polygon[i].y, poiX, poiY, 100)

		}
		wobblyLineDrawn(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y, 100)

	} else {
		pg.stroke(col3)
		pg.strokeWeight(2)
		for (let i = 0; i < polygon.length - 1; i++) {
			pg.line(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y)
		}
		pg.line(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y)

	}

	printX = width / 2
	printY = 200
	printsz = 70

	walkX = random(width)
	walkY = random(height)

	scribWaveAngle = 0
	scribbWaveX = random(width / 2)
	scribbWaveY = random(height)

	ribbonAngle = 0
	ribbonX = 100
	ribbonY = 50

	shadingPenStartX = random(width - 100)
	shadingPenStartY = random(height)
	shadingAmp = 10
	shadingFreq = 2
	shadingRot = random(0, TWO_PI)

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

	// if (counter > 10 && !stopCounter && dPressed == false) {
	// 	if (counter % 5 == 0) {
	// 		pencilScribblesDraw(1)
	// 	}
	// }

	if (counter > 20 && !stopCounter && dPressed == false) {
		if (counter % 15 == 0) {
			brushes()
		}
	}

	if (!stopCounter) {
		background(hue(backCol) - 5, saturation(backCol), brightness(backCol))
		limbic(width / 2, height / 2, 1000, 50)
		image(pg, 0, height - (100 + counter * gridSize), width, height)
		// scribbleWave()
		// ribbon()
		// shadingPencil()


		if (backCol === col3) {
			printingCan.fill(col4)
		} else {
			printingCan.fill(col3)
		}
		typoPencilPigments(printX - printsz * 4 + counter * 2.2, printY + printsz * 1.1 + random(-50, 10), random(height / 2000, height / 500))
		image(printingCan, 0, height - (100 + counter * 1.2 * gridSize), width, height)
		y = 50 + counter * gridSize;

		for (let x = 50; x < width - 50; x += gridSize) {

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
					dotHalftone(x, y, random(2, 3))
				} else {
					push()
					pg.noStroke()
					pg.fill(backCol)
					pg.rect(x, y, random(2, 5))
					pop()
				}
			}


			if (insideBigCircle) {
				if (dPressed == false) {
					drorb(x, y, wobble)
					orbOutline(bigCircle.center.x, bigCircle.center.y, bigCircle.radius)
				} else {
					rectz(x, y, random(8, 10))
				}
			}


			if (!insideBigCircle) {

				if (dPressed == false) {
					if (random() < 0.3) {
						let rndOff = 0
						let closestPoint = closestPointOnPolygon(x, y, nearestPolygon)
						let lineLength = dist(x, y, closestPoint.x, closestPoint.y)
						let smoothEdging = random(-30, 30)
						if (lineLength > 300 + smoothEdging) {
							if (counter % limit == true) {
								wobblyLineDrawn(x + random(-rndOff, rndOff), y + random(-rndOff, rndOff), closestPoint.x + random(-rndOff, rndOff), closestPoint.y + random(-rndOff, rndOff), wobble)
							}
						} else {
							wobblyLineDrawn(x + random(-rndOff, rndOff), y + random(-rndOff, rndOff), closestPoint.x + random(-rndOff, rndOff), closestPoint.y + random(-rndOff, rndOff), wobble)
						}
					}
				} else {
					let closestPoint = closestPointOnPolygon(x, y, nearestPolygon)
					let lineLength = dist(x, y, closestPoint.x, closestPoint.y)
					if (lineLength > 300) {
						if (counter % limit == true) {
							digitalLine(x, y, closestPoint.x, closestPoint.y, wobble)
						}
					} else {
						digitalLine(x, y, closestPoint.x, closestPoint.y, wobble)
					}
				}
			}

		}
		sprayWalk()
		// if (counter % 25 == 0 && dPressed == false) {
		// 	// laugh()
		// 	drawIsometricCube(random(width), random(height), random(5, 100), random(5, 100))
		// }

	}

	if (y > height - 50) {
		stopCounter = true

		if (dPressed == false) {
			for (i = 0; i < 50; i++) {
				texX = random(width)
				texY = random(height)
				wobblyLineTex(texX, texY, texX + random(-500, 500), texY + random(-500, 500), random(1, 10))
			}
			image(scribbles, 0, 0, width, height)
		}

		if (pixelDensity() <= 3 && dPressed == false) {
			tex()
			push()
			blendMode(HARD_LIGHT)
			image(overl, 0, 0, width, height)
			pop()
			grain(10)
		} else if (dPressed = true) {
			tex()
		}

		noLoop()
		fxpreview()

		if (pixelDensity() > 1) {
			saveCanvas(title + fxhash + ".png")
			saveCanvas(title + fxhash + ".jpg")
		}
	}
	let endTime = millis()
	let elapsedTime = (endTime - startTime) / 1000
	displayTime(elapsedTime)
	counter++
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

	pg.stroke(hue(colz) + random(-2, 2), saturation(colz) + random(-3, 3), brightness(colz) + random(-1, 1) - 5)
	pg.fill(hue(colz) + random(-2, 2), saturation(colz) + random(-3, 3), brightness(colz) + random(-1, 1))
	pg.rect(x, y, rectSz)

}

function dot(x, y, r) {
	pg.beginShape()
	const sides = random(2, 4)
	const increment = PI / sides
	const randomOffset = random(1, 2)

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
	const randomOffset = random(1, 2)
	pg.fill(backCol)
	pg.noStroke()
	for (let a = 0; a < TWO_PI; a += increment) {
		const angle = a + randomOffset
		const sx = x + Math.cos(angle) * r + random(2, 4)
		const sy = y + Math.sin(angle) * r + random(2, 4)
		pg.curveVertex(sx, sy)
	}
	pg.endShape(CLOSE)
}

function digitalLine(x, y, x1, y1, wobbliness) {
	if ($fx.getParam("colDist") == 'micro') {
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

		pg.strokeWeight(1)
		pg.stroke(hue(col2), saturation(col2), brightness(col2));
		pg.line(startX, startY, endX, endY);
	}
}

function wobblyLineSegmentDrawn(x, y, x1, y1, wobbliness) {
	
	let repellorX = bigCircle.center.x
	let repellorY = bigCircle.center.y
	let repellorSize = bigCircle.radius*2

	let attractorX = bigCircle.center.x
	let attractorY = bigCircle.center.y
	let attractorSize = bigCircle.radius*4

	if ($fx.getParam("colDist") == 'micro') {
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
		let baseWeight = 1.2

		let rndX = random(-1, 1)
		let rndY = random(-1, 1)
		let angle = atan2(endY - startY, endX - startX)
		angle = (angle * colorCount) / PI
		let colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
		let briIndex = map(angle, -180, 180, -5, 5)
		let col2 = colorzz[colorIndex]
		if (taperswitch < 0.5) {
			weight = baseWeight * map(1 - i / segments, 0, 1, 1.6, 4)
			saturationStart = saturation(col2) + 10
			saturationEnd = saturation(col2)
		} else {
			weight = baseWeight * map(i / segments, 0, 1, 1.6, 4)
			saturationStart = saturation(col2) - 8
			saturationEnd = saturation(col2) + 8
		}

		noiseDetail(noiseDetTexture, noiseDetTexFallOff)
		let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
		let colVarDet = map(noise(x * 0.05, y * 0.05), 0, 1, -3, 3)
		noiseDetail(noiseDet, noiseDetFallOff)

		// Calculate distance to repellor and attractor
		let distanceToRepellor = dist(pointX, pointY, repellorX, repellorY)
		let distanceToAttractor = dist(pointX, pointY, attractorX, attractorY)

		// Apply repellor and attractor forces with distance-based attenuation
		let repellorForce = 0;
		if (distanceToRepellor < repellorSize) {
			repellorForce = map(distanceToRepellor, 0, repellorSize, 2, 0) //adding random([2, 5, 20]) to the force
		}

		let attractorForce = 0;
		if (distanceToAttractor < attractorSize) {
			attractorForce = map(distanceToAttractor, 0, attractorSize, 0, 0); //4 4 the 4ce is good
		}

		// Calculate the normalized distance from the center of the repellor/attractor
		let repellorDistanceNormalized = map(distanceToRepellor, 0, repellorSize, 1, 0);
		let attractorDistanceNormalized = map(distanceToAttractor, 0, attractorSize, 1, 0);

		// Apply force with distance-based attenuation
		let finalX = pointX + repellorForce * (pointX - repellorX) * repellorDistanceNormalized + attractorForce * (attractorX - pointX) * attractorDistanceNormalized
		let finalY = pointY + repellorForce * (pointY - repellorY) * repellorDistanceNormalized + attractorForce * (attractorY - pointY) * attractorDistanceNormalized

		pg.stroke(hue(col2), saturationVal, brightness(col2) + colVarDet + briIndex)
		pg.strokeWeight(weight + random(-0.2, 0.2))
		pg.point(finalX + rndX, finalY + rndY)
	}
}


function wobblyLineDrawn(x, y, x1, y1, wobbliness) {
	taperswitch = random()
	colBriSwitch = random(-5, 5)
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
		wobblyLineSegmentDrawn(
			startX + random(-rndspread, rndspread),
			startY + random(-rndspread, rndspread),
			endX + random(-rndspread, rndspread),
			endY + random(-rndspread, rndspread),
			5)
		pop()
	}

}

function wobblyLineSegmentTex(x, y, x1, y1, wobbliness) {
	let texCol = random(colorpalette.colors)
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
		let baseWeight = 1.2

		let rndX = random(-1, 1)
		let rndY = random(-1, 1)

		if (taperswitch < 0.5) {
			weight = baseWeight * map(1 - i / segments, 0, 1, 0.05, 0.1)
			saturationStart = saturation(texCol) + 10
			saturationEnd = saturation(texCol)
		} else {
			weight = baseWeight * map(i / segments, 0, 1, 0.05, 0.1)
			saturationStart = saturation(texCol) - 5
			saturationEnd = saturation(texCol) + 5
		}
		let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd);

		scribbles.strokeWeight(weight + random(-0.5, 0.5))
		scribbles.stroke(hue(texCol), saturationVal, brightness(texCol))
		scribbles.point(pointX + rndX, pointY + rndY)
		scribbles.strokeWeight(weight * 2 + random(-0.2, 0.2))
		scribbles.point(pointX + rndX, pointY + rndY)
	}
}

function wobblyLineTex(x, y, x1, y1, wobbliness) {
	taperswitch = random()
	colBriSwitch = random(-5, 5)
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
		wobblyLineSegmentTex(
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
		let baseWeight = 1.2

		let rndX = random(-1, 1)
		let rndY = random(-1, 1)

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
			weight = baseWeight * map(1 - i / segments, 0, 1, 3, 5)
			saturationStart = saturation(colz) + 10
			saturationEnd = saturation(colz)
		} else {
			weight = baseWeight * map(i / segments, 0, 1, 3, 5)
			saturationStart = saturation(colz) - 8
			saturationEnd = saturation(colz) + 8
		}

		noiseDetail(noiseDetTexture, noiseDetTexFallOff)
		let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
		let colVarDet = map(noise(x * 0.005, y * 0.005), 0, 1, -3, 3)
		noiseDetail(noiseDet, noiseDetFallOff)

		pg.stroke(hue(colz), saturationVal, brightness(colz) + colVarDet)
		pg.strokeWeight(weight + random(-0.2, 0.2))
		pg.point(pointX + rndX, pointY + rndY)
	}
}

function orbLine(x, y, x1, y1, wobbliness) {
	taperswitch = random()
	colBriSwitch = random(-5, 5)
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

	if ($fx.getParam("background") == "dark") {
		pg.fill('#DED5CA')
	} else {
		pg.fill(20, 10, 20)
	}

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
	orbDrawStart += TWO_PI / random(450, 500)
}

function drorb(x, y, wobble) {
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
		push()
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
			let weight = map(xNoi, 0, noiVal, 0.2, 2)
			dot(x + xNoi, y + yNoi, weight)

		}

		for (let i = 0; i < length2; i += 8) {
			let x = lerp(x3, x4, i / length2)
			let y = lerp(y3, y4, i / length2)
			let xNoi = noise(x * 0.01, y * 0.01) * noiVal
			let yNoi = noise(x * 0.01, y * 0.01) * noiVal
			let weight = map(xNoi, 0, noiVal, 0.2, 2)
			dot(x + xNoi, y + yNoi, weight)
		}
	} else {
		push()
		pg.fill(hue(col3), saturation(col3), brightness(col3), random(0.2, 0.5))
		pg.noStroke()
		let length = dist(x1, y1, x2, y2)
		let length2 = dist(x3, y3, x4, y4)

		for (let i = 0; i < length; i += 10) {
			let x = lerp(x1, x2, i / length)
			let y = lerp(y1, y2, i / length)

			pg.rect(x, y, 2)
		}

		for (let i = 0; i < length2; i += 10) {
			let x = lerp(x3, x4, i / length2)
			let y = lerp(y3, y4, i / length2)

			pg.rect(x, y, 2)
		}
	}
	pop()
}

function tex() {
	for (let y = 0; y < height + 40; y += random(5, 7)) {
		rndX = random(-1, 1)
		rndY = random(-1, 1)

		texLines(-20 + rndX, y - 20 + rndY, width + 40 + rndX, y - 20 + rndY)
	}
}

function texLines(x, y, x1, y1) {
	overl.push()
	let controlPoints = []
	let controlPoints1 = []
	let d = dist(x, y, x1, y1)
	let segments = d * 0.1
	let segments2 = d * 0.05
	let alphaValues = []
	let strokeValues = []

	for (let i = 0; i <= segments; i++) {
		let xEnd = x + (x1 - x) * i / segments
		let yEnd = y + (y1 - y) * i / segments
		let noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
		let xOffset = map(noiseFactor, 0, 1, -10, 10)
		let yOffset = map(noiseFactor, 0, 1, -10, 10)

		controlPoints.push([xEnd + xOffset, yEnd + yOffset])
	}

	for (let i = 0; i <= segments; i++) {
		if (alpha == 0.5) {
			alphaValues.push(random(alpha - 0.4, alpha + 0.4))
		} else {
			alphaValues.push(random(alpha - 0.1, alpha + 0.1))
		}
		strokeValues.push(random(0.01, 2))
	}

	for (let i = 0; i <= segments2; i++) {
		let xEnd1 = x + (x1 - x) * i / segments2
		let yEnd1 = y + (y1 - y) * i / segments2
		let noiseFactor1 = noise(xEnd1 * 0.002, yEnd1 * 0.002)
		let xOffset1 = map(noiseFactor1, 0, 1, -10, 10)
		let yOffset1 = map(noiseFactor1, 0, 1, -10, 10)

		controlPoints1.push([xEnd1 + xOffset1, yEnd1 + yOffset1])
	}

	for (let i = 0; i < controlPoints.length - 1; i++) {
		overl.noFill()
		let startX = controlPoints[i][0]
		let startY = controlPoints[i][1]
		let endX = controlPoints[i + 1][0]
		let endY = controlPoints[i + 1][1]
		strk = random(0.1, 4)


		//shadows
		overl.stroke(0, 0, 10, 0.03)
		overl.strokeWeight(strk)
		overl.line(startX, startY, endX, endY)
		//highlights
		overl.stroke(0, 0, 90, 0.03)
		overl.strokeWeight(strk)
		overl.line(startX, startY - 2, endX, endY - 2)


	}
	overl.pop()
}

function grain(grainAmount) {
	loadPixels()
	for (let i = 0; i < pixels.length; i += 4) {
		let r = pixels[i]
		let g = pixels[i + 1]
		let b = pixels[i + 2]
		let a = pixels[i + 3]
		if (a > 0) {
			let grain = random(-grainAmount, grainAmount)
			pixels[i] = r + grain
			pixels[i + 1] = g + grain
			pixels[i + 2] = b + grain
		}
	}
	updatePixels()
}

function keyPressed() {
	if (key == 'p') saveCanvas(title + fxhash + ".png")
	if (key == 'j') saveCanvas(title + fxhash + ".jpg")

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
	saveCanvas(title + fxhash + ".jpg")
}

function displayTime(time) {
	let display = nf(time, 0, 2); // Format time with 2 decimal places
	timeDisplay.html("Time: " + display + " seconds"); // Update the time display
}
