function weightedRnd(input) {
    const out = []

    for (let inp of input) {
        for (let i = 0; i < inp[1]; i++) {
            out.push(inp[0])
        }
    }

    const output = int(random(out.length))
    return out[output]
}

function colDistChooser(input) {
    let pool = []
  
    for (let dist of input) {
        colDist[dist.name] = false
        for (let i = 0; i < dist.probability; i++) {
            pool.push(dist.name)
        }
    }
  
    let selected = pool[int(random(pool.length))]
    colDist[selected] = true
  }

function checkRectCollision(rectVectors) {
    for (let i = 0; i < polygon.length; i++) {
        const other = polygon[i]
        for (let j = 0; j < other.length; j++) {
            const corner = other[j]
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
    const lineLength = dist(x1, y1, x2, y2)

    if (lineLength === 0) {
        return dist(px, py, x1, y1)
    }

    const t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (lineLength * lineLength)
    t = constrain(t, 0, 1)

    const closestX = x1 + t * (x2 - x1)
    const closestY = y1 + t * (y2 - y1)

    return dist(px, py, closestX, closestY)
}

function closestPointOnPolygon(px, py, vertices) {
    let minDist = Infinity
    let closestPoint = null
  
    for (let vertex of vertices) {
      const a = vertex;
      const b = vertices[(vertices.indexOf(vertex) + 1) % vertices.length]
  
      const point = closestPointOnLine(px, py, a.x, a.y, b.x, b.y)
      const distToPoint = dist(px, py, point.x, point.y)
  
      if (distToPoint < minDist) {
        minDist = distToPoint
        closestPoint = point
      }
    }
  
    return closestPoint
}

function closestPointOnLine(px, py, x1, y1, x2, y2) {
    const line = createVector(x2 - x1, y2 - y1)
    const lineSqMag = line.magSq()

    if (lineSqMag === 0) {
        return createVector(x1, y1)
    }

    const point = createVector(px - x1, py - y1)
    let t = point.dot(line) / lineSqMag

    t = min(max(t, 0), 1)

    return createVector(x1 + t * line.x, y1 + t * line.y)
}

function rectz(x, y, rectSz) {
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

    pg.noStroke()
    pg.fill(hue(colz) + random(-2, 2), saturation(colz) + random(-3, 3), brightness(colz) + random(-1, 1))
    pg.rect(x, y, rectSz)

}

function dot(x, y, r) {
    const sides = random(2, 4)
    const increment = PI / sides
    const randomOffset = random(1, 2)
    pg.beginShape()
    for (let a = 0; a < TWO_PI; a += increment) {
        const angle = a + randomOffset
        const sx = x + Math.cos(angle) * r
        const sy = y + Math.sin(angle) * r
        pg.curveVertex(sx, sy)
    }
    pg.endShape(CLOSE)
}

function dotHalftone(x, y, r) {
    const sides = random(2, 4)
    const increment = PI / sides
    const randomOffset = random(1, 2)
    pg.fill(backCol)
    pg.noStroke()
    pg.beginShape()
    for (let a = 0; a < TWO_PI; a += increment) {
        const angle = a + randomOffset
        const sx = x + Math.cos(angle) * r + random(2, 4)
        const sy = y + Math.sin(angle) * r + random(2, 4)
        pg.curveVertex(sx, sy)
    }
    pg.endShape(CLOSE)
}

function dotOutlineTop(x, y, r) {
    const sides = random(2, 4)
    const increment = PI / sides
    const randomOffset = random(1, 2)
    polyOutTop.beginShape()
    for (let a = 0; a < TWO_PI; a += increment) {
        const angle = a + randomOffset
        const sx = x + Math.cos(angle) * r
        const sy = y + Math.sin(angle) * r
        polyOutTop.curveVertex(sx, sy)
    }
    polyOutTop.endShape(CLOSE)
}

function grain(grainAmount) {
    loadPixels()
    const d = pixelDensity()
    const length = 4 * (width * d) * (height * d)
    const pixelsCopy = new Uint8ClampedArray(length)
    pixelsCopy.set(pixels)

    for (let i = 0; i < length; i += 4) {
        if (pixelsCopy[i + 3] > 0) {
            const grain = random(-grainAmount, grainAmount)
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
    if (key === 'p') saveCanvas(title + "_" + $fx.getParam("seeds") + ".png")
    if (key === 'j') saveCanvas(title + "_" + $fx.getParam("seeds") + ".jpg")

    if ("1" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(2, 1500, 2000)
        loop()
        draw()
    }

    if ("2" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(3, 1500, 2000)
        loop()
        draw()
    }

    if ("3" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(4, 1500, 2000)
        loop()
        draw()
    }

    if ("4" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(5, 1500, 2000)
        loop()
        draw()
    }

    if ("5" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(6, 1500, 2000)
        loop()
        draw()
    }

    if ("6" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(7, 1500, 2000)
        loop()
        draw()
    }

    if ("7" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(8, 1500, 2000)
        loop()
        draw()
    }

    if ("8" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(9, 1500, 2000)
        loop()
        draw()
    }

    if ("0" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(1, 1500, 2000)
        loop()
        draw()
    }

    if ("f" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        fPressed = true
        pxldrw(1, windowWidth * 2, windowHeight * 2)
        loop()
        draw()
    }

    if (fPressed && 'h' === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(4, windowWidth * 2, windowHeight * 2)
        loop()
        draw()
    }

    if ("d" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        dPressed = true
        pxldrw(1, 1500, 2000)
        loop()
        draw()
    }

    if ("w" === key) {
        fxrandminter = sfc32(...hashes)
        counter = 0
        closeLastRhombus = false
        isFirstIteration = true
        pxldrw(2, 1179, 2556)
        loop()
        draw()
    }
}

function touchStarted() {
    touchCount++;
  
    if (touches.length === 1) {
      saveTimeout = setTimeout(saveCan, 2000)
      saving = true;
    }
  
    if (touchCount === 5) {
      saveCanvas('myCanvas', 'jpg');
      touchCount = 0;  // reset the touch count after saving
    }
  }
  
  function touchMoved() {
    // prevent default
    return false;
  }
  
  function touchEnded() {
    if (saving) {
      clearTimeout(saveTimeout)
      saving = false;
    }
    // prevent default
    return false;
  }
  
  function saveCan() {
    saveCanvas(title + "_" + $fx.getParam("seeds") + ".jpg")
  }

function displayTime(time) {
    let display = nf(time, 0, 2)
    timeDisplay.html("Time: " + display + " seconds")
}