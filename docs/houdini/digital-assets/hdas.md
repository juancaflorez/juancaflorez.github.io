# HDAs

## Embedded Assets

[Embedded Assets](https://youtu.be/DqWRxRGe5gw?t=1099)
[Referring to embedded asset files using opdef:](https://www.sidefx.com/docs/houdini/assets/opdef.html)

```hscript
opdef:..?name
```
## Building large networks

### Autobindings

When building large networks name of parameters are likely to change, for this case Houdini gives us autobindings for VOPs and wrangle nodes.
Autobindings map an external variable name to a internal one inside the wrangle/vop

![auto 01](../rsr/hdas/auto_01.png)
![auto 02](../rsr/hdas/auto_02.png)

### Op: syntax

> In various places in Houdini, nodes may have a parameter which expects a file name of a file containing a specific type of data. In these types of parameters you can usually use op:/path/to/node instead of a file name to grab data from live nodes in the scene hierarchy instead of from a file.

[op: syntax](https://www.sidefx.com/docs/houdini/io/op_syntax.html)

``` hscript
op:/geo1/volume1
```

relative

``` hscript
// relative path
op:`opfullpath('../detailsmap/OUT')`
```

### Add a fallback input to an HDA

[Houdini - Switch When Input is Empty| Artstation](https://www.artstation.com/blogs/briz/GyPa/houdini-switch-when-input-is-empty)

``` hscript
// Check if a curve has at least two points
if (npoints("../Curve") < 2, 1, 0) // ternary
```

[How to use another operator if an input is empty? - General Houdini
Questions...](https://forums.odforce.net/topic/14927-how-to-use-another-operator-if-an-input-is-empty/)

on a switch node, to check if a input is connected

``` hscript
// on a switch this is testing if the SWITCH input 1 (zero based), is valid
// if I were to test for input 0, change the 1 for the 0
!opexist(opinputpath('.',1))
```

### Python Module special meaning

[Quick Python: callback script from button parameter](https://www.sidefx.com/forum/topic/59236/)

Reference

[hou.phm](https://www.sidefx.com/docs/houdini/hom/hou/phm.html)
