const c=document.querySelector('#game'),g=c.getContext('2d'),mini=document.querySelector('#minimap'),mg=mini.getContext('2d');
function resize(){c.width=innerWidth;c.height=innerHeight}addEventListener('resize',resize);resize();
const mouse={x:0,y:0,down:false},keys=new Set();let player,foods=[],npcs=[],cam={x:0,y:0},last=0,running=false;
const imgs={};EVOLUTIONS.forEach(e=>{imgs[e.sprite]=new Image();imgs[e.sprite].src=e.sprite});
const rnd=(a,b)=>Math.random()*(b-a)+a;
function biome(x,y){return BIOMES.find(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h)||BIOMES[0]}
function evo(){let e=EVOLUTIONS[0];for(const x of EVOLUTIONS)if(player.xp>=x.xp)e=x;return e}
function init(){player={x:1300,y:1700,xp:+localStorage.skywildXP||0,hp:100,en:100,air:100,kills:0,angle:0};foods=[];npcs=[];
for(let i=0;i<900;i++)food();for(let i=0;i<70;i++)npc();running=true;last=performance.now();requestAnimationFrame(loop)}
function food(){let b=BIOMES[Math.random()*BIOMES.length|0];foods.push({x:rnd(b.x+30,b.x+b.w-30),y:rnd(b.y+30,b.y+b.h-30),r:rnd(5,11),tier:1+Math.random()*9|0,xp:5+Math.random()*18|0})}
function npc(){let b=BIOMES[Math.random()*BIOMES.length|0],t=1+Math.random()*9|0;npcs.push({x:rnd(b.x+50,b.x+b.w-50),y:rnd(b.y+50,b.y+b.h-50),tier:t,r:15+t*4,hp:40+t*25,vx:rnd(-60,60),vy:rnd(-60,60)})}
document.querySelector('#play').onclick=()=>{let n=document.querySelector('#nickname').value.trim()||'Игрок';localStorage.skywildName=n;document.querySelector('#menu').classList.add('hidden');document.querySelector('#hud').classList.remove('hidden');document.querySelector('#minimapBox').classList.remove('hidden');init()};
c.onmousemove=e=>{mouse.x=e.clientX;mouse.y=e.clientY};c.onmousedown=()=>mouse.down=true;addEventListener('mouseup',()=>mouse.down=false);addEventListener('keydown',e=>keys.add(e.code));addEventListener('keyup',e=>keys.delete(e.code));
function update(dt){let e=evo(),b=biome(player.x,player.y),dx=0,dy=0;if(mouse.down){dx=mouse.x-c.width/2;dy=mouse.y-c.height/2}if(keys.has('KeyA'))dx-=220;if(keys.has('KeyD'))dx+=220;if(keys.has('KeyW'))dy-=220;if(keys.has('KeyS'))dy+=220;
let d=Math.hypot(dx,dy),boost=keys.has('Space')&&player.en>0;if(d){let s=e.speed*(boost?1.5:1);if(b.kind==='water'&&e.air)s*=.55;player.x+=dx/d*s*dt;player.y+=dy/d*s*dt;player.angle=Math.atan2(dy,dx)}player.x=Math.max(0,Math.min(WORLD.w,player.x));player.y=Math.max(0,Math.min(WORLD.h,player.y));
player.en=Math.max(0,Math.min(100,player.en+(boost?-28:15)*dt));if(b.kind==='water'&&e.air){player.air-=20*dt;if(player.air<0)player.hp+=player.air*.2;player.air=Math.max(0,player.air)}else player.air=Math.min(100,player.air+30*dt);
for(let i=foods.length-1;i>=0;i--){let f=foods[i];if(Math.hypot(f.x-player.x,f.y-player.y)<e.r+f.r&&f.tier<=e.tier+1){player.xp+=f.xp;foods.splice(i,1);food()}}
for(const n of npcs){let d=Math.hypot(n.x-player.x,n.y-player.y);if(d<500&&n.tier>e.tier){n.vx+=(player.x-n.x)/d*30*dt;n.vy+=(player.y-n.y)/d*30*dt}n.x+=n.vx*dt;n.y+=n.vy*dt;n.vx*=.99;n.vy*=.99;if(d<e.r+n.r){if(e.tier>=n.tier&&mouse.down)n.hp-=50*dt;else if(n.tier>e.tier)player.hp-=n.tier*2*dt;if(n.hp<=0){player.xp+=n.tier*40;n.x=rnd(0,WORLD.w);n.y=rnd(0,WORLD.h);n.hp=100}}}
if(player.hp<=0){player.hp=100;player.xp=Math.floor(player.xp*.85);player.x=1300;player.y=1700}cam.x+=(player.x-cam.x)*Math.min(1,dt*6);cam.y+=(player.y-cam.y)*Math.min(1,dt*6);localStorage.skywildXP=Math.floor(player.xp)}
function sc(x,y){return[x-cam.x+c.width/2,y-cam.y+c.height/2]}
function draw(){g.fillStyle='#78c8e6';g.fillRect(0,0,c.width,c.height);for(const b of BIOMES){let p=sc(b.x,b.y);g.fillStyle=b.color;g.fillRect(p[0],p[1],b.w,b.h)}
for(const f of foods){let p=sc(f.x,f.y);g.fillStyle=['#ff6b81','#ffe16a','#b77bff','#ff9f43','#55cbed','#63db78','#f19be9','#fff','#fa5757'][f.tier-1];g.beginPath();g.arc(p[0],p[1],f.r,0,7);g.fill()}
for(const n of npcs){let p=sc(n.x,n.y);g.fillStyle=n.tier>evo().tier?'#8c3440':'#77523a';g.beginPath();g.ellipse(p[0],p[1],n.r,n.r*.7,0,0,7);g.fill()}
let e=evo(),p=sc(player.x,player.y),im=imgs[e.sprite];g.save();g.translate(p[0],p[1]);g.rotate(player.angle);if(im.complete)g.drawImage(im,-e.r*1.45,-e.r,e.r*2.9,e.r*2);else{g.fillStyle='#fff';g.beginPath();g.arc(0,0,e.r,0,7);g.fill()}g.restore();
document.querySelector('#formName').textContent=e.name+' • '+Math.floor(player.xp)+' XP';document.querySelector('#hp').style.width=player.hp+'%';document.querySelector('#energy').style.width=player.en+'%';document.querySelector('#air').style.width=player.air+'%';let next=EVOLUTIONS[Math.min(EVOLUTIONS.indexOf(e)+1,EVOLUTIONS.length-1)],pct=e===next?100:(player.xp-e.xp)/(next.xp-e.xp)*100;document.querySelector('#xp').style.width=Math.max(0,Math.min(100,pct))+'%';document.querySelector('#biome').textContent=biome(player.x,player.y).name;drawMini()}
function drawMini(){mg.clearRect(0,0,180,110);let sx=180/WORLD.w,sy=110/WORLD.h;for(const b of BIOMES){mg.fillStyle=b.color;mg.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy)}mg.fillStyle='#fff';mg.beginPath();mg.arc(player.x*sx,player.y*sy,3,0,7);mg.fill()}
function loop(t){if(!running)return;let dt=Math.min(.05,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(loop)}