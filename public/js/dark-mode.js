document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle')
  const body = document.body
  const heroImage = document.querySelector('[data-hero-image]')
  
  const lightModeImage = '/img/hero-image.webp'
  const darkModeImage = '/img/hero-image-dark.webp'

  function setDarkMode(isDark) {
      body.classList.toggle('dark-mode', isDark)
      if (heroImage) {
          heroImage.src = isDark ? darkModeImage : lightModeImage
      }
      localStorage.setItem('darkMode', isDark ? 'enabled' : null)
  }

  if (localStorage.getItem('darkMode') === 'enabled') {
      setDarkMode(true)
  }
  
  darkModeToggle.addEventListener('click', () => {
      setDarkMode(!body.classList.contains('dark-mode'))
  })
})