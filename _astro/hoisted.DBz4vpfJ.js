import"./hoisted.ZVUEkgq_.js";import"./index.D_76QRnP.js";const r=["You know how to cut to the core of me Baxter. You're so wise. You're like a miniature Buddha, covered with hair.","Well, I could be wrong, but I believe, uh, diversity is an old, old wooden ship that was used during the Civil War era.","I'm not quite sure how to put this, but…I'm kind of a big deal…I'm very important. I have many leather-bound books and my apartment smells of rich mahogany.","It's a formidable scent… It stings the nostrils. In a good way… Brian, I'm gonna be honest with you, that smells like pure gasoline.","Okay, before we start, let's go over the ground rules. No touching of the hair or face. And that's it. Now, fight!","It's terrible, she has beautiful eyes and her hair smells like cinnamon!","Discovered by the Germans in 1904, they named it San Diego, which of course in German means 'a whale's vagina'.","Oh, I can barely lift my right arm 'cause I did so many. I don't know if you heard me counting. I did over a thousand… Just watch out for the guns, they'll getcha.","What? You pooped in the refrigerator? And you ate the whole wheel of cheese? How'd you do that? Heck, I'm not even mad; that's amazing.","I'm a man who discovered the wheel and built the Eiffel Tower out of metal and brawn. That's what kind of man I am. You're just a woman with a small brain. With a brain a third the size of us. It's science.","I'm in a glass case of emotion!","It's so damn hot! Milk was a bad choice.","I immediately regret this decision.","You stay classy, San Diego."];let a=[],n=0;function h(e){const t=[...e];for(let o=t.length-1;o>0;o--){const i=Math.floor(Math.random()*(o+1));[t[o],t[i]]=[t[i],t[o]]}return t}function l(){return(n===0||n===a.length)&&(a=h(r),n=0),a[n++]}function u(e,t){let o=24;for(e.style.fontSize=`${o}px`;e.scrollHeight>t.clientHeight&&o>12;)o--,e.style.fontSize=`${o}px`}function s(){const e=document.getElementById("quote"),t=e.parentElement;e.textContent=l(),u(e,t)}function d(){s();const e=document.getElementById("getQuoteBtn");e&&e.addEventListener("click",s)}document.addEventListener("astro:page-load",d);
