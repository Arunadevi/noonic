# 1-click-fwd Gmail Chrome Extension
- Open chrome://extension in Chrome browser
- Load unpacked extension
- Select root folder
- Open Gmail
- Open Developer Console and execute:
`localStorage.setItem("fwdfav","<favourite-email-id>")`
- Open an email in Gmail
- Fwd button is available on the right sidebar
- Clicking on it should fwd the last message in the current thread to <favourite-email-id>


