const statusEl = document.querySelector(".status")
const resultEl = document.querySelector(".result")
const estimationEl = document.querySelector(".estimation")
const inputEl = document.querySelector(".input")
const outputEl = document.querySelector(".output")
const neuralNetworkEl = document.querySelector(".neuralNetwork")
const autolearnEl = document.querySelector("input[name='autolearn']")
const net = new brain.NeuralNetwork({})
let status = {}

function estimate ({paddleX, x}) {
    const paddleCenterX= paddleX + paddleWidth / 2
    const left = x < paddleCenterX ? 1 : 0
    const right = x > paddleCenterX ? 1 : 0
    return { left, right }
}

function getHumanEstimate() {
    return {
        right: rightPressed ? 1 : 0,
        left: leftPressed ? 1 : 0
    }
}

let estimations = []

function toInput (status) {
    const paddleCenterX= paddleX + paddleWidth / 2
    const diffX = status.x - paddleCenterX
    return { diffX }
}

function format (prediction) {
    return {
        right: prediction.right.toFixed(2),
        left: prediction.left.toFixed(2)
    }
}

function updateStatus () {
    status = exportStatus()
    if (status.x) {
        const input = toInput(status)
        statusEl.innerText = `game status: ${JSON.stringify(status, null, 2)}`
        inputEl.innerText = `input: ${JSON.stringify(input)}`
        const modeEl = document.querySelector("input[name='mode']:checked");
        const learn = modeEl.value === 'learn'
        if (learn) {
            if (autolearnEl.checked) {
                resultEl.innerText = 'AUTO-LEARNING'
                leftPressed = rightPressed = false
                const estimation = estimate(status)
                outputEl.innerText = 'output: ' + JSON.stringify(estimation)
                estimations.push({input, output: estimation})
                train()
                if (estimation.left) leftPressed = true
                else if (estimation.right) rightPressed = true
            } else {
                resultEl.innerText = 'LEARNING FROM HUMAN'
                const estimation = getHumanEstimate()
                outputEl.innerText = 'output: ' + JSON.stringify(estimation)
                estimations.push({input, output: estimation})
                train()
            }
        } else {
            leftPressed = rightPressed = false
            resultEl.innerText = 'IA PLAYING'
            const prediction = net.run(input)
            if (prediction) {
                outputEl.innerText = 'output: ' + JSON.stringify(format(prediction))
                if (prediction.left > prediction.right) leftPressed = true
                else if (prediction.right > prediction.left) rightPressed = true
            }
        }
    }
    requestAnimationFrame(updateStatus)
}
updateStatus()


function train () {
    if (estimations.length) {
        const last = estimations[estimations.length - 1]
        estimationEl.innerText = `${estimations.length} estimations fed to neural network`
        net.train(estimations, {timeout: 15})
        neuralNetworkEl.innerText = 'Neural network: ' + JSON.stringify(net.toJSON(), null, 2)
    }
}
