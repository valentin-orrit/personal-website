document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.circle, .far-circle')

    circles.forEach((circle) => {
        const speed = Math.random() * 0.5 + 0.2
        const amplitude = Math.random() * 50 + 30
        const initialY = parseFloat(getComputedStyle(circle).top) || 0
        let timeOffset = Math.random() * 1000

        function animate() {
            const time = performance.now() * 0.001 + timeOffset
            const newY = initialY + Math.sin(time * speed) * amplitude
            circle.style.transform = `translateY(${newY}px) ${getScale(circle)}`
            requestAnimationFrame(animate)
        }

        animate()
    })

    // Helper function to retain the scale transformation if present
    function getScale(element) {
        const transform = window.getComputedStyle(element).transform
        if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform)
            return `scale(${matrix.a}, ${matrix.d})`
        }
        return ''
    }
})
