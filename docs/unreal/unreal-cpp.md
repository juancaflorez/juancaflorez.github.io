# Interfaces

## Mistakes

When checking if an uobject implements an interface make sure to check against the 

UInterface not the IinterfaceName

``` cpp
UINTERFACE(Blueprintable)
class UCursorSamplerInterface : public UInterface
{
	GENERATED_BODY()
};

class CURSORSAMPLER_API ICursorSamplerInterface
{
	GENERATED_BODY()
}
```
    
From other class

``` cpp
const bool bImplements = Sampler->Implements<ICursorSamplerInterface>();

```
