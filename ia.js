const statusEl = document.querySelector(".status");
const resultEl = document.querySelector(".result");
const estimationEl = document.querySelector(".estimation");
const inputEl = document.querySelector(".input");
const outputEl = document.querySelector(".output");
const neuralNetworkEl = document.querySelector(".neuralNetwork");
let status = {}, previousStatus = {}
const config = {
}
const net = new brain.NeuralNetwork(config)

function estimate ({paddleX, x}) {
    const paddleCenterX= paddleX + paddleWidth / 2
    const left = x < paddleCenterX ? 1 : 0
    const right = x > paddleCenterX ? 1 : 0
    return { left, right }
}

let estimations = []

function toInput (status, previousStatus) {
    const paddleCenterX= paddleX + paddleWidth / 2
    return { move: status.x - paddleCenterX }
}

function format (prediction) {
    return {
        right: prediction ? prediction.right.toFixed(4) : 0,
        left: prediction ? prediction.left.toFixed(4) : 0
    }
}

function updateStatus () {
    status = exportStatus()
    if (status.x && previousStatus.x) {
        const input = toInput(status, previousStatus)
        statusEl.innerText = `game status: ${JSON.stringify(status)}`
        inputEl.innerText = `input: ${JSON.stringify(input)}`
        const modeEl = document.querySelector("input[name='mode']:checked");
        const learn = modeEl.value === 'learn'
        leftPressed = rightPressed = false
        if (learn) {
            resultEl.innerText = 'LEARNING'
            const estimation = estimate(status)
            outputEl.innerText = 'output (estimation): ' + JSON.stringify(estimation)

            estimations.push({input, output: estimation})
            train()

            if (estimation.left) leftPressed = true
            else if (estimation.right) rightPressed = true
        } else {
            resultEl.innerText = 'IA PLAYING'
            const prediction = format(net.run(input))
            outputEl.innerText = 'output (neural network prediction): ' + JSON.stringify(prediction)

            if (prediction.left > prediction.right) leftPressed = true
            else if (prediction.right > prediction.left) rightPressed = true
        }
    }
    previousStatus = status
    requestAnimationFrame(updateStatus)
}
updateStatus()


function train () {
    if (estimations.length) {
        const last = estimations[estimations.length - 1]
        estimationEl.innerText = `${estimations.length} estimations fed to neural network`
        net.train(estimations)
        neuralNetworkEl.innerText = 'Neural network: ' + JSON.stringify(net.toJSON())
    }
}
