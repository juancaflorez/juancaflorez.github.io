# Python HOM
## General explanation

[Python Scripting | SideFX](https://www.sidefx.com/tutorials/python-scripting/)

## Write attributes from python to geo1

When creating attributes from python into the geometry the attribute MUST be
created first:

```python
geo.addAttrib(hou.attribType.Global, "parents", {})
geo.setGlobalAttribValue("parents", parent_dict)
```


## Get a channel or parameter

```python
evalParm("../CTRL_comb_version/comb_version")
## is the same as ch('node/channel')
```


## When to use python expression in channels

For easy connections is better to use hscript, for more advanced and verbose stuff use python.

A good comparison [here](https://www.reddit.com/r/Houdini/comments/8fyt1q/bby_no_longer_working_python_alternative)

```hscript
//hscript
bbox(0, D_YMAX)
```

```python
hou.pwd().inputs()[0].geometry().boundingBox().maxvec()[1]
```

So, try to use hscript for simple stuff, even if SideFx says hscript is being deprecated

[Create Parameters in Houdini with Python](https://gfxhacks.com/create-parameters-in-houdini-with-python/)


## Python Get node

```python
#get node (find the path in your node's info panel)
n = hou.node("/path/to/node")
    
# get the max x value of a bounding box for the SOP box
node('../Body/box').geometry().boundingBox().maxvec().x()
```

## Get bounding box max Y
```python
hou.node("../hemitrans").geometry().boundingBox().maxvec().y()
``` 
    
## Bounding box size

```python
node("../source").geometry().boundingBox().sizevec().x()
```


## Write a dictionary to detail

In houdini ALL the keys of a dictionary must be converted to strings, the values can be of any type
```python

for tile_index in set_c:
    rotations_dict[str(tile_index)] = 0
    parent_dict["{}".format(tile_index)] = tile_index

# using python in hou, the parameter is created
# then it can be modified
geo.addAttrib(hou.attribType.Global, "parents", {})
geo.setGlobalAttribValue("parents", parent_dict)
```

## Basic python json exporter
Reference tutorial:
[Houdini 18 - Python Projects - Creating a Generic Json Exporter - YouTube](https://www.youtube.com/watch?v=9C1ZGnF2Y6A)

### WFC JSON exporter

```python

import json
import hou

data = []
components = ["x", "y", "z", "w"]

def export(kwargs):
    node = kwargs["node"]
    geo: hou.Geometry = node.node("export_node").geometry()
    generate_name: int = node.parm("generatename").evalAsInt()


    attribs = []

    if node.parm("filtered").evalAsInt() == 1:
        attribs = [node.parm("attribute_{}".format(x+1)).evalAsString() for x in range(node.parm("entries").evalAsInt()) ]
        print(attribs)
    else:
        attribs = [x.name() for x in geo.pointAttribs()]

    for point in geo.points():
        entry = {}

        if generate_name == 1:
            entry["Name"] = "Tile_{}".format(point.number())

        for attrib in attribs:
            if geo.findPointAttrib(attrib) is not None:
                point_attr = geo.findPointAttrib(attrib)
                size = point_attr.size()
                val = point.attribValue(attrib)
                array = point_attr.isArrayType()

                out = val

                if array:
                    if size > 1 and size <= 4:
                        out = []
                        for i in range(0, len(val), size):
                            vals = val[i:i+size]
                            out.append(dict(zip(components, vals)))

                        out = val

                elif size == 1:
                    out = val

                elif size > 1 and size <= 4:
                    out = {}
                    for i in range(size):
                        out[components[i]] = val[i]

                """ else:
                    raise hou.NodeError("Attribute {} not supported!".format(attrib)) """

                entry[attrib] = out
        data.append(entry)

    path = node.parm("json_path").evalAsString()


    # num_rows = geo.attribValue("rows")
    # detail = {"numrow" : num_rows}

    # https://docs.python.org/3.8/library/json.html#py-to-json-table
    # dict is mapped as an object

    dict_obj: dict = {"tiles" : data}
    # dict_obj["detail"] = detail


    with open(path, 'w') as f:
        # json.dump(dict_obj, f, indent=4)
        json.dump(dict_obj, f, indent=4)
```
## Reload or cook a node using a callback

Using a button in a parameter interface editor, select the button, find the callback script field and add the following

```python
hou.node(".").cook(force=True)
```
## Python states
https://aaronsmith.tv/Case-Studies

[A live session on building a tool with Python States in Houdini 18](https://www.youtube.com/watch?v=nS4FSMEas-I)

