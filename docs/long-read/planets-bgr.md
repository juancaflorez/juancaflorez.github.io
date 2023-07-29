---
tags:
  - space
  - planets
  - unity
  - blender
  - houdini
---
# Planet generation

![Homeworld mobile](rsr/planetsbgr/planets_hw.png){ loading=lazy }
## Intro
this page documents the creation process of creating shaders and textures for a planets system in a mobile platform game.
however it doesn't show specific parts of c# code (unity) or the specifics of the rendering pipeline for legal reasons. the planets were created for the urp rendering pipeline, under a tight texture budget and hardware limitations.

## Previous work
as with any other work, it is important to consult any other previous solutions before reinventing the wheel. the best description i found from another tech team came from [eve online](https://www.eveonline.com/news/view/awesome-looking-planets)
they they outline their approach in broad terms and mention the key challenges of a planets generation system, this resource served as a guide.

a few interesting highlights from the article:

   the planets are generated blending height maps
  - the height maps are created by a team of artists
  - the planet shader uses two projections to avoid texture distortions at the poles

// image here

## Resources and expectations
- this planet generation system coexist with other systems that use many megabytes of textures in disk, this left us constrained in how many textures could be loaded at one time, and the size of them.

- the area of expertise of the artists in the game is hard surfaces, this is at odds with the need of creating sculpted height maps, or terrain features

how big are the planets? how detailed and diverse? how many are loaded at the same time?

the planets in the game are background elements, the player can't interact with them. but how big will artists, marketing artists and other non technical stakeholder will want to push the system to 

## Seamless projections
a texture projection on a sphere will always contain a distortion at the poles. my solution was to use the following:

- two uv sets, one with an equirectangular projection for the equator, and a planar projection for the poles.
- a mask using the planar projection uvs.
- a sphere with vertex colors, where only the poles have a white value.

<figure markdown>
  ![uvs and vertex col](rsr/planetsbgr/planets_basics.png){ loading=lazy }
  <figcaption>uv.1, mask and vertex colors</figcaption>
</figure>

Blending of the texture is done with two simple functions [^1]: 

```hlsl title="mixfloat.hlsl"
float mixfloat(float base, float blend, float opacity)
{
  float a = base * (1-opacity);
  float b = blend * opacity;
  return a+b;
}
```

```hlsl title="blendproj.hlsl"
float blendprojections(float equirect, float planar, float mask, float vertex_r)
{
  float vertex_mask = vertex_r * mask;
  return mixfloat(equirect, planar, vertex_mask);
}
```



## Blend height maps

with the planets seams solved, the next step was to produce a couple of height maps for dwarf planets (no continents, no erosion). the textures channel were using in the following manner:

!!! note inline end

    bit depth is important. for a mobile platform, the maps were created at 8bit, with a good histogram distribution. for pc/console 16bits is ideal.

| channel | use                 | uv channel |
|---------|---------------------|------------|
| r       | equirect projection | 0          |
| g       | planar projection   | 1          |
| b       | poles mask          | 1          |


to create planets variations from a limited set of height maps, two sets of textures are blended together using simple linear interpolations. the following functions are the core of blending two sets.

```hlsl title="heightblend.hlsl"
float heightblend(float height1, float height2, float blend)
{
  float height_start = max(height1, height2) -blend;
  float level1 = max(height1 - height_start, 0);
  float level2 = max(height2 - height_start, 0);
  return ((height1 * level1) + (height2 * level2)) / (level1 + level2);
}
```

```hlsl title="lerpheights.hlsl"
float lerpheights(float height1, float height2, float blend, float time)
{
  float c = clamp(time)
  float h1 = (1-c) * height1;
  float h2 = c*height2;
  return blendheights(h1,h2,blend)
}
```

<figure class="video_container">
  <video controls="true" allowfullscreen="true">
    <source src="../rsr/planetsbgr/fastdwarfs.webm" type="video/webm">
  </video>
  <figcaption>basic dwarf planets blending</figcaption>

</figure>

the color components are obtained feeding the result of the blending as input in a color ramp. this ramp is exposed to the artist as a parameter.

## Land masses

<figure class="video_container">
  <video controls="true" allowfullscreen="true">
    <source src="../rsr/planetsbgr/diversity.webm" type="video/webm">
  </video>
  <figcaption>terrestrial and dwarfs mixed</figcaption>
</figure>

terrestrial planets have the additional feature of having clearly defined land masses, the product of tectonics. this land masses can be generated using a low frequency texture. early test using noise functions resulted in spotty and fragmented continents. instead a very low resolution land mass generation system over a sphere was created.

the underlying process can be summarized as:

  1.  distribute a number of points over a hex tiled sphere
  2.  each point is the start of a continent, with an integer id.
  3.  expand the frontiers of the continent using a bread first search
  4.  when two continents find each other in a border tag the collision, a resolve the ownership using the minimum id.
  5.  the tagged collisions will be used as subduction and collision zones to raise and lower the masses

<figure class="video_container">
  <video controls="true" allowfullscreen="true">
    <source src="../rsr/planetsbgr/plates.webm" type="video/webm">
  </video>
  <figcaption>plates generation</figcaption>
 
</figure>

the above process is meant to be used as a starting point to the land mass creation process, and is a gross oversimplification of the nature of plate tectonics.

!!! info

    [gplates](https://www.gplates.org/screenshots/) is an interesting alternative to create this type of [simulation](https://www.youtube.com/watch?v=cxfpwyazwqw)

third prototype:
automate the stitching of the projections and the mask generation
inputs -> outputs

## Gas giants

gas giants do not play well with the techniques described above. 
reasons, discontinuity, flow, structure.

a different approach is needed

the obvious characteristic is the motion and fluid behavior. flow maps, but seamless, wrapped around a sphere.

The following fragment shader is basically the code version of a blender shader described by the Entagma team in [Building a Flowmap Shader in Blender using Flowmap Data from Houdini](https://entagma.com/building-a-flowmap-shader-in-blender-using-flowmap-data-from-houdini/), but with the following modifications:

  * Sampling a high frequency texture with a different speed
  * Overlay the high frequency texture over the low frequency texture

=== "Distort UVs"
    ```hlsl title="jflow.hlsl"
    half3 frag(vertexoutput i) : sv_target
    {
      float2 flow_tex = (sample_texture2d(_flowtex, sampler_flowtex, i.uv).xy * 2.0) - 1.0;
      float cycle_a = _time % 1;
      float cycle_b = (_time + 0.5)  % 1;
  
      float2 flow_coords_a = _flowspeed * flow_tex * cycle_a + i.uv;
      float2 flow_coords_b = _flowspeed * flow_tex * cycle_b + i.uv;
  
      float at_map_a = sample_texture2d(_maintex, sampler_maintex, flow_coords_a).x;
      float at_map_b = sample_texture2d(_maintex, sampler_maintex, flow_coords_b).x;
      // ...
    ```

=== "High frequency"
    ```hlsl title="jflow.hlsl"
    //...
      float2 flow_coords_c = (_flowspeed * _highflowspeed * flow_tex * cycle_a + i.uv) * _highfreqspacemult;
      float hf_map_a = sample_texture2d(_maintex, sampler_maintex, flow_coords_c).y;
 
      float2 flow_coords_d = (_flowspeed * _highflowspeed * flow_tex * cycle_b + i.uv) * _highfreqspacemult;
      float hf_map_b = sample_texture2d(_maintex, sampler_maintex, flow_coords_d).y;
  
      half3 hf_a = half3(hf_map_a, hf_map_a, hf_map_a);
      half3 hf_b = half3(hf_map_b, hf_map_b, hf_map_b);
    //...
    }
    ```

=== "Blend frequencies"
    ```hlsl title="jflow.hlsl"
    //...
      float ping_pong = abs(cycle_a * 2 - 1 );
      float low = lerp(at_map_a, at_map_b, ping_pong);

      float2 grad_coords = float2(low, 0.0);
      half3 sampled_gradient = sample_texture2d(_gradienttex, sampler_gradienttex, grad_coords);
      half3 high = lerp(hf_a, hf_b, ping_pong);
      return blend_overlay_half3(sampled_gradient, high, _freqblend);
    }
    ```

=== "Helper functions"

    ```hlsl title="blends.hlsl"
    //regular overlay mode
    half3 blend_overlay_half3(half3 base, half3 blend, float opacity)
    {
      const half3 result1   = 1.0 - 2.0 * (1.0 - base) * (1.0 - blend);
      const half3 result2   = 2.0 * base * blend;
      const half3 zeroorone = step(base, 0.5);
      const half3 result3   = result2 * zeroorone + (1 - zeroorone) * result1;
      return lerp(base, opacity, result3);
    }
    ```


The automatic gamma correction for the flow map must be deactivated, when exporting from the DCC program, set the gamma to 1.

## exposing control parameters

less is better

unity and unreal, sampling gradients

container, unity -> scriptable object child class with assets validation system
unreal -> i don't remember the name

## future work


downsides of using two projections
- extra texture samplers
- alternatives, use an staked image array, only use one sampler

colorizing the surface, different biomes, more texture maps to sample.

final heightmap format and precision for a mobile platform.

compromises.


[^1]: http://untitledgam.es/2017/01/height-blending-shader/
