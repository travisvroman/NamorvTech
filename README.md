# TS-Engine-Tutorial
TypeScript Game Engine Tutorial

This project is the source code generated as part of my tutorial series on YouTube. Follow along and subscribe!

## Playlist on YouTube:
https://www.youtube.com/playlist?list=PLv8Ddw9K0JPiTHLMQw31Yh4qyTAcHRnJx

# Projects Using this Engine
- StupidDuck - (FlappyBird Clone, 2D)
- TBD - (Vehicle Combat Game, 3D)
- TBD - (Networked RPG, 3D)

## Items to do:
- Asset loader error handling
- UI System with controls:
    - GameScreens
    - Panel (scrollable if set)
    - Label
    - Button
    - ImageBox
    - Checkbox
    - Radio Button
    - Window/Dialogs
- Multi-page bitmap fonts
- Configurable bitmap fonts
- Configurable audio
- State Machines 
- System fonts
- Advanced audio
- Configurable materials
- Move engine to its own library separate from game.
- Networking (including server?)
- 3D
    - Lighting
    - Normal maps
    - Specular maps
    - Physics
    - Object/mesh loading
    - Animation system
- RenderBuffer/PostFX system
- WebGL2?
- Input handler overhaul
- Zone overhaul - potentially change to a better format

# StupidDuck Post-Mortem
## Positives
+  Very flexible due to object/component/behavior structure
+  Adding features can be done in a decoupled, contained way
+  Supports auto-resizing and multiple browsers, including mobile
+  Underlying support for 3d, even though largely unused.

## Negatives
-  Zone files *very* verbose
-  No way to inherit configurations of objects/components/behaviours
-  Stand-up of components/behaviours involves a lot of boilerplate logic
-  Collision system is axis-aligned only and far from robust. Also only supports 2D
-  Lots of uncommented code that needs to be cleaned up and commented.
-  Very reliant on using Visual Studio. VS reliance should be removed in favour of a more flexible workflow (switch to VSCode and npm/http-server)
-  Debugging via IIS Express can be buggy (see previous point)
-  Game and Engine logic located in the same space. Should be separate projects and repos and packaged using npm.