# Conversion

## Conversion of coordinate system

[Houdini to Different Software Axis Conversion Lookup Table \| Forums \|
SideFX](https://www.sidefx.com/forum/topic/79596/)

Reference Houdini vector = {x, y, z} 
Reference Houdini quaternion = {x, y, z, w} 
(order: imaginary components i, j, k, real component w)

-   Group one

    Houdini, Maya, Substance Painter, Modo, Godot, Marmoset Toolbag,
    OpenGL Right-handed Y-Up or Y-X-Z clockwise Vector conversion
    formula = {x, y, z} Quaternion conversion formula = {x, y, z, w}

-   Group two

    3ds Max, Blender, CRYENGINE, AutoCAD, Source, SketchUp Right-handed
    Z-Up or Z-Y-X clockwise Vector conversion formula = {x, -z, y}
    Quaternion conversion formula = {x, -z, y, w}

-   Group three

    Unity, ZBrush, Cinema 4D, LightWave, DirectX Left-handed Y-Up or
    Y-Z-X clockwise Vector conversion formula = {-x, y, z} Quaternion
    conversion formula = {x, -y, -z, w}

-   Group Unreal

    Unreal Engine Left-handed Z-Up or Z-X-Y clockwise Vector conversion
    formula = {x, z, y} Quaternion conversion formula = {-x, -z, -y, w}
