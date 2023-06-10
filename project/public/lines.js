function drawPolyOutlines() {
    if (!dPressed) {
        const poiX = bigCircle.center.x
        const poiY = bigCircle.center.y

        for (let i = 0; i < polygon.length - 1; i++) {
            polyCrayonLine(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y, 100)
            polyCrayonLine(polygon[i].x, polygon[i].y, poiX, poiY, 5)

        }
        if (!rndRectGrid && !rhombuses) {
            polyCrayonLine(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y, 100)
        }
    } else {
        pg.stroke(col3)
        pg.strokeWeight(2)
        for (let i = 0; i < polygon.length - 1; i++) {
            pg.line(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y)
        }
        if (!rndRectGrid && !rhombuses) {
            pg.line(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y)
        }
    }
}

function drawPolyOutlinesTop() {
    for (let i = 0; i < polygon.length - 1; i++) {
        polyCrayonLineTop(polygon[i].x, polygon[i].y, polygon[i + 1].x, polygon[i + 1].y, insanity)

    }
    if (!rndRectGrid && !rhombuses) {
        polyCrayonLineTop(polygon[polygon.length - 1].x, polygon[polygon.length - 1].y, polygon[0].x, polygon[0].y, insanity)
    }

}

function polyCrayonLineSegment(x, y, x1, y1, wobbliness) {
    const repellorX = bigCircle.center.x
    const repellorY = bigCircle.center.y
    const repellorSize = bigCircle.radius * 2

    // const attractorX = bigCircle.center.x
    // const attractorY = bigCircle.center.y
    // const attractorSize = bigCircle.radius * 4

    if (colDist.micro) {
        colorCount = random([0, 45, 90, 180])
    }
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.1

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length; i++) {
        const pointX = controlPoints[i][0]
        const pointY = controlPoints[i][1]
        const baseWeight = 1.2

        const rndX = random(-1, 1)
        const rndY = random(-1, 1)

        const angle = atan2(endY - startY, endX - startX)
        angle = (angle * colorCount) / PI
        const colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
        const briIndex = map(angle, -180, 180, -5, 5)
        const col2 = colorzz[colorIndex]

        if (brushDir < 0.50) {
            if (taperswitch < 0.5) {
                weight = baseWeight * map(1 - i / segments, 0, 1, 1.6, crayonSz)
                saturationStart = saturation(col2) + 10
                saturationEnd = saturation(col2)
                saturationStart2 = saturation(sectionCol) + 10
                saturationEnd2 = saturation(sectionCol)
            } else {
                weight = baseWeight * map(i / segments, 0, 1, 1.6, crayonSz)
                saturationStart = saturation(col2) - 8
                saturationEnd = saturation(col2) + 8
                saturationStart2 = saturation(sectionCol) - 8
                saturationEnd2 = saturation(sectionCol) + 8
            }
        } else {
            weight = baseWeight * map(1 - i / segments, 0, 1, 1.6, crayonSz)
            saturationStart = saturation(col2) + 10
            saturationEnd = saturation(col2)
            saturationStart2 = saturation(sectionCol) + 10
            saturationEnd2 = saturation(sectionCol)
        }

        noiseDetail(noiseDetTexture, noiseDetTexFallOff)
        const saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
        const saturationVal2 = map(i, 0, controlPoints.length, saturationStart2, saturationEnd2)
        const colVarDet = map(noise(x * 0.05, y * 0.05), 0, 1, -3, 3)
        noiseDetail(noiseDet, noiseDetFallOff)

        const distanceToRepellor = dist(pointX, pointY, repellorX, repellorY)
        // const distanceToAttractor = dist(pointX, pointY, attractorX, attractorY)

        // repellor forces with distance-based attenuation
        const repellorForce = 0

        if (distanceToRepellor < repellorSize) {
            repellorForce = map(distanceToRepellor, 0, repellorSize, repInfl, 0) //adding random([2, 5, 20]) to the force
        }

        // const attractorForce = 0;
        // if (distanceToAttractor < attractorSize) {
        // 	attractorForce = map(distanceToAttractor, 0, attractorSize, 0, 0); //4 4 the 4ce is good
        // }

        // Calculate the normalized distance from the center of the repellor/attractor
        const repellorDistanceNormalized = map(distanceToRepellor, 0, repellorSize, 1, 0)
        // const attractorDistanceNormalized = map(distanceToAttractor, 0, attractorSize, 1, 0);
        // Apply force with distance-based attenuation
        const finalX = pointX + repellorForce * (pointX - repellorX) * repellorDistanceNormalized// + attractorForce * (attractorX - pointX) * attractorDistanceNormalized
        const finalY = pointY + repellorForce * (pointY - repellorY) * repellorDistanceNormalized// + attractorForce * (attractorY - pointY) * attractorDistanceNormalized
        if (insidePolygon && colDist.section) {
            pg.stroke(hue(sectionCol), saturationVal2, brightness(sectionCol) + colVarDet + briIndex)
        } else {
            pg.stroke(hue(col2), saturationVal, brightness(col2) + colVarDet + briIndex)
        }
        pg.strokeWeight(weight + random(-0.2, 0.2))
        pg.point(finalX + rndX, finalY + rndY)
    }
}

function polyCrayonLine(x, y, x1, y1, wobbliness) {
    taperswitch = random()
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * random(0.01, 0.02)

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY

        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        startX = controlPoints[i][0]
        startY = controlPoints[i][1]
        endX = controlPoints[i + 1][0]
        endY = controlPoints[i + 1][1]

        push()
        crayonLineSegment(startX, startY, endX, endY, 0)
        pop()
    }

}

function polyCrayonLineTopSegment(x, y, x1, y1) {
    const repellorX = bigCircle.center.x
    const repellorY = bigCircle.center.y
    const repellorSize = bigCircle.radius * 2

    // const attractorX = bigCircle.center.x
    // const attractorY = bigCircle.center.y
    // const attractorSize = bigCircle.radius * 4

    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.3

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments

        controlPoints.push([xEnd, yEnd])
    }

    for (let i = 0; i < controlPoints.length; i++) {
        const pointX = controlPoints[i][0]
        const pointY = controlPoints[i][1]

        const distanceToRepellor = dist(pointX, pointY, repellorX, repellorY)
        // const distanceToAttractor = dist(pointX, pointY, attractorX, attractorY)

        // repellor forces with distance-based attenuation
        let repellorForce = 0

        if (distanceToRepellor < repellorSize) {
            repellorForce = map(distanceToRepellor, 0, repellorSize, repInfl, 0) //adding random([2, 5, 20]) to the force
        }

        // const attractorForce = 0;
        // if (distanceToAttractor < attractorSize) {
        // 	attractorForce = map(distanceToAttractor, 0, attractorSize, 0, 0); //4 4 the 4ce is good
        // }

        // Calculate the normalized distance from the center of the repellor/attractor
        const repellorDistanceNormalized = map(distanceToRepellor, 0, repellorSize, 1, 0)
        // const attractorDistanceNormalized = map(distanceToAttractor, 0, attractorSize, 1, 0);
        // Apply force with distance-based attenuation
        const finalX = pointX + repellorForce * (pointX - repellorX) * repellorDistanceNormalized// + attractorForce * (attractorX - pointX) * attractorDistanceNormalized
        const finalY = pointY + repellorForce * (pointY - repellorY) * repellorDistanceNormalized// + attractorForce * (attractorY - pointY) * attractorDistanceNormalized
        if (backCol === '#191818') {
            polyOutTop.fill('#DED5CA')
        } else {
            polyOutTop.fill(20, 10, 20)
        }
        polyOutTop.noStroke()
        pencilPigmentsPolyOut(finalX, finalY, random(0.5, 1))
    }
}

function polyCrayonLineTop(x, y, x1, y1, wobbliness) {
    taperswitch = random()
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.7

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
        pencilAngle = map(noiseFactor, 0, 1, -3, 3) * multY

        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        startX = controlPoints[i][0]
        startY = controlPoints[i][1]
        endX = controlPoints[i + 1][0]
        endY = controlPoints[i + 1][1]
        rndspread = pencilAngle

        push()
        polyCrayonLineTopSegment(
            startX + random(-rndspread, rndspread),
            startY + random(-rndspread, rndspread),
            endX + random(-rndspread, rndspread),
            endY + random(-rndspread, rndspread))
        pop()
    }

}

function digitalLine(x, y, x1, y1, wobbliness) {
    if (colDist.micro) {
        colorCount = random([0, 45, 90, 180])
    }
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.05

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        startX = controlPoints[i][0]
        startY = controlPoints[i][1]
        endX = controlPoints[i + 1][0]
        endY = controlPoints[i + 1][1]

        let angle = atan2(endY - startY, endX - startX)
        angle = (angle * colorCount) / PI
        const colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
        const col2 = colorzz[colorIndex]

        pg.strokeWeight(1)
        pg.stroke(hue(col2), saturation(col2), brightness(col2))
        pg.line(startX, startY, endX, endY)
    }
}

function crayonLineSegment(x, y, x1, y1, wobbliness) {
    const repellorX = bigCircle.center.x
    const repellorY = bigCircle.center.y
    const repellorSize = bigCircle.radius * 2

    // const attractorX = bigCircle.center.x
    // const attractorY = bigCircle.center.y
    // const attractorSize = bigCircle.radius * 4

    if (colDist.micro) {
        colorCount = random([0, 45, 90, 180])
    }
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.4

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length; i++) {
        const pointX = controlPoints[i][0]
        const pointY = controlPoints[i][1]
        const baseWeight = 1.2

        const rndX = random(-1, 1)
        const rndY = random(-1, 1)

        if (!colDist.wave) {

            let angle = atan2(endY - startY, endX - startX)
            angle = (angle * colorCount) / PI
            const colorIndex = int(map(angle, -180, 180, 0, colorzz.length))
            briIndex = map(angle, -180, 180, -5, 5)
            col2 = colorzz[colorIndex]
        } else {
            const waveDirectionX = Math.cos(waveAngle)
            const waveDirectionY = Math.log(waveAngle)
            const orthogonalDirectionX = Math.cos(waveAngle + dotWaveStretch)
            const orthogonalDirectionY = Math.sin(waveAngle + dotWaveStretch)//was (waveAngle + HALF_PI) before

            const projection = x * waveDirectionX + y * waveDirectionY
            const orthogonalProjection = x * orthogonalDirectionX + y * orthogonalDirectionY

            const waveValue = Math.sin(projection * dotWaveFreq2) * dotWaveAmp2
            const adjustedProjection = projection + waveValue
            briIndex = map(waveAngle, 0, TWO_PI, -5, 5)
            const variabledotWaveThick = dotWaveThick2 + Math.sin(orthogonalProjection * dotWaveFreq2) * dotWaveAmp2
            const colorIndex = int(abs(adjustedProjection / variabledotWaveThick)) % colorzz.length

            col2 = colorzz[colorIndex]
        }

        if (brushDir < 0.50) {
            if (taperswitch < 0.5) {
                weight = baseWeight * map(1 - i / segments, 0, 1, 1.6, crayonSz)
                saturationStart = saturation(col2) + 10
                saturationEnd = saturation(col2)
                saturationStart2 = saturation(sectionCol) + 10
                saturationEnd2 = saturation(sectionCol)
            } else {
                weight = baseWeight * map(i / segments, 0, 1, 1.6, crayonSz)
                saturationStart = saturation(col2) - 8
                saturationEnd = saturation(col2) + 8
                saturationStart2 = saturation(sectionCol) - 8
                saturationEnd2 = saturation(sectionCol) + 8
            }
        } else {
            weight = baseWeight * map(1 - i / segments, 0, 1, 1.6, crayonSz)
            saturationStart = saturation(col2) + 10
            saturationEnd = saturation(col2)
            saturationStart2 = saturation(sectionCol) + 10
            saturationEnd2 = saturation(sectionCol)
        }

        noiseDetail(noiseDetTexture, noiseDetTexFallOff)
        const saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
        const saturationVal2 = map(i, 0, controlPoints.length, saturationStart2, saturationEnd2)
        const colVarDet = map(noise(x * 0.05, y * 0.05), 0, 1, -3, 3)
        noiseDetail(noiseDet, noiseDetFallOff)

        const distanceToRepellor = dist(pointX, pointY, repellorX, repellorY)
        // const distanceToAttractor = dist(pointX, pointY, attractorX, attractorY)

        // repellor forces with distance-based attenuation
        let repellorForce = 0

        if (distanceToRepellor < repellorSize) {
            repellorForce = map(distanceToRepellor, 0, repellorSize, repInfl, 0) //adding random([2, 5, 20]) to the force
        }

        // const attractorForce = 0;
        // if (distanceToAttractor < attractorSize) {
        // 	attractorForce = map(distanceToAttractor, 0, attractorSize, 0, 0); //4 4 the 4ce is good
        // }

        // Calculate the normalized distance from the center of the repellor/attractor
        const repellorDistanceNormalized = map(distanceToRepellor, 0, repellorSize, 1, 0)
        // const attractorDistanceNormalized = map(distanceToAttractor, 0, attractorSize, 1, 0);
        // Apply force with distance-based attenuation
        const finalX = pointX + repellorForce * (pointX - repellorX) * repellorDistanceNormalized// + attractorForce * (attractorX - pointX) * attractorDistanceNormalized
        const finalY = pointY + repellorForce * (pointY - repellorY) * repellorDistanceNormalized// + attractorForce * (attractorY - pointY) * attractorDistanceNormalized
        if (insidePolygon && colDist.section) {
            pg.stroke(hue(sectionCol), saturationVal2, brightness(sectionCol) + colVarDet + briIndex)
        } else {
            pg.stroke(hue(col2), saturationVal, brightness(col2) + colVarDet + briIndex)
        }
        pg.strokeWeight(weight + random(-0.2, 0.2))
        pg.point(finalX + rndX, finalY + rndY)
    }
}

function crayonLine(x, y, x1, y1, wobbliness) {
    taperswitch = random()
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    let segments = d * random(0.02, 0.06)
    segments = min(segments, 20)

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY

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
    const texCol = random(colorpalette.colors.filter(color => color !== backCol))
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.8

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length; i++) {
        const pointX = controlPoints[i][0]
        const pointY = controlPoints[i][1]
        const baseWeight = 1.2

        const rndX = random(-1, 1)
        const rndY = random(-1, 1)

        if (taperswitch < 0.5) {
            weight = baseWeight * map(1 - i / segments, 0, 1, 0.05, 0.1)
            saturationStart = saturation(texCol) + 10
            saturationEnd = saturation(texCol)
        } else {
            weight = baseWeight * map(i / segments, 0, 1, 0.05, 0.1)
            saturationStart = saturation(texCol) - 5
            saturationEnd = saturation(texCol) + 5
        }
        const saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd);

        scribbles.strokeWeight(weight + random(-0.5, 0.5))
        scribbles.stroke(hue(texCol), saturationVal, brightness(texCol))
        scribbles.point(pointX + rndX, pointY + rndY)
        scribbles.strokeWeight(weight * 2 + random(-0.2, 0.2))
        scribbles.point(pointX + rndX, pointY + rndY)
    }
}

function smallSprayLine(x, y, x1, y1, wobbliness) {
    taperswitch = random()
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.1

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
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
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.3

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length; i++) {
        const pointX = controlPoints[i][0]
        const pointY = controlPoints[i][1]
        const baseWeight = 1.2

        const rndX = random(-1, 1)
        const rndY = random(-1, 1)

        const waveDirectionX = Math.cos(waveAngle)
        const waveDirectionY = Math.log(waveAngle)
        const orthogonalDirectionX = Math.cos(waveAngle + dotWaveStretch)
        const orthogonalDirectionY = Math.sin(waveAngle + dotWaveStretch)//was (waveAngle + HALF_PI) before

        const projection = x * waveDirectionX + y * waveDirectionY
        const orthogonalProjection = x * orthogonalDirectionX + y * orthogonalDirectionY

        const waveValue = Math.sin(projection * dotWaveFreq) * dotWaveAmp
        const adjustedProjection = projection + waveValue

        const variabledotWaveThick = dotWaveThick + Math.sin(orthogonalProjection * dotWaveFreq) * dotWaveAmp
        const colorIndex = int(abs(adjustedProjection / variabledotWaveThick)) % colorzz.length

        const colz = colorzz[colorIndex]

        if (taperswitch < 0.5) {
            weight = baseWeight * map(1 - i / segments, 0, 1, 3, crayonSz * 1.25)
            saturationStart = saturation(colz) + 10
            saturationEnd = saturation(colz)
        } else {
            weight = baseWeight * map(i / segments, 0, 1, 3, crayonSz * 1.25)
            saturationStart = saturation(colz) - 8
            saturationEnd = saturation(colz) + 8
        }

        noiseDetail(noiseDetTexture, noiseDetTexFallOff)
        const saturationVal = map(i, 0, controlPoints.length, saturationStart, saturationEnd)
        const colVarDet = map(noise(x * 0.005, y * 0.005), 0, 1, -3, 3)
        noiseDetail(noiseDet, noiseDetFallOff)

        pg.stroke(hue(colz), saturationVal, brightness(colz) + colVarDet)
        pg.strokeWeight(weight + random(-0.2, 0.2))
        pg.point(pointX + rndX, pointY + rndY)
    }
}

function orbLine(x, y, x1, y1, wobbliness) {
    taperswitch = random()
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.05

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const multX = Math.sin(noiseFactor * TWO_PI * 2)
        const multY = Math.cos(noiseFactor * TWO_PI * 2)
        const xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multX
        const yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * multY
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
    const density = 2
    const orbDrawStartStep = TWO_PI / density
    const strkW = random(1, 3)

    if (backCol === '#191818') {
        pg.fill('#DED5CA')
    } else {
        pg.fill(20, 10, 20)
    }

    // pencil outline
    pg.noStroke()
    for (let i = 0; i < density; i++) {
        const currentorbDrawStart = orbDrawStart + i * orbDrawStartStep
        if (i === counter % density) {
            let xOutl = x + cos(currentorbDrawStart) * radius + random(-strkW, strkW)
            let yOutl = y + sin(currentorbDrawStart) * radius + random(-strkW, strkW)
            const weightVarFac = noise(xOutl * 0.01, yOutl * 0.01)
            const weight = map(weightVarFac, 0, 1, 0.33, 0.5)
            xOutl = constrain(xOutl, 50, width - 50)
            yOutl = constrain(yOutl, 50, height - 50)
            pencilPigments(xOutl, yOutl, weight)
        }
    }
    // dashed circle
    pg.stroke(col3)
    for (let i = 0; i < 1; i++) {
        const currentorbDrawStart = orbDrawStart + i * orbDrawStartStep
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
    const angle = map(counter, 0, strokeNum, 0, TWO_PI)
    const x1 = x + cos(angle)
    const y1 = y + sin(angle) * size * vari1
    const x2 = x + cos(angle) * size * vari2
    const y2 = y + sin(angle) * size * vari3
    const x3 = x + cos(angle) * size * vari4
    const y3 = y + sin(angle) * size * vari5
    const x4 = x + cos(angle) * size * vari6
    const y4 = y + sin(angle) * size * vari7
    if (!dPressed) {

        pg.fill(hue(col3), saturation(col3), brightness(col3), random(0.2, 0.5))
        pg.noStroke()
        const length = dist(x1, y1, x2, y2)
        const length2 = dist(x3, y3, x4, y4)
        const noiVal = 40

        for (let i = 0; i < length; i += 8) {
            const x = lerp(x1, x2, i / length)
            const y = lerp(y1, y2, i / length)
            const xNoi = noise(x * 0.01, y * 0.01) * noiVal
            const yNoi = noise(x * 0.01, y * 0.01) * noiVal
            const weight = map(xNoi, 0, noiVal, 0.2, 2)
            dot(x + xNoi, y + yNoi, weight)

        }

        for (let i = 0; i < length2; i += 8) {
            const x = lerp(x3, x4, i / length2)
            const y = lerp(y3, y4, i / length2)
            const xNoi = noise(x * 0.01, y * 0.01) * noiVal
            const yNoi = noise(x * 0.01, y * 0.01) * noiVal
            const weight = map(xNoi, 0, noiVal, 0.2, 2)
            dot(x + xNoi, y + yNoi, weight)
        }
    } else {

        pg.fill(hue(col3), saturation(col3), brightness(col3), random(0.2, 0.5))
        pg.noStroke()
        const length = dist(x1, y1, x2, y2)
        const length2 = dist(x3, y3, x4, y4)

        for (let i = 0; i < length; i += 10) {
            const x = lerp(x1, x2, i / length)
            const y = lerp(y1, y2, i / length)

            pg.rect(x, y, 2)
        }

        for (let i = 0; i < length2; i += 10) {
            const x = lerp(x3, x4, i / length2)
            const y = lerp(y3, y4, i / length2)

            pg.rect(x, y, 2)
        }
    }

}

function tex() {
    for (let y = 0; y < height + 40; y += random(8, 10)) {
        const rndX = random(-1, 1)
        const rndY = random(-1, 1)

        texLines(-20 + rndX, y - 20 + rndY, width + width /8 + rndX, y - 20 + rndY)
    }

    for (let x = 0; x < width + 40; x += random(6, 10)) {
        const rndX = random(-1, 1)
        const rndY = random(-1, 1)

        texLines2(x - 26.66 + rndX, -26.66 + rndY, x - 26.66 + rndX, height + height / 10 + rndY)
    }
}

function texLines(x, y, x1, y1) {
    overl.push()
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.01

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const noiseFactorOpac = noise(xEnd * 0.5, yEnd * 0.5)
        const xOffset = map(noiseFactor, 0, 1, -30, 30)
        const yOffset = map(noiseFactor, 0, 1, -30, 30)
        opacNoiseShadows = map(noiseFactorOpac, 0, 1, 0, 10)
        opacNoiseLights = map(noiseFactorOpac, 0, 1, 80, 100)
        opacNoiseGlobal = map(noiseFactorOpac, 0, 1, 0.02, 0.04)

        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        overl.noFill()
        const startX = controlPoints[i][0]
        const startY = controlPoints[i][1]
        const endX = controlPoints[i + 1][0]
        const endY = controlPoints[i + 1][1]
        strk = random(0.5, 4)

        //shadows
        overl.stroke(0, 0, opacNoiseShadows)
        overl.strokeWeight(strk * 2)
        overl.line(startX, startY, endX, endY)
        //highlights
        overl.stroke(0, 0, opacNoiseLights)
        overl.strokeWeight(strk * 1.5)
        overl.line(startX, startY - 2, endX, endY - 2)


    }
    overl.pop()
}

function texLines2(x, y, x1, y1) {
    overl.push()
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * 0.01

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + (x1 - x) * i / segments
        const yEnd = y + (y1 - y) * i / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
        const xOffset = map(noiseFactor, 0, 1, -30, 30)
        const yOffset = map(noiseFactor, 0, 1, -30, 30)

        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        overl.noFill()
        const startX = controlPoints[i][0]
        const startY = controlPoints[i][1]
        const endX = controlPoints[i + 1][0]
        const endY = controlPoints[i + 1][1]
        strk = random(0.5, 4)

        //shadows
        overl.stroke(0, 0, opacNoiseShadows)
        overl.strokeWeight(strk * 2)
        overl.line(startX, startY, endX, endY)
        //highlights
        overl.stroke(0, 0, opacNoiseLights)
        overl.strokeWeight(strk * 1.5)
        overl.line(startX - 2, startY, endX - 2, endY)


    }
    overl.pop()
}