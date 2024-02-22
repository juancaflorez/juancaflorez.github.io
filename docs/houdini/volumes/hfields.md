# Height fields

## From Height Fields to COPs and back

Document here how to go from the two context, the quirks and


## Basics
Hfs  are 2d volumes!!
[Texturing Landscapes for Games](https://www.youtube.com/watch?v=D0_77MjosUY)


## Delete all fields except height and masks
Using a delete node, in the grp expression write:
```hscript
// Run as a group filter
^@name=mask ^@name=height
```

## Sample a heightfield mask
Heightfields have an internal height, make sure to have the heightfield at the origin
```vex
//run over points
// input 0: points
// input 1: heightfield
// Heightfield = 0
vector local_pos = set(@P.x, 0, @P.z);
float mask = volumesample(1, 'mask', local_pos);
@Cd = set(0,0,mask);
f@masked = mask;
```

## Export a heightfield from mapbox to gaea

Reset to origin
```vex
// run over a hf wrangle, with grp: @name=height
vector bbox = getbbox_min(0);
float min = bbox.y;
@height -= min;
```

```vex
//Run over detail
vector size = getbbox_size(0);
f@height_factor = size.y/(size.x/2);
```

as expression on a Heightfield output node/To Range, high bound :

`detail("../set_detail/", "height_factor", 0)`

This is used to export the heightmap texture to gaea with the correct scaling factor
