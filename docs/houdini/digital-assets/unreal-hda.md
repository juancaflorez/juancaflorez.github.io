# Houdini Engine and Unreal

## Landscape sizes and voxel size

If the size of a voxel is less than one, it can cause conversion errors once the heightfield is imported into Unreal. This will be visible as clipping of the landscape after certain height

Make sure to set the desired size of the terrain first using the values specified [in the unreal landscape guide](https://docs.unrealengine.com/5.3/en-US/landscape-technical-guide-in-unreal-engine/)
or in the Houdini Engine [landscapes section](https://www.sidefx.com/docs/houdini/unreal/landscapes.html)

