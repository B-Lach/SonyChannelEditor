const {BrowserWindow, app} = require('electron')

let win

function generateWindow() {
  win = new BrowserWindow({width: 800, heigth: 600})
  win.loadURL('file://' + __dirname + '/app/html/index.html')
}

app.on('ready', generateWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    generateWindow()
  }
});
