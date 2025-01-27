document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle')
    const body = document.body

    function setDarkMode(isDark) {
        body.classList.toggle('dark-mode', isDark)
        localStorage.setItem('darkMode', isDark ? 'enabled' : null)
    }

    if (localStorage.getItem('darkMode') === 'enabled') {
        setDarkMode(true)
    }

    darkModeToggle.addEventListener('click', () => {
        setDarkMode(!body.classList.contains('dark-mode'))
    })
})
