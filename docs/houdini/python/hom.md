# Python

## General explanation

[Python Scripting | SideFX](https://www.sidefx.com/tutorials/python-scripting/)

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

## Write attributes from python to geo1

When creating attributes using python, the attributes MUST be created first:

```python
geo.addAttrib(hou.attribType.Global, "parents", {})
geo.setGlobalAttribValue("parents", parent_dict)
```
