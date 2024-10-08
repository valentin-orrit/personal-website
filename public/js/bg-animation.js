document.addEventListener("DOMContentLoaded", () => {
    const circles = document.querySelectorAll(".circle, .far-circle")

    circles.forEach((circle, index) => {
        // Disable CSS animation
        circle.style.animation = 'none'

        // Get stored position or generate random start position
        let y = sessionStorage.getItem(`circle-${index}-y`)
        if (y === null) {
            y = Math.random() * window.innerHeight
        } else {
            y = parseFloat(y)
        }

        // Set initial position
        circle.style.transform = `translateY(${y}px) ${getScale(circle)}`

        // Determine direction (up or down)
        let direction = sessionStorage.getItem(`circle-${index}-direction`) || (Math.random() > 0.5 ? 1 : -1)
        direction = parseInt(direction)

        // Set speed for each circle (you can customize these values)
        const speed = getCircleSpeed(index)

        // Animation function
        function animate() {
            y += direction * speed // Use individual speed

            // Reverse direction at boundaries
            if (y > window.innerHeight + 100 || y < -100) {
                direction *= -1
                sessionStorage.setItem(`circle-${index}-direction`, direction.toString())
            }

            circle.style.transform = `translateY(${y}px) ${getScale(circle)}`
            sessionStorage.setItem(`circle-${index}-y`, y.toString())

            requestAnimationFrame(animate)
        }

        animate()
    })
})

// Helper function to get the scale transform from the original class
function getScale(element) {
    const transform = window.getComputedStyle(element).getPropertyValue('transform')
    if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform)
        return `scale(${matrix.a}, ${matrix.d})`
    }
    return ''
}

// Helper function to get speed based on circle index
function getCircleSpeed(index) {
    const speeds = [0.3, 0.5, 0.25, 0.45, 0.7, 0.6]
    return speeds[index % speeds.length]
}
