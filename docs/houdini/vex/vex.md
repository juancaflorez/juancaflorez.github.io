# Vex
## Operators
    
### Ternary

``` vex
v@Cg = (grp==0) ? {1.0, 0.0, 0.0} : {0.0 , 1.0 , 0.0};
```

## VEX Snippets
### Visualize a primitive vector attribute as a point

vector primitive attributes can\'t be visualized as points, this wrangle
creates a point where the vector prim attribute is:

```vex
// let 'hinge' be a vector prim attribute
vector location = prim(0, "hinge", @primnum);
addpoint(0, location);
removeprim(0, @primnum, 1);
```

### Random distribution

1.  Add to each point random points in a circle

    ```vex

    vector points[]; // not really necessary

    for (int i = 0; i < chi("pnum"); i++)
    {
        vector2 v2 = rand(@P.x + i, @P.z + i);
        vector2 in_circle = sample_circle_uniform(v2);
        in_circle *= 0.2;
        vector in_circle_v3 = set(in_circle.x + @P.x, @P.y, in_circle.y + @P.z);
        push(points, in_circle_v3); // umm
        addpoint(0, in_circle_v3);
    }

    ```

2.  Add points around a point and align to normal

    ```vex
    vector normal = normalize(@P);
    vector up = {0,1,0};
    matrix3 m = maketransform(normal, up);
    vector4 orient = quaternion(m);
    for (int i = 0; i < chi("pnum"); i++)
    {
        vector2 v2 = rand(@P.x + i, @P.z + i);
        vector2 in_circle = sample_circle_uniform(v2);
        in_circle *= chf("range");
        //The points aligned to the z axis, and up as 0,1,0
        vector in_circle_v3 = set(in_circle.x, in_circle.y, 0); // Important
        in_circle_v3 = qrotate(orient, in_circle_v3);
        in_circle_v3 += @P;
        addpoint(0, in_circle_v3);
    }
    ```

### Random int from number of points

```vex
// Detail mode
int numPts = npoints(0);
float randValue = rand(numPts + @Frame);
float fitFloat = fit(randValue, 0, 1, 0, poolNumPts -1);
int indexSelection = int(fitFloat);
```

### Color attribute by group

```vex
int grp = inpointgroup(0, "target", @ptnum);
v@Cg = (grp==0) ? {1.0, 0.0, 0.0} : {0.0 , 1.0 , 0.0};
```

### Input from ancillary

```vex
//where 1 is the input 2 of the attribute wrangles node
@P = point(1,"P",@ptnum);
```

[VEX syntax for accessing the other inputs in point wrangle? - General
Houdini...](https://forums.odforce.net/topic/23544-vex-syntax-for-accessing-the-other-inputs-in-point-wrangle/)
[Using secondary inputs on an wrangle
SOP](https://www.timucinozger.com/post/2015/07/24/using-secondary-inputs-on-an-wrangle-sop)

### Get number of points from ancillary

```vex
// detail mode
int numpnts = npoints(1);
printf("%g" , numpnts);
```

### Bounding box from second input (1)

``` {.c org-language="C"}
// Get bounding box from second input
vector bbox = getbbox_max(1);
// set/create new vector with only one compoment
vector maxy = set(0, bbox.y, 0);
v@P = v@P + maxy;
```

### Strings

1.  Float to Strings

    ```vex
    vector nodecimals = @P * 100;

    //s@uniqueId = sprintf("%02d", nodecimals.x);

    string pos = sprintf("%02d", nodecimals.x) +";"+ sprintf("%02d", nodecimals.z);

    s@uniqueId = "["+pos+"]";

    ```

    \% is the substitution, 02d the padding

### Nearest point from ancillary, write from input 1 to input 0

Let Input 0 be a regular points Input 1, a smaller set of points

Find the closest point index Run over: points

```vex
int near = nearpoint(1, v@P, chf("maxdist"));
i@near = near;
```

### Find the value of a variable in other table

Table 0:

| P   | ownerId    |
|-----|------------|
| xyz | someString |

Many positions with a name

Table 1:

| ownerId | Cd    |
|---------|-------|
| idA     | 1,1,1 |
| idB     | 0,0,0 |

Few colors, with a name associated this is like a dictionary, it will
only work if the keys are unique

```vex
string id = s@ownerId;
//int colorIndex = nametopoint(1, id);
int colorIndex = findattribval(1, "point", "ownerId", id);
vector color;
if (colorIndex == -1)
{
    color = {0,0,0};
}
else
{
    color = point(1, "Cd", colorIndex);
}
//printf("Color is: %f \n" , color);

v@Cd = color;

```

Now every point is colored by the colors table.

### Find unique attrib and group

```vex
// In detail mode
// searching for the endpoint attrib of a path, if is found more than once, reject
int unique[];

for (int i=0; i< i@numprim ; i++)
{
   int ending = prim(0, "endpt", i);
   int found = find(unique, ending);
   printf("found %d \n", found);

   if (found < 0){ // if value is negative, then it was found
      push(unique, ending);
      setprimgroup(0, "unique_path", i, 1);
   printf("Ending %d, at primnum %d \n", ending, i);
   }
}

```

### Curves

The following curves code was obtained from [vex --- John Svensson](https://www.johnsvensson.se/vex-houdini/)

1.  Curve U Map

    Curve U Map - Runs over several primitives

    Creates two point attributes. One 0 - 1 and one 0 - 1 - 0 along each
    curve, based on point number / vertex order for each primitive.

    Run in a Wrangle SOP (Run over - Primitives)

    ```vex
    float umap, umap_half;

    addattrib(geoself(), "point", "umap", 0.0);
    addattrib(geoself(), "point", "umap_half", 0.0);

    prim_points = primpoints(geoself(), @primnum);

    for ( int i = 0; i < len(prim_points); i++ ){

        umap = float(i) / (len(prim_points) - 1);
        umap_half = clamp(umap, 0, 0.5) * clamp(umap * -1 + 1, 0, 0.5) * 4;

        setattrib(geoself(), "point", "umap", prim_points[i], 0, umap, "set");
        setattrib(geoself(), "point", "umap_half", prim_points[i], 0, umap_half, "set");
    }
    ```

2.  Curve Normals

    Curve Normals - Runs over a single primitive

    Creates a normal along a single curve, two point based, un
    normalized

    Run in a Wrangle SOP (Run over - Points)

    ```vex
    vector pos, nor_a, nor_b;

    if ( @ptnum == 0) {
        getattribute(@OpInput1, pos, "point", "P", @ptnum + 1, 0);
        @N = @P - pos;
    } else if ( @ptnum == (npoints(@OpInput1) - 1) ) {
        getattribute(@OpInput1, pos, "point", "P", @ptnum - 1, 0);
        @N = pos - @P;
    } else {
        getattribute(@OpInput1, pos, "point", "P", @ptnum - 1, 0);
        nor_a = pos - @P;
        getattribute(@OpInput1, pos, "point", "P", @ptnum + 1, 0);
        nor_b = @P - pos;
        @N = (nor_a + nor_b) / 2;
    }
    ```

3.  Filter the first and last point of a curve

    Used to group points in a group expression or in a smooth points
    nodes

    ```vex
    // vex expression
    @ptnum==@numpt-1||@ptnum==0
    ```

### To equirectangular

**Not** the same as using \'topolar\' and \'frompolar\' in a VOP

```vex
//to spherical first
float theta = atan2(@P.z, @P.x);
float phi = acos(@P.y);
float rho = length(@P); // if radius == 1 then rho = 1

//rad to deg
float long = degrees(theta);
float lat = degrees(phi);

//fit
float x = fit(long, -180.0, 180, 0, 1);
float z = fit(lat, 0, 180, 0, 1);

// x by 2
@P = set(x*2, 0, z);

```

### From Cartesian to Spherical and back

```vex
//to spherical
//sphere of radius 1

float theta = atan2(@P.z, @P.x);
float phi = acos(@P.y);
//float rho = length(@P); // rad == 1
float rho = 1;

//to cartesian

float x = rho * sin(phi) * cos(theta);
float z = rho * sin(phi) * sin (theta);
float y = rho * cos (phi);

@P = set(x, y, z);
```

### Angle between two vectors

```vex
// Normalize the vectors first!
float angleBetween ( vector v1; vector v2 ) {
    // define up vector
    vector up = {0.0, 1.0, 0.0};

    float angle = acos(dot(v1, v2));
    int firstHalf = sign(dot(v2, cross(up, v1))) >= 0;
    angle = firstHalf ? angle : 2 * PI - angle;

    return degrees(angle);
}

```

### Append to array in detail

```vex
int sel_prims[] = {5, 21};
// this works
setdetailattrib(0, "sel_prims", sel_prims, "append");
// also works
foreach (int sel; sel_prims){
    setdetailattrib(0, "sel_prims", sel, "append");
}
```

### Get the component of a matrix

```vex
float some_val = getcomp(4@transform, 0, 1);
printf("%f", some_val);
```

[getcomp-vexreference](https://www.sidefx.com/docs/houdini/vex/functions/getcomp.html)

### Matrix to dictionary

```vex
// Prepare a dictionary for json export
// umatrix -> unity json matrix4x4
dict umatrix;

int mat_size = 4;

for (int row = 0; row < mat_size; ++row){
    for (int col = 0; col < mat_size; ++col){
        float comp_val = getcomp(4@transform, col, row);
        int icol = col*10 + row;
        string scol = sprintf("m%02d", icol);
        umatrix[scol]=comp_val;
    }
}
d@umatrix = umatrix;
```

### Dictionary in detail

Build a dict

```vex
// Move to detail
int num_layers = nuniqueval(0, "point", "layer_name");
string unique_layers[] = uniquevals(0, "prim", "layer_name");
//end detail

d@layer_cd = {};

foreach (int index; string layer ; unique_layers){
    vector rand_color = random(index);
    d@layer_cd[layer] = rand_color;
}
```

Read in prim mode

```vex
dict layers = detail(0, "layer_cd", 0);
string layer_name = prim(0, "layer_name", @primnum);
vector color = layers[layer_name];
@Cd = set(color.x, color.y, color.z);
```

### Get point neighbors

```vex
// point wrangle, points that share an edge
i[]@Neighbors = neighbours(0, @ptnum);
// or sorted
i[]@Neighbors = sort(neighbours(0, @ptnum));
```

### Write array as string

```vex
s@Nbg = "[";
int num_nbg = len(i[]@Neighbors);

for (int i=0; i < num_nbg ; i++){
    int n = i[]@Neighbors[i];
    s@Nbg += i < num_nbg - 1 ? itoa(n)+"," : itoa(n);

}
s@Nbg += "]";
```

### Add point in middle of prim and transfer attrib

```vex
string attribute_name = chs("attribute_name");
int attrib_val = prim(0, attribute_name, @primnum);
int ptn = addpoint(0,@P);
setpointattrib(0, attribute_name, ptn, attrib_val, "set");
removeprim(0, @primnum, 1);
```

### Rotate a vector around an axis

Rotating Normal

```vex
//enforce prototypes
float amount = chf("rot_amount");
vector @P;
vector @N;
vector axis = cross(@N, {0,1,0});
vector normal = normalize(@N);
matrix mat = instance(@P, normal);
rotate(mat, amount ,axis);
@N = @N*mat;
```
