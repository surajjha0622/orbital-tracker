const params=new URLSearchParams(location.search);

const NAME=params.get("name")||"Agent";
const AGE=params.get("age")||"Unknown";
const CITY=params.get("location")||"Delhi";

const term=document.getElementById("terminal");

function log(t){
term.innerHTML+="> "+t+"<br>";
term.scrollTop=99999;
}

const globe=Globe()
(document.getElementById("globe"))
.globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
.backgroundColor("#000");

fetch("https://nominatim.openstreetmap.org/search?format=json&q="+CITY+",India")

.then(r=>r.json())

.then(data=>{

let lat=28.6;
let lng=77.2;

if(data.length){
lat=parseFloat(data[0].lat);
lng=parseFloat(data[0].lon);
}

globe.pointOfView({
lat:20,
lng:80,
altitude:2.8
},0);

const logs=[
"Connecting to satellite constellation...",
"Authenticating secure channel...",
"Loading ISRO orbital database...",
"Searching target...",
"Location parameter received...",
"CITY = "+CITY,
"Finding coordinates...",
"Coordinates Locked.",
"Beginning orbital descent..."
];

let i=0;

let timer=setInterval(()=>{

if(i<logs.length){

log(logs[i]);

i++;

}else{

clearInterval(timer);

globe.pointOfView({
lat:lat,
lng:lng,
altitude:.45
},4000);

globe.labelsData([{
lat,
lng,
text:CITY,
color:"lime"
}]);

globe.pointsData([{
lat,
lng,
size:0.5,
color:"red"
}]);

setTimeout(()=>{

document.getElementById("final").innerHTML=`

<hr>

<h1>🎉 TARGET ACQUIRED 🎉</h1>

<h2>Happy Birthday ${NAME}!</h2>

<b>Location:</b> ${CITY}<br>

<b>Orbit Count:</b> ${AGE}<br><br>

Mission Status : SUCCESS ✅

`;

confetti();

},5000);

}

},900);

});

function confetti(){

for(let i=0;i<180;i++){

let c=document.createElement("div");

c.style.position="fixed";

c.style.left=Math.random()*100+"vw";

c.style.top="-10px";

c.style.width="8px";

c.style.height="8px";

c.style.background=`hsl(${Math.random()*360},100%,50%)`;

document.body.appendChild(c);

let y=0;

let drift=Math.random()*4-2;

let id=setInterval(()=>{

y+=5;

c.style.transform=`translate(${drift*y}px,${y}px) rotate(${y}deg)`;

if(y>innerHeight){

clearInterval(id);

c.remove();

}

},20);

}

}
