import"./hoisted.ZVUEkgq_.js";import"./index.D_76QRnP.js";function d(){const m=Array.from(document.querySelectorAll("#randomimage"));m.length!==0&&m.forEach(s=>{try{const e=JSON.parse(s.dataset.images),l=JSON.parse(s.dataset.width),g=JSON.parse(s.dataset.height),o=e.large.map((a,r)=>({image:{large:e.large[r],medium:e.medium[r],small:e.small[r]},alt:e.alt[r],width:l,height:g}));for(let a=o.length-1;a>0;a--){const r=Math.floor(Math.random()*(a+1));[o[a],o[r]]=[o[r],o[a]]}const t=s.querySelector("img"),i=s.querySelector("source[data-srcset-large]"),c=s.querySelector("source[data-srcset-medium]");if(t&&i&&c){const a=o[0];i.srcset=a.image.large,c.srcset=a.image.medium,t.src=a.image.small,t.srcset=a.image.small,t.alt=a.alt,t.width=a.width.small,t.height=a.height.small,t.classList.remove("hidden")}}catch(e){console.error("Error processing random image data:",e)}})}document.addEventListener("astro:page-load",d);
