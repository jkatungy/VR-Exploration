# Augmenting VR
## Physical Computing Project 03
Virtual Reality is an immersion into a surreal world where the only control is the start and finish time of the VR experience. With this project, I explored augmenting the VR experience by controlling what happens to you inside the VR world. I wanted to induce Vertigo by throwing my victim off a 10 storey building!

## Three js
For this project, the VR environment is in three js - a javascript based platform for creating and editing 3 dimensional environments. A customized three js file for google glass was used as a start up. The files were forked from the [instructor's github webpage](https://github.com/marsman12019/IDeATePhysCompProject03-Cardboard).
### Background image
The background image was set to an [equirectangular bird view photo](http://jasonperrone.com/2016/07/09/cocoa-water-tank-aerial-360/).
### Three js objects
Two 300 ft tall box towers connected by a bridge were placed within the scene on either side of the middle street. The viewer's original position was on tower A. A small stool was placed on top of tower B.

## VR interaction
While on top of tower A, the viewer can look all around at the town laid out below, to the horizon and up to the skies above. A soundtrack accompanies this exploration of the surroundings. The viewer sees tower B across the street and the connecting bridge on the right hand side from the start position. If the viewer decides to cross to tower B, they have to select the small stool on top of tower B by focusing the circular cursor on the stool. The stool lights up when it is selected and the viewer is automatically drawn along the bridge towards tower B. A appropriate 'danger' soundtrack plays when the viewer is on the bridge. [The video shows the augmented experience within VR.](https://youtu.be/6Xtu0nkEUJE)
The intention was to stop along the bridge if at all the viewer looked anywhere else other than the stool, i.e. if they deselected it. And while on the bridge, if the viewer looked down, they would be overcome by vertigo and fall to the street below! The downward motion would be triggered by a change in the phone accelerometer value. This part of the code is yet to be figured out. 

## Implements
1. dxf file of google VR box cardboard
2. two lenses
3. smart phone
4. raspberry pi

After cutting the vr box, place the two lenses, run the code by calling

```
npm install
```
on the raspberry pi while within the project folder. To run the code on the smart phone, make sure the phone is connected to the same network as the raspberry pi, type the raspberry pi IP address followed by the port into the phone browser.

```
https://---.---.---.---:3000
```


### Code
The program files including the javascript file were compiled in a folder and run off the raspberry pi using the node packet manager.
Within the script.js file under javascripts in the public folder
1. The background image which had earlier been downloaded into the public/3d/textures folder, was loaded into the worldSphere Mesh texture.
2. The buildings and bridge were created as meshes with texture
3. When the stool is picked (under the picker function), horizontal movement is initialized and the socket emits a catchphrase which will be be used to call the soundtrack.
4. In the animate function, the default soundtrack is called by a socket emit function. And when the stool is picked, the camera is moved along the bridge.
Within the www file under the bin folder;
1. the socket listens for and plays the soundtracks cued by the socket emits from the script.js file

## Images

1. ![VR on smart phone](https://github.com/jkatungy/VR-Exploration/blob/master/vr_images/VRonSmartPhone.JPG?raw=true)

2. ![VR Box showing phone](https://github.com/jkatungy/VR-Exploration/blob/master/vr_images/VRBox.JPG?raw=true)

3. ![VR Box through the lens](https://github.com/jkatungy/VR-Exploration/blob/master/vr_images/VRBox2.JPG?raw=true)
