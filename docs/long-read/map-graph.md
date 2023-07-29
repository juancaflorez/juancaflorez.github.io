---
tags:
  - space
  - unity
  - pcg
---
# Runtime map generation

<figure class="video_container">
  <video controls="true" allowfullscreen="true">
    <source src="../rsr/mapgraph/territories.webm" type="video/webm">
  </video>
  <figcaption>Territories map generated from live data</figcaption>
</figure>

This page documents the creation process of selecting algorithms, libraries and shaders to create a runtime procedurally generated map.
No specific code from the project is shared here.

As it was the case in the planets long read document, the hardware limitations of a mobile device create are the biggest obstacle to overcome. From the beginning it was obvious that the map geometry would be composed of many non homogeneous elements and parts. This meant that instancing the geometry was not an option, and instead all the geometry would have to be merged into the least amount of pieces in order to reduce the draw calls.

## Inputs

The game is a persistent multiplayer game, and the players can own and conquer parts of the map, this changes are visible instantaneously. The game designer drives the many of the settings of the map (factions, owners, names) using a live spreadsheet, and the Art Lead can shape the look of the map moving the centers of each star system.

From the code side, the data is nested inside many c# objects, which can make harder to have a sense of the data while developing the system. 

The first step in the development was to format the data in a flat structure, similar to how Houdini represents point/prims data.

Data Validation: The coordinates must be checked for duplicates!

The coordinates of each star system of the map are the 

Red blob games

<figure markdown>
  ![Geometric structure](rsr/mapgraph/territories_terms.png){ loading=lazy }
  <figcaption>Geometry from the graph</figcaption>
</figure>


territory (group of regions)
region (voroinoi - site)
site (voroinoi)
frontier (delayunay)
border
corners 
perimeter (voroinoi)
neighbor (delayunay)

Designing the shape with voids
Shape of each ter is build from the proximity and angle from other territories



## Data preparation

Flatten the data, similar to the way houdini presents the data for a point/primitive.
basic types, uints, strings, arrays of uints

## Core algorithms

DelaunatorSharp -> Dual graph

Centers


Implementation
One class takes care of building the graph, static class, BuildGraph
Only takes coordinates, and guaranties that each coordinate will have the same index from the array of coordinates. No swapping or deleting indices
Special consideration should be given to avoid or reject sites that share the same coordinate, this will create errors in the next step

The result of building the graph includes, a delayunay graph and a voroinoi graph, along with vertices, edges and triangles. 

Second class: TerritoriesBuilder ingest the result and associates the indices of each entry with a voroinoi site

Sites marked as voids are removed from the available territories.
Adjacent regions are tagged as a borders

Afterwards the data is grouped, in this context (Unity) I use LINQ expressions. In Unreal a similar filtering can be done using Lambda functions



Expressions can create garbage, it is important to not use them in tasks with frequent updates, in this case the build process only happens when the data changes which can happen every 1 minute, enough for the garbage collector to do his job.

## Classify, sort, resolve, travel graphs

Rule based geometry construction and removal

Static functions return boolean, 
is region boundary
is frontier a gap

Find islands, recursive breadth search

g3 computational geometry library

## Center of a territory, challenge

mapbox polylabel algorithm

<figure markdown>
  ![Geometric structure](rsr/mapgraph/territories_center.png){ loading=lazy }
  <figcaption>Finding the center of each territory</figcaption>
</figure>

## Collaboration and credits

The work done for this feature includes the generation of the geometry and the preparation of the data embedded in the geometry, the shader and the map shape where created by other team members.

