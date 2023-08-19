
# Basics

**The most important thing to learn about vex** [HoudiniVex -
Parallel](https://www.tokeru.com/cgwiki/index.php?title=HoudiniVex#Parallel_processing_part_2)

> That\'s hard to read, summarise please Ok fine. Imagine you\'re a
> point: Me affecting me, good. Others affecting me, good.Me affecting
> others, bad. Gross oversimplification, but that\'s the general idea.

A good example would be breadth search in a parallel context

## Create

* Set a new vector / Create a new vector

```vex
v@Cd = {0,0,0};
v@P = set(0,some_var,0);
```

* Access components of a vector

```vex
v@P.y
```

* Create array attribute using vex

```vex
// for this example running in detail mode
string unique[] = uniquevals(0, "prim", "name");
s[]@unique = unique;
i@maxunique = len(unique);
```

## For Loops

### for

```vex
// in the detail context
for (int i=0; i< i@numprim ; i++){
    if (prim(0, "plate", i) > 0) push(found, i);
}
```

### foreach

//TODO

## Groups

### Create a group

the "group\_" tells vex that is a group  
```vex
i@group_visited;
i@group_frontier;
```

### Add point to a group
```vex
setpointgroup(0, "grp_name", @ptnum, 1);
```
### Expressions
[Groups expression Node](https://www.artstation.com/blogs/jorgelega/7m1r/houdini-10-useful-vex-snippets-for-group-expression-node)
Randomize
```vex
rand(@elemnum) > chf("Amount")
```
### Negate group

As an expression "^somegrp"
```vex
//All but grp
^grp
```

### Get all the points in a group

```vex
// get all the points is in the target group 'target_pts'
// make sure the group is a point group
int targets[] = expandpointgroup(0, "target_pts", "unordered");
```
### Ad-hoc groups

source file: corruption.hiplc
In point mode
```vex
// I will use this as a tag to create an adhoc group down stream
s@prim_owner = itoa(@primnum); 
// itoa will cast int to a string
```

### How to use the ad-hoc grp

```vex
//to limit the nearpts search to only consider the points
//of the current primitive,
//an ad-hoc groups is created from a string tag
string s_primnum= itoa(@primnum); // cast int to string
string grp = "@prim_owner="+s_primnum; // build group expression
// grp is used to limit the search
int nearpts[] = nearpoints(0, grp, v@hingedir, 1, 3);
if (len(nearpts) == 0) return;
vector p0 = point(0,'P',nearpts[0]);
vector p1 = point(0,'P',nearpts[1]);
vector pivot = (p0+p1)/2; // the middle point
v@hinge = pivot;
// export points
i[]@nearpts = array(nearpts[0], nearpts[1]);
```

### More ad-hoc groups

To create groups on the fly using vex, there are several
functions, one vor each type of context
[expandpointgroup](https://www.sidefx.com/docs/houdini/vex/functions/expandpointgroup.html)

- expandprimgroup
- expandpointgroup


## Reference
Most of the tables were obtained from: [cgwiki](https://www.tokeru.com/cgwiki)
### General

  | type  | name     | description                         |
  |-------|----------|-------------------------------------|
  | int   | @ptnum   | Point Number                        |
  | int   | @numpt   | Total number of points              |
  | float | @Time    | Current time, in seconds            |
  | float | @TimeInc | Time increment per frame in seconds |
  | int   | @primnum | Primitive Number                    |
  | float | @Frame   | Current frame                       |
  | int   | @numprim | Total number of primitives          |
  | int   | @vtxnum  | Vertex number                       |
  | int   | @numvtx  | Total number of vertices            |


### Geometry

  | type   | name       | description                                                        |
  |--------|------------|--------------------------------------------------------------------|
  | vec3   | @P         | Point/Primitive Position                                           |
  | vec3   | @N         | Point/Primitive/Vertex Normal                                      |
  | vec3   | @v         | Velocity (ex: motion blur in particle systems)                     |
  | float  | @pscale    | Uniform scale. Used in copy-SOP or particle systems                |
  | vec3   | @scale     | Non-Uniform scale. For use see pscale                              |
  | vec3   | @up        | Up-Vector. Used together with @N to orient point/particle/instance |
  | vec4   | @orient    | Quaternion defining the rotation of a point/particle/instance      |
  | vec3   | @rot       | Quaternion definig additional rotation                             |
  | vec3   | @trans     | Translation of instance                                            |
  | matrix | @transform | Transformation matrix (used for example in Copy-Sop)               |
  | vec3   | @pivot     | Local pivot point for instance                                     |
  | float  | @lod       | Detail/Primitive level of detail                                   |
  | vec3   | @rest      | Rest position                                                      |
  | vec3   | @force     | Force (acting on particle)                                         |
  | float  | @age       | Particle Age                                                       |
  | float  | @life      | Max. Particle Life                                                 |

### Volumes
| type  | name            | description                                                            |
|-------|-----------------|------------------------------------------------------------------------|
| float | @density        | Density of voxel                                                       |
| int   | @ix, \@iy, \@iz | Voxel indices along each axis. Ranging from 0 to resolution -1         |
| vec3  | @center         | Center of current Volume                                               |
| vec3  | @orig           | Bottom left corner of current Volume                                   |
| vec3  | @size           | Size of current Volume                                                 |
| vec3  | @dPdx           | Change in position to get from one voxel to the next in x direction    |
| vec3  | @dPdy           | Change in position to get from one voxel to the next in y direction    |
| vec3  | @dPdz           | Change in position to get from one voxel to the next in z direction    |
| vec3  | @BB             | relative position inside bounding box. Ranging from {0,0,0} to {1,1,1} |

### Shading

| Type  | Name        Description |                              |
|-------|-------------------------|------------------------------|
| vec3  | @Cd                     | Diffuse Color                |
| float | @Alpha                  | Alpha Transparency           |
| vec3  | @uv                     | Point/Vertex/ UV coordinates |
| vec3  | @Cs                     | Specular Color               |
| vec3  | @Cr                     | Reflective Color             |
| vec3  | @Ct                     | Transmissive Color           |
| vec3  | @Ce                     | Emissive Color               |
| float | @rough                  | Roughness                    |
| float | @fresnel                | Fresnel Coefficient          |
| float | @shadow                 | Shadow intensity             |
| float | @sbias                  | Shadow bias                  |


### Types as Attributes

| type       | as~attrib~          | \"=\" value                                              |
|------------|---------------------|----------------------------------------------------------|
| int        | i@myint             | 5                                                        |
| float      | f@myfloat           | 12.3                                                     |
| vector2    | u@myvector2         | {0.6, 0.5}                                               |
| vector     | v@myvector          | {1,2,3}                                                  |
| quaternion | p@myquat            | {0,0,0,1}                                                |
| matrix2x2  | 2@mymatrix2         | {1,2,3,4}                                                |
| matrix3x3  | 3@mymatrix3         | {1,2,3,4,5,6,7,8,9}                                      |
| matrix4x4  | 4@mymatrix4         | {1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16}                 |
| string     | s@mystring          | \'single quotes string\' or \"inside double quotes str\" |
| dictionary | d@mydict            | {} // instantiate empty                                  |
| dictionary | d@mydict\[\'key\'\] | \"str value\" or other type, int, float, vector...       |


``` vex
// floats and integers
f@myfloat = 12.234; // float
i@myint = 5; // integer

// vectors
u@myvector2 = {0.6, 0.5}; // vector2 (2 floats)
v@myvector = {1,2,3}; // vector (3 floats)
p@myquat = {0,0,0,1}; // quaternion / vector4 / 4 floats

// matricies
2@mymatrix2 = {1,2,3,4}; // matrix2 (2x2 floats)
3@mymatrix3 = {1,2,3,4,5,6,7,8,9}; // matrix3 (3x3 floats)
4@mymatrix4 = {1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16}; // matrix (4x4 floats)

// strings and dictionaries
s@mystring = 'a string'; // string
d@mydict = {}; // dict, can only instantiate as empty type
d@mydict['key'] = 'value'; // can set values once instantiated

```
    
