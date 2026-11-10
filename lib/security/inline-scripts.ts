export const PLATFORM_SCRIPT =
  "try{var p=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||'';if(/mac|iphone|ipad|ipod|ios/i.test(p))document.documentElement.classList.add('apple')}catch(e){}"

export const THEME_SCRIPT =
  "try{var d=document.documentElement,t=null;try{t=localStorage.getItem('theme')}catch(e){}t=t||'system';if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.classList.remove('light','dark');d.classList.add(t);if(t==='light'||t==='dark')d.style.colorScheme=t}catch(e){}"
