# TOPs and PDG

## Hscript vs Python
get and attribute from a wedge in a processor

```hscript
@attribute
//or
pdgattrib("attribute", 0)
```

```python
pdg.workItem().intAttribValue(“attribute”)

```

## Filenames
Use a detail attribute as a string in a file name expression

```hscript
// "cur_tileid" being the detail attrib and OUT_tile a null
$HIP/out/blob_tileset_`details("../OUT_tile/", "cur_tileid")`.fbx
```
