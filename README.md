<img src="https://raw.githubusercontent.com/themitosan/RJX_Toolset/master/App/img/logo.png" width="140" height="140">

# RJX_Toolset
The way(?) to deal with Ryujinx files!

## Features
- Update the emulator by using AppVeyor or Compiling the code locally¹
- You can set a custom branch to keep your emulator updated!
- Backup and restore your settings on your system.

## How to install
- Download this project from this repo using clone button
- Download <a href="https://nwjs.io/" target="_blank">NW.js</a> and extract it where you want
- Extract the files from this repo on nw.exe folder
- Run nw.exe

## Requirements
- Nwjs.io (aka. Node-WebKit)
- Windows Xcopy command²

### External apps used on this project
- <a href="https://www.7-zip.org/">7zip (32 / 64 bits)</a>
- <a href="https://jquery.com/">jQuery</a>
- <a href="https://jqueryui.com/">jQuery UI</a>

¹ - To compile the code locally, you need a specific version of dotnet sdk on your system
² - To test if your system have Xcopy: Open cmd, type "xcopy" without quotes and hit enter. If everything is ok, it should return "Invalid number of parameters 0 File(s) copied"