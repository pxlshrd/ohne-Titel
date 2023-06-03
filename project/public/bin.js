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

function isPip(px, py, vertices) {
    let inside = false
    let i, j = vertices.length - 1

    for (i = 0; i < vertices.length; i++) {
        if ((vertices[i].y < py && vertices[j].y >= py || vertices[j].y < py && vertices[i].y >= py) &&
            (vertices[i].x <= px || vertices[j].x <= px)) {
            if (vertices[i].x + (py - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < px) {
                inside = !inside;
            }
        }
        j = i
    }

    return inside
}

function distToLineSegment(px, py, x1, y1, x2, y2) {
    let lineLength = dist(x1, y1, x2, y2)

    if (lineLength === 0) {
        return dist(px, py, x1, y1)
    }

    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (lineLength * lineLength)
    t = constrain(t, 0, 1)

    let closestX = x1 + t * (x2 - x1)
    let closestY = y1 + t * (y2 - y1)

    return dist(px, py, closestX, closestY)
}

function closestPointOnPolygon(px, py, vertices) {
    let minDist = Infinity
    let closestPoint = null

    for (let i = 0; i < vertices.length; i++) {
        let a = vertices[i]
        let b = vertices[(i + 1) % vertices.length]

        let point = closestPointOnLine(px, py, a.x, a.y, b.x, b.y)
        let distToPoint = dist(px, py, point.x, point.y)

        if (distToPoint < minDist) {
            minDist = distToPoint
            closestPoint = point
        }
    }

    return closestPoint
}

function closestPointOnLine(px, py, x1, y1, x2, y2) {
    let line = createVector(x2 - x1, y2 - y1)
    let lineSqMag = line.magSq()

    if (lineSqMag === 0) {
        return createVector(x1, y1)
    }

    let point = createVector(px - x1, py - y1)
    let t = point.dot(line) / lineSqMag

    t = min(max(t, 0), 1)

    return createVector(x1 + t * line.x, y1 + t * line.y)
}

function drawPolyOutlines() {
    if (dPressed == false) {
        let poiX = bigCircle.center.x
        let poiY = bigCircle.center.y

        for (let i = 0; i < polygon.length - 1; i++) {
            polyCrayonLine(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y, 100)
            polyCrayonLine(polygon[i].x, polygon[i].y, poiX, poiY, 5)

        }
        polyCrayonLine(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y, 100)

    } else {
        pg.stroke(col3)
        pg.strokeWeight(width * 0.00133)
        for (let i = 0; i < polygon.length - 1; i++) {
            pg.line(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y)
        }
        pg.line(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y)

    }
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
    if ($fx.getParam("colDist") == 'micro') {
        colorCount = random([0, 45, 90, 180])
    }
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

        let angle = atan2(endY - startY, endX - startX)
        angle = (angle * colorCount) / PI
        let colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
        let col2 = colorzz[colorIndex]

        pg.strokeWeight(width / 1500)
        pg.stroke(hue(col2), saturation(col2), brightness(col2))
        pg.line(startX, startY, endX, endY)
    }
}

function crayonLineSegment(x, y, x1, y1, wobbliness) {
    let repellorX = bigCircle.center.x
    let repellorY = bigCircle.center.y
    let repellorSize = bigCircle.radius * 2

    // let attractorX = bigCircle.center.x
    // let attractorY = bigCircle.center.y
    // let attractorSize = bigCircle.radius * 4

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
        let baseWeight = width / 1250

        let rndX = random(-width / 1500, width / 1500)
        let rndY = random(-width / 1500, width / 1500)

        let angle = atan2(endY - startY, endX - startX)
        angle = (angle * colorCount) / PI
        let colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
        let briIndex = map(angle, -180, 180, -5, 5)
        let col2 = colorzz[colorIndex]

        if (brushDir < 0.50) {
            if (taperswitch < 0.5) {
                weight = baseWeight * map(1 - i / segments, 0, 1, width / 937.5, crayonSz)
                saturationStart = saturation(col2) + 10
                saturationEnd = saturation(col2)
                saturationStart2 = saturation(sectionCol) + 10
                saturationEnd2 = saturation(sectionCol)
            } else {
                weight = baseWeight * map(i / segments, 0, 1, width / 937.5, crayonSz)
                saturationStart = saturation(col2) - 8
                saturationEnd = saturation(col2) + 8
                saturationStart2 = saturation(sectionCol) - 8
                saturationEnd2 = saturation(sectionCol) + 8
            }
        } else {
            weight = baseWeight * map(1 - i / segments, 0, 1, width / 937.5, crayonSz)
            saturationStart = saturation(col2) + 10
            saturationEnd = saturation(col2)
            saturationStart2 = saturation(sectionCol) + 10
            saturationEnd2 = saturation(sectionCol)
        }

        noiseDetail(noiseDetTexture, noiseDetTexFallOff)
        let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
        let saturationVal2 = map(i, 0, controlPoints.length, saturationStart2, saturationEnd2)
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
        if (insidePolygon && $fx.getParam("colDist") == 'section') {
            pg.stroke(hue(sectionCol), saturationVal2, brightness(sectionCol) + colVarDet + briIndex)
        } else {
            pg.stroke(hue(col2), saturationVal, brightness(col2) + colVarDet + briIndex)
        }
        pg.strokeWeight(weight + random(-width / 7500, width / 7500))
        pg.point(finalX + rndX, finalY + rndY)
    }
}

function crayonLine(x, y, x1, y1, wobbliness) {
    taperswitch = random()
    let controlPoints = []
    let d = dist(x, y, x1, y1)
    let segments = d * random(0.02, 0.06)

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
        rndspread = random(0, 5)

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

function polyCrayonLineSegment(x, y, x1, y1, wobbliness) {
    let repellorX = bigCircle.center.x
    let repellorY = bigCircle.center.y
    let repellorSize = bigCircle.radius * 2

    // let attractorX = bigCircle.center.x
    // let attractorY = bigCircle.center.y
    // let attractorSize = bigCircle.radius * 4

    if ($fx.getParam("colDist") == 'micro') {
        colorCount = random([0, 45, 90, 180])
    }
    let controlPoints = []
    let d = dist(x, y, x1, y1)
    let segments = d * 0.1

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

        if (brushDir < 0.50) {
            if (taperswitch < 0.5) {
                weight = baseWeight * map(1 - i / segments, 0, 1, width / 937.5, crayonSz)
                saturationStart = saturation(col2) + 10
                saturationEnd = saturation(col2)
                saturationStart2 = saturation(sectionCol) + 10
                saturationEnd2 = saturation(sectionCol)
            } else {
                weight = baseWeight * map(i / segments, 0, 1, width / 937.5, crayonSz)
                saturationStart = saturation(col2) - 8
                saturationEnd = saturation(col2) + 8
                saturationStart2 = saturation(sectionCol) - 8
                saturationEnd2 = saturation(sectionCol) + 8
            }
        } else {
            weight = baseWeight * map(1 - i / segments, 0, 1, width / 937.5, crayonSz)
            saturationStart = saturation(col2) + 10
            saturationEnd = saturation(col2)
            saturationStart2 = saturation(sectionCol) + 10
            saturationEnd2 = saturation(sectionCol)
        }

        noiseDetail(noiseDetTexture, noiseDetTexFallOff)
        let saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
        let saturationVal2 = map(i, 0, controlPoints.length, saturationStart2, saturationEnd2)
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
        if (insidePolygon && $fx.getParam("colDist") == 'section') {
            pg.stroke(hue(sectionCol), saturationVal2, brightness(sectionCol) + colVarDet + briIndex)
        } else {
            pg.stroke(hue(col2), saturationVal, brightness(col2) + colVarDet + briIndex)
        }
        pg.strokeWeight(weight + random(-width / 7500, width / 7500))
        pg.point(finalX + rndX, finalY + rndY)
    }
}

function polyCrayonLine(x, y, x1, y1, wobbliness) {
    taperswitch = random()
    let controlPoints = []
    let d = dist(x, y, x1, y1)
    let segments = d * random(0.01, 0.02)

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
        rndspread = random(0, 5)

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

    if ($fx.getParam("background") == "dark") {
        pg.fill('#DED5CA')
    } else {
        pg.fill(20, 10, 20)
    }

    // pencil outline
    pg.noStroke()
    for (let i = 0; i < density; i++) {
        let currentorbDrawStart = orbDrawStart + i * orbDrawStartStep
        if (i === counter % density) {
            let xOutl = x + cos(currentorbDrawStart) * radius + random(-strkW, strkW)
            let yOutl = y + sin(currentorbDrawStart) * radius + random(-strkW, strkW)
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
        let currentorbDrawStart = orbDrawStart + i * orbDrawStartStep
        if (i === counter % density / 2) {
            let xOutl = x + cos(currentorbDrawStart / 8) * radius * 1.2 + random(-strkW, strkW)
            let yOutl = y + sin(currentorbDrawStart / 8) * radius * 1.2 + random(-strkW, strkW)
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
    if (key == 'p') saveCanvas(title + "_" + $fx.getParam("iteration") + ".png")
    if (key == 'j') saveCanvas(title + "_" + $fx.getParam("iteration") + ".jpg")

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
    saveCanvas(title + "_" + $fx.getParam("iteration") + ".jpg")
}

function displayTime(time) {
    let display = nf(time, 0, 2)
    timeDisplay.html("Time: " + display + " seconds")
}