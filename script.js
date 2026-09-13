const welcome=document.getElementById("welcome");
const home=document.getElementById("home");
const enter=document.getElementById("enter");
const modal=document.getElementById("modal");
const trigger=document.getElementById("languageTrigger");
const homeLang=document.getElementById("homeLang");
const close=document.getElementById("close");

enter.addEventListener("click",()=>{welcome.classList.add("hidden");home.classList.remove("hidden");window.scrollTo(0,0)});
trigger.addEventListener("click",()=>modal.classList.remove("hidden"));
homeLang.addEventListener("click",()=>modal.classList.remove("hidden"));
close.addEventListener("click",()=>modal.classList.add("hidden"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.add("hidden")});
document.querySelectorAll(".lang").forEach(x=>x.addEventListener("click",()=>{
 document.querySelectorAll(".lang").forEach(y=>{y.classList.remove("active");y.querySelector("b").textContent="○"});
 x.classList.add("active");x.querySelector("b").textContent="✓";
}));
