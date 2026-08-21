const c=document.querySelector('#game'),g=c.getContext('2d'),mini=document.querySelector('#minimap'),mg=mini.getContext('2d');
function resize(){c.width=innerWidth;c.height=innerHeight}addEventListener('resize',resize);resize();

const mouse={x:0,y:0,down:false},keys=new Set();
let player,foods=[],cam={x:0,y:0},last=0,running=false;
const imgs={};
EVOLUTIONS.forEach(e=>{if(!imgs[e.sprite]){imgs[e.sprite]=new Image();imgs[e.sprite].src=e.sprite}});

const rnd=(a,b)=>Math.random()*(b-a)+a;
function biome(x,y){return BIOMES.find(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h)||BIOMES[0]}
function evo(){let e=EVOLUTIONS[0];for(const x of EVOLUTIONS)if(player.xp>=x.xp)e=x;return e}

function init(){
  player={x:1300,y:1700,xp:+localStorage.skywildXP||0,hp:100,en:100,air:100,water:100,kills:0,angle:0};
  foods=[];
  for(let i=0;i<1500;i++)food();
  if(typeof AntiCheat!=="undefined")AntiCheat.resetChecks(player);
  running=true;last=performance.now();requestAnimationFrame(loop);
}

function food(){
  const b=BIOMES[Math.random()*BIOMES.length|0];
  const maxTier=Math.min(45,Math.max(3,evo().tier+5));
  const tier=1+Math.floor(Math.random()*maxTier);
  foods.push({
    x:rnd(b.x+30,b.x+b.w-30),
    y:rnd(b.y+30,b.y+b.h-30),
    r:rnd(5,11),
    tier,
    xp:Math.round(8+tier*8+tier*tier*1.4)
  });
}

document.querySelector('#play').onclick=()=>{
  const n=document.querySelector('#nickname').value.trim()||'Игрок';
  localStorage.skywildName=n;
  document.querySelector('#menu').classList.add('hidden');
  document.querySelector('#hud').classList.remove('hidden');
  document.querySelector('#minimapBox').classList.remove('hidden');
  init();
};

c.onmousemove=e=>{mouse.x=e.clientX;mouse.y=e.clientY};
c.onmousedown=()=>mouse.down=true;
addEventListener('mouseup',()=>mouse.down=false);
addEventListener('keydown',e=>keys.add(e.code));
addEventListener('keyup',e=>keys.delete(e.code));

function update(dt){
  const e=evo();
  const oldX=player.x,oldY=player.y;
  const b=biome(player.x,player.y);
  let dx=0,dy=0;

  if(mouse.down){dx=mouse.x-c.width/2;dy=mouse.y-c.height/2}
  if(keys.has('KeyA'))dx-=220;
  if(keys.has('KeyD'))dx+=220;
  if(keys.has('KeyW'))dy-=220;
  if(keys.has('KeyS'))dy+=220;

  const d=Math.hypot(dx,dy);
  const boost=keys.has('Space')&&player.en>0;

  if(d){
    let speed=e.speed*(boost?1.5:1);
    if(b.kind==='water'&&e.air)speed*=.55;
    player.x+=dx/d*speed*dt;
    player.y+=dy/d*speed*dt;
    player.angle=Math.atan2(dy,dx);
  }

  player.x=Math.max(0,Math.min(WORLD.w,player.x));
  player.y=Math.max(0,Math.min(WORLD.h,player.y));

  player.en=Math.max(0,Math.min(100,player.en+(boost?-28:15)*dt));

  // Воздух для наземных/воздушных форм в воде
  if(b.kind==='water'&&e.air){
    player.air=Math.max(0,player.air-20*dt);
    if(player.air<=0)player.hp-=7*dt;
  }else{
    player.air=Math.min(100,player.air+30*dt);
  }

  // Жажда
  player.water=Math.max(0,player.water-0.45*dt);
  if(b.kind==='water')player.water=Math.min(100,player.water+25*dt);
  if(player.water<=0)player.hp-=4*dt;

  // Только еда даёт XP. NPC полностью удалены.
  for(let i=foods.length-1;i>=0;i--){
    const f=foods[i];
    if(Math.hypot(f.x-player.x,f.y-player.y)<e.r+f.r && f.tier<=e.tier+1){
      player.xp+=f.xp;
      foods.splice(i,1);
      food();
    }
  }

  if(player.hp<=0){
    player.hp=100;
    player.xp=Math.floor(player.xp*.90);
    player.x=1300;
    player.y=1700;
  }

  if(typeof AntiCheat!=="undefined"){
    AntiCheat.clampPlayer(player);
    AntiCheat.validateMovement(player,oldX,oldY,dt,e.speed);
    AntiCheat.saveSafeXP(player);
  }else{
    localStorage.skywildXP=Math.floor(player.xp);
  }

  cam.x+=(player.x-cam.x)*Math.min(1,dt*6);
  cam.y+=(player.y-cam.y)*Math.min(1,dt*6);
}

function sc(x,y){return[x-cam.x+c.width/2,y-cam.y+c.height/2]}

function draw(){
  g.fillStyle='#78c8e6';g.fillRect(0,0,c.width,c.height);

  for(const b of BIOMES){
    const p=sc(b.x,b.y);
    g.fillStyle=b.color;
    g.fillRect(p[0],p[1],b.w,b.h);
  }

  for(const f of foods){
    const p=sc(f.x,f.y);
    const hue=(f.tier*31)%360;
    g.fillStyle=`hsl(${hue} 85% 62%)`;
    g.beginPath();g.arc(p[0],p[1],f.r,0,Math.PI*2);g.fill();
  }

  const e=evo(),p=sc(player.x,player.y),im=imgs[e.sprite];
  g.save();
  g.translate(p[0],p[1]);
  g.rotate(player.angle);

  if(im&&im.complete){
    g.drawImage(im,-e.r*1.45,-e.r,e.r*2.9,e.r*2);
  }else{
    g.fillStyle='#fff';
    g.beginPath();g.arc(0,0,e.r,0,Math.PI*2);g.fill();
  }
  g.restore();

  const level=e.level;
  const next=EVOLUTIONS[Math.min(level,EVOLUTIONS.length-1)];
  const pct=level>=45?100:(player.xp-e.xp)/(next.xp-e.xp)*100;

  document.querySelector('#formName').textContent=
    `Уровень ${level}/45 • ${e.name} • ${Math.floor(player.xp)} XP`;

  document.querySelector('#hp').style.width=Math.max(0,player.hp)+'%';
  document.querySelector('#energy').style.width=player.en+'%';
  document.querySelector('#air').style.width=player.air+'%';

  const water=document.querySelector('#water');
  if(water)water.style.width=player.water+'%';

  const xp=document.querySelector('#xp');
  if(xp)xp.style.width=Math.max(0,Math.min(100,pct))+'%';

  const biomeText=document.querySelector('#biome');
  if(biomeText)biomeText.textContent=biome(player.x,player.y).name;

  drawMini();
}

function drawMini(){
  mg.clearRect(0,0,180,110);
  const sx=180/WORLD.w,sy=110/WORLD.h;

  for(const b of BIOMES){
    mg.fillStyle=b.color;
    mg.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy);
  }

  mg.fillStyle='#fff';
  mg.beginPath();
  mg.arc(player.x*sx,player.y*sy,3,0,Math.PI*2);
  mg.fill();
}

function loop(t){
  if(!running)return;
  const dt=Math.min(.05,(t-last)/1000);
  last=t;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
