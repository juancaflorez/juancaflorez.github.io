import{j as s}from"./jsx-runtime.7faW4zRM.js";import{r as o}from"./index.DhYZZe0J.js";import{m as a}from"./proxy.M6o2cHiH.js";function d(){const[t,r]=o.useState(!1);o.useEffect(()=>{const e=()=>{const n=document.getElementById("nav-links");n&&(n.classList.remove("open","collapsed"),n.classList.add(t?"open":"collapsed"))};return document.addEventListener("astro:page-load",e),()=>{document.removeEventListener("astro:page-load",e)}},[t]);const l=()=>{r(!t);const e=document.getElementById("nav-links");e&&(e.classList.contains("open")?(e.classList.remove("open"),e.classList.add("collapsed")):(e.classList.remove("collapsed"),e.classList.add("open")))};return s.jsx("button",{onClick:l,className:"w-[30px] h-[30px] bg-transparent border-0 p-0 cursor-pointer relative hamburger flex items-center justify-center","aria-label":t?"Close menu":"Open menu",children:s.jsxs(a.div,{className:"relative w-[24px] h-[18px]",animate:t?"open":"closed",children:[s.jsx(a.span,{className:"absolute h-[2px] w-full bg-current left-0",variants:{closed:{rotate:0,translateY:0,top:"0px"},open:{rotate:45,translateY:8,top:"0px"}},transition:{duration:.3}}),s.jsx(a.span,{className:"absolute h-[2px] w-full bg-current left-0 top-[8px]",variants:{closed:{opacity:1},open:{opacity:0}},transition:{duration:.3}}),s.jsx(a.span,{className:"absolute h-[2px] w-full bg-current left-0",variants:{closed:{rotate:0,translateY:0,top:"16px"},open:{rotate:-45,translateY:-8,top:"16px"}},transition:{duration:.3}})]})})}export{d as default};
