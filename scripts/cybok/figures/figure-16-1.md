alt: Diagram of the web and mobile ecosystem: developers, app store, mobile devices, users, web browsers and web server, split into server side and client side.
---
A block diagram with icons and labelled arrows. A dashed horizontal line separates the upper part, labelled "Server Side" (top right corner), from the lower part, labelled "Client Side" (bottom right corner). The App Store and the Web Server sit on the dashed line's upper side; the Mobile Device and the Web Browser sit below it.

Elements:

- **App Store**: a box containing a grid of six app icons and the label "Security Checks".
- **Web Server**: a stack of three server units.
- **Mobile Device**: a stack of three phones, each showing a grid of app icons, with the brace label "Sandboxed Apps".
- **Web Browser**: a stack of three browser windows. The front window shows the address "https://example.com" and this page source:

  ```html
  <html>
  <head>
  <title>This is an example</title>
  </head>
  <script src="myscripts.js"></script>
  <body>
  ...
  </body>
  </html>
  ```

  A brace at the right of the windows is labelled "Isolated Websites".
- Three groups of three people icons: "Devs" (below the App Store), "Users" (between the Mobile Device and the Web Browser) and "Devs/Ops" (below the Web Server, at the right edge).

Arrows:

1. Devs to App Store: "Publish apps and push updates".
2. App Store to Mobile Device: "Push app updates".
3. Mobile Device to App Store: "Install apps".
4. Mobile Device and Web Server, with an arrowhead at each end: "Exchange Data with Application Server".
5. Web Browser to Web Server: "HTTPS Requests".
6. Web Server to Web Browser: "HTTPS Responses".
7. Users and Mobile Device, with an arrowhead at each end (no label).
8. Users and Web Browser, with an arrowhead at each end (no label).
9. Devs/Ops to Web Server: "Develop web applications and configure infrastructure".
