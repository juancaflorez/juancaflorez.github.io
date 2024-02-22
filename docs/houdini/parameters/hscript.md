# HScript

## Edit VEX sliders

The names of a slider should NOT have spaces, otherwise they will not be created!

- All the parameters exposed:[Parameter and Variable Handling | Houdini Tech Blog](https://wordpress.discretization.de/houdini/home/intermidiate/parameter-and-variable-handling/)
- Channel ranges: [Canyou make a channel that goes over 1 in vex? : Houdini](https://www.reddit.com/r/Houdini/comments/faxh4k/can_you_make_a_channel_that_goes_over_1_in_vex/)


-- CONVERT from org to md

*** Filenames and conditionals
#+begin_src c
//as an expression on another switch node
ch('../switch_projection/input')==1
#+end_src

[[https://www.sidefx.com/docs/houdini/expressions/ifs.html][Houdini ifs explained]] [[https://forums.odforce.net/topic/44731-conditional-output-switch/][Conditional output switch?]]

*** Get the bounding box max and min
#+begin_src bash
bbox(0,D_YMIN)
bbox(0,D_YMAX)
#+end_src
[[https://forums.odforce.net/topic/42870-compute-range-for-heightfield-from-tops/][Compute Range for heightfield from Tops]]
