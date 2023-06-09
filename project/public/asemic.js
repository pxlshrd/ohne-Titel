
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

    let yOffset = gridSize + width / 30
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
    
    pg.strokeWeight(width / 1500)
    if (backCol === '#191818') {
        pg.stroke(80, 0.15);
    } else if (["#4C4C70", "#4B3663", "#4F4F4F", "#425E44", "#494A3F", "#72685D", '#686031', '#6A6452', '#616649'].includes(backCol)) {
        pg.stroke(15, 0.5);
    } else {
        pg.stroke(20, 0.2);
    }
    pg.noFill()
    
    pg.beginShape()
    for (let i = 0; i < length; i++) {
        let xPos = x + i * gridSize + random(-asemicJitter * 2, asemicJitter * 2)
        let yPos = y + random(-asemicJitter, asemicJitter)

        pg.curveVertex(xPos, yPos);
    }
    pg.endShape()
}