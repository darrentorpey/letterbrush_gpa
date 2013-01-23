/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {
      width:     855,
      height:    630,
      minWidth:  855,
      minHeight: 630,
      left:      20,
      top:       145
    },
    function(appWindow) {
      appWindow.drawAttention();
  });
});
