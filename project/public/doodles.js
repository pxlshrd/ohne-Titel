function pencilScribblesDraw(numPoints) {
    let penCol = random(colorpalette.colors)

    const poiSpread = random(40, 80)


    let x = random(width)
    let y = random(height)

    pencil(
        x,
        y,
        x + random(-poiSpread, poiSpread),
        y + random(-poiSpread, poiSpread),
        penCol)
    pencil(
        x,
        y,
        x + random(-poiSpread, poiSpread),
        y + random(-poiSpread, poiSpread),
        penCol)
    pencil(
        x,
        y,
        x + random(-poiSpread, poiSpread),
        y + random(-poiSpread, poiSpread),
        penCol)

}

//isometric
function cubePencil(x, y, x1, y1, penCol) {
    const wobbliness = 10
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * random(0.3, 0.5)

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + ((x1 - x) * i) / segments
        const yEnd = y + ((y1 - y) * i) / segments
        const noiseFactor = noise(xEnd * 0.01, yEnd * 0.01)
        const xOffset =
            map(noiseFactor, 0, 1, -wobbliness, wobbliness) *
            Math.sin(noiseFactor * TWO_PI * 2)
        const yOffset =
            map(noiseFactor, 0, 1, -wobbliness, wobbliness) *
            Math.cos(noiseFactor * TWO_PI * 2)

        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        const startX = controlPoints[i][0]
        const startY = controlPoints[i][1]
        const endX = controlPoints[i + 1][0]
        const endY = controlPoints[i + 1][1]

        const pointsOnSegment = 2
        for (let j = 0; j < pointsOnSegment; j++) {
            const t = j / (pointsOnSegment - 1)
            const pointX = startX + (endX - startX) * t
            const pointY = startY + (endY - startY) * t

            const weightVarFac = noise(pointX * 0.01, pointY * 0.01)
            const weight = map(weightVarFac, 0, 1, height / 6000, height / 4000)

            pg.fill(hue(penCol), saturation(penCol) + 100, brightness(penCol))
            pencilPigments(pointX + random(-weight, weight), pointY + random(-weight, weight), weight)
        }
    }
}

function drawIsometricCube(cubeX, cubeY, cWidth, cHeight) {
    cubeCol = random(colorpalette.colors)
    pg.push()
    pg.translate(cubeX, cubeY)
    pg.rotate(random(0, TWO_PI))

    // top face
    cubePencil(0, 0, cWidth, -cHeight / 2, cubeCol)
    cubePencil(cWidth, -cHeight / 2, 0, -cHeight, cubeCol)
    cubePencil(0, -cHeight, -cWidth, -cHeight / 2, cubeCol)
    cubePencil(-cWidth, -cHeight / 2, 0, 0, cubeCol)

    // bottom face
    cubePencil(cWidth, cHeight / 2, 0, cHeight, cubeCol)
    cubePencil(0, cHeight, -cWidth, cHeight / 2, cubeCol)

    // connecting cubePencils
    cubePencil(0, 0, 0, cHeight, cubeCol)
    cubePencil(cWidth, -cHeight / 2, cWidth, cHeight / 2, cubeCol)
    cubePencil(-cWidth, -cHeight / 2, -cWidth, cHeight / 2, cubeCol)
    pg.pop()
}

//:D
function laugh() {

    let posX = random(width)
    let posY = random(height)
    let r = random(5, 20)
    let szmult = random(0.03, 0.8)
    let szmultEyes = random(0.03, 0.4)

    let n = r * 0.5
    let wobb = 30
    let noiVal = 0.01

    push()
    //head
    pg.beginShape()
    for (let i = 0; i < n; i++) {
        let angle = map(i, 0, n, 0, TWO_PI)
        if (r < width * 0.35) {
            xhead = r * 0.9 * cos(angle) + posX
            yhead = r * 0.9 * sin(angle) + posY
        } else {
            xhead = r * 0.95 * cos(angle) + posX
            yhead = r * 0.95 * sin(angle) + posY
        }
        let noiX = xhead * noiVal
        let noiY = yhead * noiVal
        let noiseVal = noise(noiX, noiY)
        let wobble = map(noiseVal, 0, 1, -wobb, wobb)

        pg.stroke(col3)
        pg.noFill()
        pg.curveVertex(xhead + wobble, yhead + wobble)
    }
    pg.endShape(CLOSE)

    //mouth
    pg.beginShape()
    for (let i = 0; i < n; i++) {
        let angle = map(i, 0, n, 0, PI)
        let x = r * szmult * cos(angle) + posX
        let y = r * szmult * sin(angle) + posY
        let noiX = x * noiVal
        let noiY = y * noiVal
        let noiseVal = noise(noiX, noiY)
        let wobble = map(noiseVal, 0, 1, -wobb, wobb)

        pg.stroke(col3)
        pg.noFill()
        pg.vertex(x + wobble, y + wobble)
    }
    pg.endShape(CLOSE)

    //eye left
    pg.beginShape()
    for (let i = 0; i < n; i++) {
        let angle = map(i, 0, n, 0, TWO_PI)
        let x = r * szmultEyes * cos(angle) + posX
        let y = r * szmultEyes * sin(angle) + posY
        let noiX = x * noiVal
        let noiY = y * noiVal
        let noiseVal = noise(noiX, noiY)
        let wobble = map(noiseVal, 0, 1, -wobb, wobb)

        pg.stroke(col3)
        pg.noFill()
        pg.curveVertex(x + wobble - r * 0.4, y + wobble - r * 0.4)
    }
    pg.endShape(CLOSE)

    //eye right
    pg.beginShape()
    for (let i = 0; i < n; i++) {
        let angle = map(i, 0, n, 0, TWO_PI)
        let x = r * szmultEyes * cos(angle) + posX
        let y = r * szmultEyes * sin(angle) + posY
        let noiX = x * noiVal
        let noiY = y * noiVal
        let noiseVal = noise(noiX, noiY)
        let wobble = map(noiseVal, 0, 1, -wobb, wobb)

        pg.stroke(col3)
        pg.noFill()
        pg.curveVertex(x + wobble + r * 0.4, y + wobble - r * 0.4)
    }
    pg.endShape(CLOSE)
    pop()

}

function connections(x, y, x1, y1, wobbliness) {
    let controlPoints = []
    let segments = 30
    let isSegment = true
    let colInd = floor(randomM0() * palette.length)

    for (let i = 0; i <= segments; i++) {
        let xEnd = x + (x1 - x) * i / segments
        let yEnd = y + (y1 - y) * i / segments
        let noiX = xEnd * 0.005
        let noiY = yEnd * 0.005
        let noiseFactor = noise(noiX, noiY)
        let xOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.sin(noiseFactor * TWO_PI * 2)
        let yOffset = map(noiseFactor, 0, 1, -wobbliness, wobbliness) * Math.cos(noiseFactor * TWO_PI * 2)

        controlPoints.push([xEnd + xOffset, yEnd + yOffset])
    }

    for (let i = 0; i < controlPoints.length - 1; i++) {
        let startX = controlPoints[i][0]
        let startY = controlPoints[i][1]
        let endX = controlPoints[i + 1][0]
        let endY = controlPoints[i + 1][1]
        let noiseFactor2 = noise((startX + endX) * 0.004, (startY + endY) * 0.004)
        let weight = map(noiseFactor2, 0, 1, 1, 5)

        pg.strokeWeight(3)
        pg.stroke(segmentColor)

        if (isSegment) {
            pg.line(startX, startY, endX, endY)
        }

        isSegment = !isSegment
    }
}

function drawConnections() {
    for (let i = 0; i < laughs.length; i++) {
        for (let j = i + 1; j < laughs.length; j++) {
            if (laughs[i].r > width * 0.04 && laughs[j].r > width * 0.04 && laughs[i].r < width * 0.35 && laughs[j].r < width * 0.35) {
                connections(laughs[i].x, laughs[i].y, laughs[j].x, laughs[j].y, 40)
            }
        }
    }
}

//asemic
function drawAsemic() {
    let gridSize = 10
    asemicJitter = random(5, 20)
    let spaceBetweenWords
    let wordCountInRow = 5
    let rowCount = random([10, 20, 30, 40, 50])
    asemicgridWidth = width
    asemicgridHeight = height

    let availableHeight = asemicgridHeight - (rowCount + 1)
    let spaceBetweenRows = availableHeight / rowCount

    let yOffset = gridSize + 50
    for (let row = 0; row < rowCount; row++) {
        let xOffset = gridSize + 40
        let availableWidth = asemicgridWidth - 2 * gridSize
        let totalWordWidth = 0
        let wordLengths = []

        for (let i = 0; i < wordCountInRow; i++) {
            let wordLength = random(20, 40)
            wordLengths.push(wordLength)
            totalWordWidth += wordLength * gridSize
        }

        let remainingSpace = availableWidth - totalWordWidth
        spaceBetweenWords = remainingSpace / (wordCountInRow - 1)

        for (let i = 0; i < wordCountInRow; i++) {
            drawWord(xOffset, yOffset, wordLengths[i])

            xOffset += wordLengths[i] * gridSize + spaceBetweenWords
        }
        yOffset += gridSize + spaceBetweenRows
    }
}

function drawWord(x, y, length) {
    pg.beginShape()
    pg.strokeWeight(1)
    if ($fx.getParam("background") == "dark") {
        pg.stroke(80, 0.2)
    } else {
        pg.stroke(20, 0.2)
    }
    pg.noFill()
    for (let i = 0; i < length; i++) {
        let xPos = x + i * gridSize + random(-asemicJitter * 2, asemicJitter * 2)
        let yPos = y + random(-asemicJitter, asemicJitter)
        // xPos = constrain(xPos, 50, asemicgridWidth - 50)
        pg.curveVertex(xPos, yPos);
    }
    pg.endShape()
}

//scribwave
function scribbleWave() {
    for (let i = 0; i < 5; i++) {
        let stepSize = 1
        scribWaveAngle += random(0.05, 0.2)

        let offsetX = sin(scribWaveAngle) * stepSize
        let offsetY = cos(scribWaveAngle) * stepSize

        offsetX += random(-0.2, 1)
        offsetY += random(-random(0.2, 2), 1)

        scribbWaveX += offsetX
        scribbWaveY += offsetY

        const weightVarFac = noise(scribbWaveX * 0.01, scribbWaveY * 0.01)
        const weight = map(weightVarFac, 0, 1, height / 4000, height / 2000)

        if ($fx.getParam("background") == "dark") {
            pg.fill('#DED5CA')
        } else {
            pg.fill(20, 10, 20)
        }
        pencilPigments(scribbWaveX, scribbWaveY, weight)

        stepSize += 0.5
    }

}

//ribbon
function ribbon() {
    for (let i = 0; i < 20; i++) {
        ribbonAngle += 1

        let offsetX = 0
        let offsetY = 0


        offsetX += sin(ribbonAngle) * 10
        offsetY += 0.4

        ribbonX += offsetX
        ribbonY += offsetY

        noiseFactor = noise(ribbonX * 0.01, ribbonY * 0.0015)
        let xOffset = map(noiseFactor, 0, 1, 0, width)

        const weightVarFac = noise(ribbonX * 0.01, ribbonY * 0.01)
        const weight = map(weightVarFac, 0, 1, height / 4000, height / 2000)

        if ($fx.getParam("background") == "dark") {
            pg.fill('#DED5CA')
        } else {
            pg.fill(20, 10, 20)
        }
        pencilPigments(xOffset, ribbonY, weight)

    }

}

function shadingPencil() {

    // for (let i = 0; i < 10; i++) {
    //     shadingPenX = shadingPenStartX + frameCount / 4
    //     shadingPenY = shadingPenStartY + sin(shadingFreq * shadingPenX) * shadingAmp
    //     shadingAmp += random(-1, 1)


    //     if ($fx.getParam("background") == "dark") {
    //         pg.fill('#DED5CA')
    //     } else {
    //         pg.fill(20, 10, 20, random(0.5, 1))
    //     }
    //     pencilPigments(shadingPenX + random(-1, 1), shadingPenY + random(-10, 10), 1, 1)
    // }

    incr = counter*10
        if ($fx.getParam("background") == "dark") {
            penCol1 = '#DED5CA'
        } else {
            penCol1 = (20, 10, 20)
        }
        pencil(shadingPenStartX + random(-5, 5), shadingPenStartY+ incr, shadingPenStartX+100 + random(-5, 5), shadingPenStartY+incr, penCol1)
    
}
