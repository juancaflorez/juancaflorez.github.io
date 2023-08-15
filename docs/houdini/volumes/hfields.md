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
