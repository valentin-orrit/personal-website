document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.circle, .far-circle')

    circles.forEach((circle, index) => {
        const animationConfig = {
            startY: getStoredPosition(index),
            direction: getStoredDirection(index),
            speed: getCircleSpeed(index),
            amplitude: getCircleAmplitude(index),
        }

        circle.style.transform = `translateY(${
            animationConfig.startY
        }px) ${getScale(circle)}`

        function animateCircle() {
            const time = performance.now() * 0.001

            const y =
                animationConfig.startY +
                Math.sin(time * animationConfig.speed) *
                    animationConfig.amplitude

            circle.style.transform = `translateY(${y}px) ${getScale(circle)}`

            sessionStorage.setItem(`circle-${index}-y`, y.toString())

            requestAnimationFrame(animateCircle)
        }

        animateCircle()
    })
})

function getStoredPosition(index) {
    const storedY = sessionStorage.getItem(`circle-${index}-y`)
    return storedY !== null
        ? parseFloat(storedY)
        : Math.random() * window.innerHeight
}

function getStoredDirection(index) {
    const storedDirection = sessionStorage.getItem(`circle-${index}-direction`)
    return storedDirection !== null
        ? parseInt(storedDirection)
        : Math.random() > 0.5
        ? 1
        : -1
}

function getScale(element) {
    const transform = window
        .getComputedStyle(element)
        .getPropertyValue('transform')
    if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform)
        return `scale(${matrix.a}, ${matrix.d})`
    }
    return ''
}

function getCircleSpeed(index) {
    // const speeds = [2, 2, 2, 2, 2, 2]
    const speeds = [0.2, 0.3, 0.4, 0.6, 0.8, 0.3]

    const speedMult = speeds.map((speed) => speed * 0.5)

    return speedMult[index % speeds.length]
}

function getCircleAmplitude(index) {
    const amplitudes = [300, 200, 300, 200, 300, 200]
    // const amplitudes = [50, 70, 40, 60, 80, 60]
    return amplitudes[index % amplitudes.length]
}
