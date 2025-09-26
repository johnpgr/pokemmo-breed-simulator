// Get theme data from local storage
const currentTheme = localStorage.getItem("ui-theme")

function getPreferTheme() {
  // return theme value in local storage if it is set
  if (currentTheme && currentTheme !== "system") return currentTheme

  // return user device's prefer color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

let themeValue = getPreferTheme()

function reflectPreference() {
  document.firstElementChild.className = themeValue
}

// set early so no page flashes / CSS is made aware
reflectPreference()

window.onload = () => {
  // set on load so screen readers can get the latest value on the button
  reflectPreference()
}
