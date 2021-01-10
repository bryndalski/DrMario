'use strict'
//TODO  dodaj czyszczenie , warnuki na dodawanie , obracanie , uważaj na wsuwanie i obracanie , pozycje w tablicy 
const pillsColors = [{
        color: "red",
        imgSource: `url('./images/redPill.png')`
    },
    {
        color: "blue",
        imgSource: `url('./images/bluePill.png')`
    },
    {
        color: "yellow",
        imgSource: `url('./images/yellowPill.png')`
    },
]
const virusColor = [{
    color: "red",
    imagine: `url('./images/redVirus.gif')`
}, {
    color: "blue",
    imagine: `url('./images/blueVirus.gif')`
}, {
    color: "yellow",
    imagine: `url('./images/yellowVirus.gif')`
}]
let pillFallInterval;
const rotationAngles = ['rotate(0deg)', 'rotate(-180deg)', 'rotate(-90deg)', 'rotate(90deg)']
const game = {
    gameArray: [],
    level: 2,
    pillInfo: {},
    rotationAngle: 0,
    dropArray: [],
    pillSegmentLeft: {},
    pillSegmentRight: {},
    createGame: () => { // tworzy całą plansze z wyj. siatki ( dane bierze sobie z obiektu gameStartClass)
        game.gameArray = []
        game.dropArray = []
        game.pillInfo = {}
        Object.keys(gameStartClass).forEach(key => { //exctract object keys as [key1,key2,key3] then executes for each of them
            let elementContainer = document.createElement('div')
            elementContainer.classList.add(gameStartClass[key].container)
            Object.keys(gameStartClass[key]).forEach(insideKey => {
                if (insideKey !== 'container') {
                    let child = document.createElement('div')
                    child.classList.add(gameStartClass[key][insideKey])
                    elementContainer.appendChild(child)
                }
            })
            document.body.querySelector('.screen').appendChild(elementContainer)
        })
    },
    createWeb: () => {
        for (let row = 0; row < 16; row++) {
            game.gameArray[row] = []
            for (let column = 0; column < 8; column++) {
                game.gameArray[row][column] = {
                    squereId: parseInt(row + "" + column),
                    squereArrayCoords: {
                        row: row,
                        column: column
                    },
                    contains: {
                        possibleRotation: true,
                        possibleStopPoint: true
                    },
                }
                let webDiv = document.createElement('div')
                webDiv.id = parseInt(row + "" + column)
                document.querySelector('.netName').appendChild(webDiv)
            }
        }
    },
    //* Zabawa z tabletkami 
    createPill: () => {
        game.rotationAngle = 0;
        game.pillInfo = {}
        //IMPUT MARIO HERE 
        game.pillInfo = {
            leftSegment: {
                ...game.pillSegmentLeft,
                rotationAngle: rotationAngles[0]
            },
            rightSegment: {
                ...game.pillSegmentRight,
                rotationAngle: rotationAngles[1]
            },
            lastPositions: {
                left: 3,
                right: 4
            },
            unTransformedPosition: {
                left: 3,
            },
        }
    },
    pillPosition: (leftPill, rightPill) => {
        //clear last images 
        document.getElementById(game.pillInfo.lastPositions.left).style.backgroundImage = `url('')`
        document.getElementById(game.pillInfo.lastPositions.right).style.backgroundImage = `url('')`
        //new pills background
        document.getElementById(leftPill).style.backgroundImage = game.pillInfo.leftSegment.imgSource
        document.getElementById(rightPill).style.backgroundImage = game.pillInfo.rightSegment.imgSource
        //new pills rotation
        document.getElementById(leftPill).style.transform = game.pillInfo.leftSegment.rotationAngle
        document.getElementById(rightPill).style.transform = game.pillInfo.rightSegment.rotationAngle
        //arrar change
        game.pillInfo.lastPositions = {
            left: leftPill,
            right: rightPill
        }
    },
    //* Pozycjownowanie tabletek
    pillMove: (e) => {
        if (e.keyCode === 37 || e.keyCode === 65) { // move Left
            try {
                if ((game.pillInfo.lastPositions.left - 1) % 10 >= 0 && (game.pillInfo.lastPositions.left - 1) % 10 <= 7 && game.gameArray[Math.floor((game.pillInfo.lastPositions.left - 1) / 10)][(game.pillInfo.lastPositions.left - 1) % 10].contains.possibleRotation && game.gameArray[Math.floor((game.pillInfo.lastPositions.right - 1) / 10)][(game.pillInfo.lastPositions.right - 1) % 10].contains.possibleRotation) {
                    game.pillPosition((game.pillInfo.lastPositions.left - 1), (game.pillInfo.lastPositions.right - 1))
                    game.pillInfo.unTransformedPosition.left -= 1
                }
            } catch (err) {}
        }
        if (e.keyCode === 39 || e.keyCode === 68) { // move Right
            try {
                if ((game.pillInfo.lastPositions.right + 1) % 10 <= 7 && game.gameArray[Math.floor((game.pillInfo.lastPositions.left + 1) / 10)][(game.pillInfo.lastPositions.left + 1) % 10].contains.possibleRotation && game.gameArray[Math.floor((game.pillInfo.lastPositions.right + 1) / 10)][(game.pillInfo.lastPositions.right + 1) % 10].contains.possibleRotation) {
                    game.pillPosition((game.pillInfo.lastPositions.left + 1), (game.pillInfo.lastPositions.right + 1))
                    game.pillInfo.unTransformedPosition.left += 1
                }
            } catch (err) {}
        }
        //lewo rotacja
        if (e.keyCode === 38 || e.keyCode === 87) { // rotate left //TODO dodaj warunki 
            game.rotationAngle++
            if (game.rotationAngle === 4)
                game.rotationAngle = 0
            if (!game.pillRotate())
                game.rotationAngle--
        }
        //w prawo rotacja
        if (e.keyCode === 16) { // rotate right  //TODO dodaj warunki 
            game.rotationAngle--
            if (game.rotationAngle === -1)
                game.rotationAngle = 3
            if (!game.pillRotate())
                game.rotationAngle++
        }
        if (e.keyCode === 40 || e.keyCode === 83) {
            clearInterval(pillFallInterval)
            pillFallInterval = setInterval(game.pillFall, 50)
            document.removeEventListener('keydown', game.pillMove)
        }
    },
    pillFall: () => {
        try {
            if ((game.pillInfo.lastPositions.right + 10) / 10 < 16 && (game.pillInfo.lastPositions.left + 10) / 10 < 16 && game.gameArray[Math.floor((game.pillInfo.lastPositions.left + 10) / 10)][(game.pillInfo.lastPositions.left + 10) % 10].contains.possibleStopPoint && game.gameArray[Math.floor((game.pillInfo.lastPositions.right + 10) / 10)][(game.pillInfo.lastPositions.right + 10) % 10].contains.possibleStopPoint) {
                game.pillPosition((game.pillInfo.lastPositions.left + 10), (game.pillInfo.lastPositions.right + 10))
                game.pillInfo.unTransformedPosition.left += 10
            } else {
                game.setPillArray()
                clearInterval(pillFallInterval)
                game.fallCheck()
            }
        } catch (err) {
            game.setPillArray()
            clearInterval(pillFallInterval)
            game.fallCheck()
        }
    },
    pillRotate: () => {
        switch (game.rotationAngle) {
            case 0: //Wyjściowa pill : <=||=>
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.unTransformedPosition.left) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.lastPositions.left + 1) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[0]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[1]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left), (game.pillInfo.unTransformedPosition.left + 1))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
            case 1: //Do góry pill : v=||=^
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.unTransformedPosition.left) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left - 10) / 10)][(game.pillInfo.lastPositions.left) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[2]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[3]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left), (game.pillInfo.unTransformedPosition.left - 10))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
            case 2: //pill zamieniony stronami == > lewa||prawa >>>> prawa|lewa
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.unTransformedPosition.left + 1) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.lastPositions.left) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[1]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[0]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left + 1), (game.pillInfo.unTransformedPosition.left))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
            case 3: //Do góry pill : ^=||=v
                try {
                    if (game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left - 10) / 10)][(game.pillInfo.unTransformedPosition.left) % 10].contains.possibleRotation &&
                        game.gameArray[Math.floor((game.pillInfo.unTransformedPosition.left) / 10)][(game.pillInfo.lastPositions.left) % 10].contains.possibleRotation) {
                        game.pillInfo.leftSegment.rotationAngle = rotationAngles[3]
                        game.pillInfo.rightSegment.rotationAngle = rotationAngles[2]
                        game.pillPosition((game.pillInfo.unTransformedPosition.left - 10), (game.pillInfo.unTransformedPosition.left))
                        return true
                    }
                    return false
                } catch (err) {
                    return false
                }
                break
        }
    },
    //* moment końca operowania na pigułce 
    setPillArray: () => {
        game.gameArray[Math.floor(game.pillInfo.lastPositions.left / 10)][game.pillInfo.lastPositions.left % 10].contains = {
            type: "pill",
            color: game.pillInfo.leftSegment.color,
            rotationAngle: game.pillInfo.leftSegment.rotationAngle,
            points: 0,
            possibleRotation: false,
            possibleStopPoint: false
        }
        game.gameArray[Math.floor(game.pillInfo.lastPositions.right / 10)][game.pillInfo.lastPositions.right % 10].contains = {
            type: "pill",
            color: game.pillInfo.rightSegment.color,
            rotationAngle: game.pillInfo.rightSegment.rotationAngle,
            points: 0,
            possibleRotation: false,
            possibleStopPoint: false
        }
    },
    //*zbijania
    fallCheck: () => {
        let killArray = [],
            lastColor = "",
            dropCounter = 1,
            lastRow = 0,
            columnCounter = 0
        game.gameArray.forEach((littleArray, row) => {
            littleArray.forEach((index) => { // check for horizontal drops  
                if (lastRow !== row) {
                    killArray = []
                    dropCounter = 0
                    lastRow = row
                }
                if (index.contains.color !== undefined)
                    if (index.contains.color === "" || index.contains.color !== lastColor) {
                        lastColor = index.contains.color
                        killArray.push(index)
                        console.log(index)
                        if (dropCounter >= 4) {
                            dropCounter = 1
                            game.dropArray = game.dropArray.concat(killArray)
                            killArray = []
                        } else {
                            dropCounter = 1
                            killArray = []
                        }
                    }
                else {
                    dropCounter++
                    killArray.push(index)
                } else
                    lastColor = ""
            })
        })
        //vertical check
        game.gameArray[0].forEach((useless, counter) => {
            game.gameArray.forEach((index) => {
                if (lastRow !== counter) {
                    killArray = []
                    dropCounter = 0
                    lastRow = counter
                    lastColor = ""
                }
                if (index[counter].contains.color !== undefined)
                    if (index[counter].contains.color === "" || index[counter].contains.color !== lastColor) {
                        lastColor = index[counter].contains.color
                        killArray.push(index[counter])
                        if (dropCounter >= 4) {
                            dropCounter = 1
                            game.dropArray = game.dropArray.concat(killArray)
                            killArray = []
                        } else {
                            dropCounter = 1
                            killArray = []
                        }
                    }
                else {
                    dropCounter++
                    killArray.push(index[counter])
                } else
                    lastColor = ""
            })
        })
        console.log(game.dropArray)
        if (game.dropArray.length !== 0)
            game.killPill()
        else {
            mario.throwPill({
                "left": game.pillSegmentLeft,
                'right': game.pillSegmentRight
            })
        }
    },
    killPill: () => {
        game.dropArray.forEach((element, counter) => {
            console.log(element)
            document.getElementById(element.squereId).style.backgroundImage = `url()`
            game.gameArray[element.squereArrayCoords.row][element.squereArrayCoords.column] = {
                squereId: element.squereId,
                squereArrayCoords: {
                    row: element.squereArrayCoords.row,
                    column: element.squereArrayCoords.column
                },
                contains: {
                    possibleRotation: true,
                    possibleStopPoint: true
                },
            } //TODO finish me please m8 i love you have a great day
        }) // nawiązanie do Kill Bill :)
        game.dropArray = []
        // game.createPill()
        // pillFallInterval = setInterval(game.pillFall, 1000)
        // document.addEventListener('keydown', game.pillMove)
    },
    throwPill: () => {
        mario.throwPill({
            "left": game.pillSegmentLeft,
            'right': game.pillSegmentRight
        })
        if (game.gameArray[0][3].contains.possibleStopPoint && game.gameArray[0][4].contains.possibleStopPoint) {
            game.createPill()
            game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))]
            game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))]
        } else {
            document.removeEventListener('keydown', game.pillMove)
            clearInterval(pillFallInterval)
            mario.looser()
        }
    },
    //* wiruski 
    createVirusMap: () => {
        game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))] //finds next pill colors
        game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))] //finds next pill colors 
        let intervalCounter = 0
        for (let i = 0; i < gameLevelsSettings[game.level].virusNumber; i++) {
            intervalCounter++
            if (intervalCounter === 3)
                intervalCounter = 0
            let found = true
            do {
                let X = Math.floor(Math.random() * 11) + 5
                let Y = Math.floor(Math.random() * 8)
                if (Object.keys(game.gameArray[X][Y].contains).length == 2) {
                    found = false
                    game.gameArray[X][Y].contains = {
                        possibleRotation: false,
                        possibleStopPoint: false,
                        type: "virus",
                        color: virusColor[intervalCounter].color,
                        imagine: virusColor[intervalCounter].imagine
                    }
                }
            }
            while (found)
            if (i === gameLevelsSettings[game.level].virusNumber - 1) { // interval has ended 
                game.refreshNet()
                // game.throwPill()
                game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))] //TODO uncomment 
                game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))] //!!! uncomment 
                game.createPill()
                mario.throwPill({
                    "left": game.pillSegmentLeft,
                    'right': game.pillSegmentRight
                })
            }
        }
    },
    refreshNet: () => {
        for (let i = 0; i < game.gameArray.length; i++) {
            for (let j = 0; j < game.gameArray[i].length; j++) {
                if (game.gameArray[i][j].contains !== 2 && game.gameArray[i][j].contains.imagine != undefined) {
                    if (game.gameArray[i][j].contains.type === "virus")
                        switch (game.gameArray[i][j].contains.color) {
                            case "red":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = virusColor[0].imagine
                                break
                            case "blue":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = virusColor[1].imagine
                                break
                            case "yellow":
                                document.getElementById(game.gameArray[i][j].squereId).style.backgroundImage = virusColor[2].imagine
                                break
                        }
                }
            }
        }
    },


}
const mario = {
    createAnimationNet: () => {
        for (let i = 0; i < 50; i++) {
            let frame = document.createElement('div')
            frame.id = "animNet" + i;
            document.querySelector('.pillFlyContainer').appendChild(frame)
        }
        document.querySelector('.marioContainer').style.background = `url('./images/italianoWithDrugs.png')`
    },
    catchPill: () => {
        game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))] //TODO uncomment 
        game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))] //!!! uncomment 
        document.getElementById("animNet49").style.backgroundImage = game.pillSegmentLeft.imgSource
        document.getElementById("animNet48").style.backgroundImage = game.pillSegmentRight.imgSource
    },
    throwPill: (pillColors) => {
        let throwIntervalCounter = 0
        let flyInterval = setInterval(() => {
            if (throwIntervalCounter !== 0) {
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.left).style.backgroundImage = `url('')`
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.right).style.backgroundImage = `url('')`
            } //new pills background
            document.getElementById(flySchema[throwIntervalCounter].positions.left).style.backgroundImage = pillColors.left.imgSource
            document.getElementById(flySchema[throwIntervalCounter].positions.right).style.backgroundImage = pillColors.right.imgSource
            //new pills rotation
            document.getElementById(flySchema[throwIntervalCounter].positions.left).style.transform = flySchema[throwIntervalCounter].transformation.left
            document.getElementById(flySchema[throwIntervalCounter].positions.right).style.transform = flySchema[throwIntervalCounter].transformation.right
            //arrar change
            throwIntervalCounter++
            if (throwIntervalCounter === flySchema.length) {
                clearInterval(flyInterval)
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.left).style.backgroundImage = `url('')`
                document.getElementById(flySchema[throwIntervalCounter - 1].positions.right).style.backgroundImage = `url('')`
                //creates new pill
                game.createPill()
                game.pillPosition(3, 4)
                pillFallInterval = setInterval(game.pillFall, 1000)
                document.addEventListener('keydown', game.pillMove)
                //generate new pill colcor 
                mario.catchPill()
            }
        }, 100)
        //mario gif change here
    },
    looser: () => {
        document.querySelector('.marioContainer').style.background = `url('./images/sadMario.png')`
    }
}
window.addEventListener('DOMContentLoaded', (event) => {
    game.createGame()
    game.createWeb()
    mario.createAnimationNet()
    game.createVirusMap()
    game.refreshNet()
    // //!!!should be romved
    // game.pillSegmentLeft = pillsColors[Math.floor(Math.random() * (3))] //TODO uncomment 
    // game.pillSegmentRight = pillsColors[Math.floor(Math.random() * (3))] //!!! uncomment 
    // game.createPill()
    // mario.throwPill({
    //     "left": game.pillSegmentLeft,
    //     'right': game.pillSegmentRight
    // })
});