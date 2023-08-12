
# Houdini to Flecs

From Houdini to flecs using Unreal

Consider this a data table adventure.

A game where the environment is important for the gameplay, and is tied to specific areas. Flow of resources, height, wind. And the topology is being changed as the level designers are in an iteration loop.

Also motivated by the thin documentation on this subject

<figure markdown>
  ![heightfield](rsr/houflecs/basehf.png){ loading=lazy }
  <figcaption>Those cliffs will require some attention</figcaption>
</figure>

Vegetation and natural formation in the environment are tied to game play elements in the game.

![Diagram light](rsr/houflecs/diag.png#only-light)
![Diagram dark](rsr/houflecs/diag-dark.png#only-dark)

An example game were the old data table manipulation is not the right approach, it might be used as a intermediate storage but in needs a better context.

Option 2: Landscape/Heightfield is created in Houdini, and I want to initialize the data in that context (using livelink or using regular HDAs), and leave it ready for further manipulation using Unreal's PCG toolbox.

Warning. Most of the content here is programmers art, or technical artist art! This is work in progress.

## Houdini side

### Initialize base values

![Sample heightfield](rsr/houflecs/samplehf.png)

From heightfield the wrangle is sampling the height, down stream a new attribute is created to store the adjacent points to each point as an array of integers

### Quirks of sending the HDA to Unreal

   Using the HDA, we can send the heightfield and the point cloud with our attributes if they are formatted correctly, not all data types and data structures are allowed.

### Special types and structures

<figure markdown>
  ![heightfield](rsr/houflecs/arraystrings.png){ loading=lazy }
</figure>

The attributes "adjancent" and "Ism" are arrays of integers. The Houdini engine doesn't marshall this data structure, so we will have to send the array as a string and parse the string as an array in the Unreal side.

=== "Adjacent as string "
    ```c title="adjacent_as_string.vex"
    //Run over points
    int @adjacent[];
    string adj = "[";
    int num_adj = len(@adjacent);

    for (int i=0; i < num_adj ; i++){
       int n = @adjacent[i];
       adj += i < num_adj - 1 ? itoa(n)+"," : itoa(n);
    }
    adj += "]";

    s@unreal_data_table_Adjacent = adj;
    ```

=== "ISM as string"
    ```c title="ism_as_string.vex"
    //Run over points
    int @ism[];
    string ism_s = "[";
    int num_ism = len(@ism);

    for (int i=0; i < num_ism ; i++){
       int n = @ism[i];
       ism_s += i < num_ism - 1 ? itoa(n)+"," : itoa(n);
    }
    ism_s += "]";

    s@unreal_data_table_Ism = ism_s;
    ```

!!! info
   
    For more info on pclouds as outputs visit the [data tables documentation](https://www.sidefx.com/docs/houdini/unreal/outputs.html#tables).
    

Once the HDA is in Unreal, the pcloud will be read by the houdini engine (Unreal) and imported as a data table *if* the setup is correct. For this to happen the attributes need to be named correctly. For example all colums in the following data table are prepended with unreal_data_table_ e.g. **unreal_data_table_Ism**

![Long names](rsr/houflecs/longnames.png)

| Adjacent | Health  | Id | Ism                                     | rowname   | rowstruct                                                  |
|----------|---------|----|-----------------------------------------|-----------|------------------------------------------------------------|
| [1,2,3]  | 56.8365 | 0  | [108,788,1937,1946,1952,1953,1964,1965] | rowname_0 | /Game/ProjectName/Data/FYourStruct_Inter.FYourStruct_Inter |
| [0,2,5]  | 63.6285 | 1  | [109,1529,1803,1904,1951]               | rowname_1 | /Game/ProjectName/Data/FYourStruct_Inter.FYourStruct_Inter |

### Row name and struct path

The next set of attributes have to be extracted from Unreal and referenced in Houdini

<figure markdown>
  ![heightfield](rsr/houflecs/rows.png){ loading=lazy width="300" }
  <figcaption></figcaption>
</figure>


The first attribute is ==unreal_data_table_rowname==. The value of this attribute can be set for each point with a wrangle like:

```c
// Run over points
s@unreal_data_table_rowname = "rowname_" + itoa(@ptnum);
```

The second attribute is the path to the row struct ==unreal_data_table_rowstruct==.
This path targets an FStruct.uasset in the unreal project game folder. The path can be obtained in Unreal by selecting the uasset in the content drawer > right click > copy reference

This will store in the clip buffer a path like:<br>
_/Script/Engine.UserDefinedStruct'/Game/SomeDir/FYourStruct.FYourStruct'_

Only the part between quotes is needed:<br> _/Game/SomeDir/FYourStruct.FYourStruct_

!!! Warning

    Unfortunatelly structs created in c++ header files can not be used, the path needs to target an .uasset not a .h file. 

!!! Warning
    
    The path must target assets in the Game directory, if the target uasset is in the content folder of a plugin, Houdini Engine will not recognize the struct path

The the data types of in the unreal FStruct should mirror the desired the data types in Houdini. Attributes like the rowname, and rowstruct are not needed in the unreal FStruct and should not be included.

## Unreal side

### Unreal FStruct

The struct referenced above will be used by the Houdini Engine to create a data table. Once the HDA is imported into the engine and the asset is present in a scene the table will be populated with all the rows.

<figure markdown>
![ustruct](rsr/houflecs/ustruct.png)
<figcaption>Struct Asset</figcaption>
</figure>

<figure markdown>
![datatable](rsr/houflecs/datatable.png)
<figcaption>Data Table</figcaption>
</figure>

### Parsing the data

The pcloud with the attributes was converted into a data table, that table needs to be processed and used in some way in the game.

While an environment and game mechanics are being iterated, the data structures are likely to change. It is recommended to use this struct and data table as an intermediate data exchange asset. After the data can be feed into a data parser object that can be edited in Blueprints. This will allow artists and game designers to have more autonomy over the process.

<figure markdown>
![Interface light](rsr/houflecs/interface.png#only-light){ loading=lazy }
![Interface dark](rsr/houflecs/interface-dark.png#only-dark){ loading=lazy }
</figure>

For this example I've created an UObject that will be consumed by and BP Actor

=== "Header"
    ```c++
    UCLASS(Blueprintable)
    class ENTANGLED_API UFieldDataContainer : public UObject, public IFieldDataInterface
    {
        GENERATED_BODY()
        void ParseDataTable_Implementation(const UDataTable* DataTable) override;
    }
    ```
=== "Cpp"
    ```c++
    void UFieldDataContainer::ParseDataTable_Implementation(const UDataTable* DataTable)
    {
        UE_LOG(LogEntangled, Log, TEXT("C++ Interface Implementation"));
    }
    ```

<figure markdown>
![Blueprint implements](rsr/houflecs/bpinterface.png){ loading=lazy }
</figure>


This gives us some flexibility. Since we are storing the parsed data as a TArray, some critical parts like allocating the array size and validating the data can be created in cpp.

At some point we need to know the structs and the data types that will be used for in flecs.

## Flecs

For the flecs part I use a design similar to the one documented by [jtferson](https://github.com/jtferson) in [Quickstart with Flecs in Unreal](https://jtferson.github.io/blog/quickstart_with_flecs_in_unreal_part_1/), albeit, with less complexity and modules. The flecs code is packaged in a plugin made up of 3 modules: flecs as a library, flecs as a unreal subsystem, and the gameplay module with the actual entities, components and systems. This setup is not described in this document as it is long enought to deserve its own page.

To show an use case of this system I have a:

* Entities for each point (@ptnum)
* Component keeping track of the neighbors
* Component with multiple child ISMs
* Singleton component with a ISM reference
* System to update the components values
* System to visualize the components values as a ISM attribute

```c++
void UEntangledBasicModule::Initialize(flecs::world& ECS)
{
	Super::Initialize(ECS);
	InitComponents(ECS);
	if (!TryCreateEntities(ECS, IsmComponent, DataContainer->FieldData)) return;
	CreateGameEntity(ECS);
	InitSystems(ECS);
}
```

In this ECS setup, all the entities with a health component are getting their value from the average health of their neighbors. This setup is similar to having a solver node in Houdini with a blur attribute node running over a pcloud.


<figure class="video_container">
  <video controls="true" allowfullscreen="false">
    <source src="../rsr/houflecs/basicflecs.webm" type="video/webm">
  </video>
  <figcaption>Basic ISM update</figcaption>
</figure>



```c++
void UEntangledBasicModule::InitSystems(const flecs::world& ECS)
{

	const flecs::entity GameEntity = ECS.lookup("Game");// TODO: check for null
	auto SourceIdMapPtr = &GameEntity.get<FEntangledMappings>()->SourceIdMap;
	if (SourceIdMapPtr->IsEmpty()) return;
	
	ECS.system<FEntangledHealth, FEntangledAdjacent>("Average Health System")
	   .iter([SourceIdMapPtr](const flecs::iter& Iter, FEntangledHealth* Health, FEntangledAdjacent* Adjacent)
	   	{
		    const auto ECSWorld = Iter.world();
	   		const float DecayRate = Iter.delta_time() * 0.05;
			for (const auto i: Iter)
			{
				float HealthAverage = 0.0f;
				const auto NumAdjacent =  Adjacent[i].Values.Num();
				if (NumAdjacent < 1) continue;
				for (const auto AdjacentSourceId : Adjacent[i].Values)
				{
					auto EntityId = *SourceIdMapPtr->Find(AdjacentSourceId);
					flecs::entity Entity = ECSWorld.entity(EntityId);
					HealthAverage += Entity.get<FEntangledHealth>()->Value;
				}
				HealthAverage = HealthAverage * (1/NumAdjacent);
				Health[i].Value = FMath::Lerp(Health[i].Value, HealthAverage, DecayRate);
			}
	   });
```


```cpp
	auto Renderer = GameEntity.get<FEntangledIsmRenderer>()->IsmComponent;
	
	ECS.system<FEntangledHealth ,FEntangledIsmIndices, FEntangledIsmRenderer>("Visualize Health")
		.interval(1.0)
	    .iter([Renderer](const flecs::iter& Iter, const FEntangledHealth* HealthComponent,
	   	const FEntangledIsmIndices* IsmIndices, const FEntangledIsmRenderer* IsmRendererComponent)
	   	{
			for (const int i : Iter)
			{
				const auto EntityRenderer = IsmRendererComponent[i].IsmComponent;
				//if (Renderer == nullptr) continue;
				for (const auto Index: IsmIndices[i].Values)
				{
					EntityRenderer->SetCustomDataValue(Index, 0, HealthComponent[i].Value, false);
				}
			}
	   		Renderer->MarkRenderStateDirty(); 
		});

```

### Update frequency

One important part to highlight is the update rate of the visualization. In this example the rate is set to 1 update each second. This is good enought for this case, but a better alternative would be to have different __visualization__ update rate as a function of the distance to the character, or restricted to the entities in the camera frustrum. A possible starting point would be to build an octree or a hashmap to have a quick way of quering and sorting the closest entities by distance.

## Future

At the end of this document it might seems unnecessary to go to all the effort to send an array of values to flecs. Here is an interesting option to expand the use of the [ECS as a data base](https://ajmmertens.medium.com/building-games-in-ecs-with-entity-relationships-657275ba2c6c)

Flecs comes with the posibility of creating relationships between entities and components, the storing of TMap to keep track of the neighbors could be changed to use relationships, and take advantage of the flecs query system.
