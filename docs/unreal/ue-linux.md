# Unreal, Houdini Engine and Linux
All together at the same time. A guide.

The objective is to have a version of Unreal compiled from source, the latest Houdini Engine, and Houdini running in a Linux distro.

For this guide we have the following environment
* Engine Source folder at /home/USERX/source/unreal
* Houdini Launcher
* UE5 project folder at /home/USERX/dev/your_game
* JetBrains Rider
* Houdini Engine temporary folder at /home/USERX/downloads


Why Rider? It makes development in Linux a lot easier. Compiling the C++ project works out of the box. Getting other IDEs to work in Linux with Unreal is more involved, but possible.

## First Part: Install Unreal
This is straight forward if you follow the instructions from Unreal's website.
A small caveat is the file structure of your host system. If you are using a user directory that is mapped to a HDD instead of a SSD drive and Unreal is stored there, the iteration and compilation time will increase significantly (just as in a normal windows installation).

### Compiling UE4 vs UE5 and Houdini Engine

Differences

## Second Part: Install Houdini using the Launcher
A few version ago Houdini could only be installed using the command line, now we have the Houdini Launcher that makes the installation easier. Make sure to select from the launcher the following options
- what to include

special folders

Add houdini to environment path

## Third Part: Install Houdini Engine in your project
As mentioned before, it is not longer necessary to install Houdini Engine as an Engine Plugin, instead the Houdini Engine is installed as a project plugin

Download the closest version that matches your Houdini Launcher installation, if the minor version is different it is not an issue.

[Houdini Engine For Unreal - Releases](https://github.com/sideeffects/HoudiniEngineForUnreal/releases)

Copy the content of the downloaded zip file and paste it on `home/USERX/your_project/Plugins/Runtime/HoudiniEngine/

if the Runtime folder is missing, create it.

