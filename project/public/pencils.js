function pencilPigments(x, y, r) {
    pg.noStroke()
    pg.beginShape()
    const sides = random(4, 6)
    const increment = PI / sides
    const randomOffset = random(1, 2)


    for (let a = 0; a < TWO_PI; a += increment) {
        const angle = a + randomOffset
        const sx = x + Math.cos(angle) * r + random(2, 4)
        const sy = y + Math.sin(angle) * r + random(2, 4)
        pg.vertex(sx, sy)
    }

    pg.endShape(CLOSE)

}

function pencil(x, y, x1, y1, penCol) {
    const wobbliness = 100
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * random(0.3, 0.5)

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + ((x1 - x) * i) / segments
        const yEnd = y + ((y1 - y) * i) / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
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

function pencilArc(x, y, x1, y1) {
    const angleRndX = random(0.5, 2)
    const angleRndY = random(0.5, 2)
    const arcRadius = dist(x, y, x1, y1) / 2;
    const arcCenterX = (x + x1) / 2;
    const arcCenterY = (y + y1) / 2;

    const arcStartAngle = atan2(y - arcCenterY, x - arcCenterX);
    const arcEndAngle = atan2(y1 - arcCenterY, x1 - arcCenterX);

    const pointsOnArc = random(200, 300)
    const angleIncrement = (arcEndAngle - arcStartAngle) / pointsOnArc;

    for (let j = 0; j <= pointsOnArc; j++) {
        const angle = arcStartAngle + j * angleIncrement;
        let pointX = arcCenterX + arcRadius * cos(angle * angleRndX)
        let pointY = arcCenterY + arcRadius * sin(angle * angleRndY)

        const weightVarFac = noise(pointX * 0.01, pointY * 0.01);
        const weight = map(weightVarFac, 0, 1, height / 6000, height / 4000);

        pointX = constrain(pointX, 50, width - 50)
        pointY = constrain(pointY, 50, height - 50)

        if ($fx.getParam("background") == "dark") {
            pg.fill('#DED5CA')
        } else {
            pg.fill(20, 10, 20)
        }

        pencilPigments(
            pointX + random(-weight, weight),
            pointY + random(-weight, weight),
            weight
        );
    }
}

function pencilArcDraw() {

    const centerX = random(width)
    const centerY = random(height)
    pencilArc(centerX, centerY, centerX + random(-width / 2, width / 2), centerY + random(-height / 2, height / 2))

}

//loading typo
function typoPencilPigments(x, y, r) {

    printingCan.beginShape()
    const sides = random(4, 6)
    const increment = PI / sides
    const randomOffset = random(1, 2)

    printingCan.noStroke()
    for (let a = 0; a < TWO_PI; a += increment) {
        const angle = a + randomOffset
        const sx = x + Math.cos(angle) * r + random(2, 4)
        const sy = y + Math.sin(angle) * r + random(2, 4)
        printingCan.vertex(sx, sy)
    }

    printingCan.endShape(CLOSE)


}

function typoPencil(x, y, x1, y1) {
    printingCol = random(colorpalette.colors)
    const wobbliness = 100
    const controlPoints = []
    const d = dist(x, y, x1, y1)
    const segments = d * random(0.3, 0.5)

    for (let i = 0; i <= segments; i++) {
        const xEnd = x + ((x1 - x) * i) / segments
        const yEnd = y + ((y1 - y) * i) / segments
        const noiseFactor = noise(xEnd * 0.002, yEnd * 0.002)
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
            const weight = map(weightVarFac, 0, 1, height / 3000, height / 1000)

            if ($fx.getParam("background") == "dark") {
                printingCan.fill('#DED5CA')
            } else {
                printingCan.fill(20, 10, 20)
            }

            // printingCan.fill(hue(printingCol) - 20, saturation(printingCol), brightness(printingCol) - 20)

            typoPencilPigments(pointX + random(-weight, weight), pointY + random(-weight, weight), weight)
        }
    }
}

function printing(x, y, size) {

    const centerX = x - size / 2
    const centerY = y

    if (dPressed == false) {

        // P
        typoPencil(centerX - size * 3.2, centerY - size * 0.8, centerX - size * 3.2, centerY + size * 0.8)
        typoPencil(centerX - size * 3.2, centerY - size * 0.8, centerX - size * 2.4, centerY - size * 0.8)
        typoPencil(centerX - size * 3.2, centerY, centerX - size * 2.4, centerY)
        typoPencil(centerX - size * 2.4, centerY - size * 0.8, centerX - size * 2.4, centerY)

        // R
        typoPencil(centerX - size * 2, centerY - size * 0.8, centerX - size * 2, centerY + size * 0.8)
        typoPencil(centerX - size * 2, centerY - size * 0.8, centerX - size * 1.2, centerY - size * 0.8)
        typoPencil(centerX - size * 2, centerY, centerX - size * 1.2, centerY + size * 0.8);
        typoPencil(centerX - size * 1.2, centerY - size * 0.8, centerX - size * 1.2, centerY - size * 0.4)
        typoPencil(centerX - size * 1.2, centerY - size * 0.4, centerX - size * 2, centerY)

        // I
        typoPencil(centerX - size * 0.8, centerY - size * 0.8, centerX - size * 0.8, centerY + size * 0.8)

        // N
        typoPencil(centerX - size * 0.4, centerY - size * 0.8, centerX - size * 0.4, centerY + size * 0.8)
        typoPencil(centerX - size * 0.4, centerY - size * 0.8, centerX + size * 0.4, centerY + size * 0.8)
        typoPencil(centerX + size * 0.4, centerY - size * 0.8, centerX + size * 0.4, centerY + size * 0.8)

        // T
        typoPencil(centerX + size * 0.6, centerY - size * 0.8, centerX + size * 1.4, centerY - size * 0.8)
        typoPencil(centerX + size * 1, centerY - size * 0.8, centerX + size * 1, centerY + size * 0.8)

        // I
        typoPencil(centerX + size * 1.6, centerY - size * 0.8, centerX + size * 1.6, centerY + size * 0.8)

        // N
        typoPencil(centerX + size * 1.8, centerY - size * 0.8, centerX + size * 1.8, centerY + size * 0.8)
        typoPencil(centerX + size * 1.8, centerY - size * 0.8, centerX + size * 2.8, centerY + size * 0.8)
        typoPencil(centerX + size * 2.8, centerY - size * 0.8, centerX + size * 2.8, centerY + size * 0.8)

        // G
        typoPencil(centerX + size * 3.2, centerY - size * 0.8, centerX + size * 3.2, centerY + size * 0.8)
        typoPencil(centerX + size * 3.2, centerY + size * 0.8, centerX + size * 3.8, centerY + size * 0.8)
        typoPencil(centerX + size * 3.8, centerY + size * 0.8, centerX + size * 3.8, centerY);
        typoPencil(centerX + size * 3.6, centerY, centerX + size * 3.8, centerY);
        typoPencil(centerX + size * 3.2, centerY - size * 0.8, centerX + size * 3.8, centerY - size * 0.8)
    } else {
        if ($fx.getParam("background") == "dark") {
            printingCan.stroke('#DED5CA')
        } else {
            printingCan.stroke(20, 10, 20)
        }

        printingCan.strokeWeight(4)
        // P
        printingCan.line(centerX - size * 3.2, centerY - size * 0.8, centerX - size * 3.2, centerY + size * 0.8)
        printingCan.line(centerX - size * 3.2, centerY - size * 0.8, centerX - size * 2.4, centerY - size * 0.8)
        printingCan.line(centerX - size * 3.2, centerY, centerX - size * 2.4, centerY)
        printingCan.line(centerX - size * 2.4, centerY - size * 0.8, centerX - size * 2.4, centerY)

        // R
        printingCan.line(centerX - size * 2, centerY - size * 0.8, centerX - size * 2, centerY + size * 0.8)
        printingCan.line(centerX - size * 2, centerY - size * 0.8, centerX - size * 1.2, centerY - size * 0.8)
        printingCan.line(centerX - size * 2, centerY, centerX - size * 1.2, centerY + size * 0.8);
        printingCan.line(centerX - size * 1.2, centerY - size * 0.8, centerX - size * 1.2, centerY - size * 0.4)
        printingCan.line(centerX - size * 1.2, centerY - size * 0.4, centerX - size * 2, centerY)

        // I
        printingCan.line(centerX - size * 0.8, centerY - size * 0.8, centerX - size * 0.8, centerY + size * 0.8)

        // N
        printingCan.line(centerX - size * 0.4, centerY - size * 0.8, centerX - size * 0.4, centerY + size * 0.8)
        printingCan.line(centerX - size * 0.4, centerY - size * 0.8, centerX + size * 0.4, centerY + size * 0.8)
        printingCan.line(centerX + size * 0.4, centerY - size * 0.8, centerX + size * 0.4, centerY + size * 0.8)

        // T
        printingCan.line(centerX + size * 0.6, centerY - size * 0.8, centerX + size * 1.4, centerY - size * 0.8)
        printingCan.line(centerX + size * 1, centerY - size * 0.8, centerX + size * 1, centerY + size * 0.8)

        // I
        printingCan.line(centerX + size * 1.6, centerY - size * 0.8, centerX + size * 1.6, centerY + size * 0.8)

        // N
        printingCan.line(centerX + size * 1.8, centerY - size * 0.8, centerX + size * 1.8, centerY + size * 0.8)
        printingCan.line(centerX + size * 1.8, centerY - size * 0.8, centerX + size * 2.8, centerY + size * 0.8)
        printingCan.line(centerX + size * 2.8, centerY - size * 0.8, centerX + size * 2.8, centerY + size * 0.8)

        // G
        printingCan.line(centerX + size * 3.2, centerY - size * 0.8, centerX + size * 3.2, centerY + size * 0.8)
        printingCan.line(centerX + size * 3.2, centerY + size * 0.8, centerX + size * 3.8, centerY + size * 0.8)
        printingCan.line(centerX + size * 3.8, centerY + size * 0.8, centerX + size * 3.8, centerY);
        printingCan.line(centerX + size * 3.6, centerY, centerX + size * 3.8, centerY);
        printingCan.line(centerX + size * 3.2, centerY - size * 0.8, centerX + size * 3.8, centerY - size * 0.8)
    }
}

//spray
function sprayPigments(x, y, r) {
    colSpray = random(colorpalette.colors)
    if (dPressed == false) {
        pg.noStroke()
        pg.fill(colSpray)
        pg.beginShape()
        const sides = random(4, 6)
        const increment = PI / sides
        const randomOffset = random(1, 2)


        for (let a = 0; a < TWO_PI; a += increment) {
            const angle = a + randomOffset
            const sx = x + Math.cos(angle) * r + random(2, 4)
            const sy = y + Math.sin(angle) * r + random(2, 4)
            pg.vertex(sx, sy)
        }

        pg.endShape(CLOSE)
    } else {
        pg.fill(colSpray)
        pg.noStroke()
        random()
        random()
        random()
        random()
        pg.rect(x, y, r * 2)
    }

}

function sprayWalk() {
    for (let i = 0; i < 20; i++) {
        sprayPigments(walkX + random(-10, 10), walkY + random(-10, 10), random(height / 2000, height / 1000))

        switch (random([0, 1, 2, 3])) {
            case 0:
                walkX = walkX + random(10, 50);
                break;
            case 1:
                walkX = walkX - random(10, 50);
                break;
            case 2:
                walkY = walkY + random(10, 50);
                break;
            case 3:
                walkY = walkY - random(10, 50);
                break;
        }
        walkX = constrain(walkX, 0, width);
        walkY = constrain(walkY, 0, height);
    }
}

//brushes
function brushes() {
    let x = random(width)
    let y = random(height)
    let thickRnd = random(3, 15)
    let lenRnd = random(5, 20)
    brushCol = random(colorpalette.colors)

    pg.push()
    pg.translate(x, y)
    pg.rotate(random(0, TWO_PI))

    let numPoints = int(random(10, 30))

    for (let j = 0; j < numPoints; j++) {
        let amp = random(0, thickRnd)
        let angle = random(0, TWO_PI)
        let length = random(1, lenRnd)

        let sum = 1;
        for (let k = 0; k < length; k += 2) {
            let noiseX = noise(j * 0.1, k * 0.1)
            let noiseY = noise(j * 0.1, k * 0.1)
            let xCoord = sum + k + noiseX * random(10, 20)
            let yCoord = amp * sin(angle) + noiseY * random(10, 20)


            let px = xCoord - 10
            let py = amp * sin(angle)
            let cx = xCoord
            let cy = yCoord
            let nx = xCoord + 40
            let ny = amp * sin(angle)

            for (let t = 0; t <= 1; t += 0.1) {
                let xBezier = bezierPoint(px, cx, nx, nx, t)
                let yBezier = bezierPoint(py, cy, cy, ny, t)
                pg.fill(hue(brushCol), saturation(brushCol) + 20, brightness(brushCol))
                pencilPigments(xBezier, yBezier, random(height / 6000, height / 4000))
            }

            sum += length
        }
    }

    pg.pop()

}