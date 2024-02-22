# OCIO ACES

https://www.toadstorm.com/blog/?p=694


In the .zshrc file
```bash

export OCIO="/mnt/dev/libs/ocio/OpenColorIO-Config-ACES-1.2/aces_1.2/config.ocio"

```

Set the .ocio file with execution permissions
Do not add the profiles in a NTFS drive if you are working on a Linux machine


In the houdini environment file

```bash
OCIO="/mnt/dev/libs/ocio/OpenColorIO-Config-ACES-1.2/aces_1.2/config.ocio"

```
