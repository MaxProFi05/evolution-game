const WORLD={w:12000,h:7000};
const BIOMES=[
{name:"Зелёные земли",x:0,y:0,w:3300,h:3500,color:"#5d9b55",kind:"land"},
{name:"Северный лес",x:0,y:3500,w:3300,h:3500,color:"#356747",kind:"forest"},
{name:"Большой океан",x:3300,y:0,w:3000,h:7000,color:"#247ca5",kind:"water"},
{name:"Золотая пустыня",x:6300,y:0,w:2700,h:3400,color:"#d6ae62",kind:"desert"},
{name:"Кристальные горы",x:9000,y:0,w:3000,h:3400,color:"#8a96a0",kind:"mountain"},
{name:"Болота",x:6300,y:3400,w:2700,h:3600,color:"#54754d",kind:"swamp"},
{name:"Ледяной край",x:9000,y:3400,w:3000,h:3600,color:"#b9d6de",kind:"snow"}];
const EVOLUTIONS=[
{name:"Искра",xp:0,r:22,speed:270,tier:1,air:true,sprite:"assets/sprites/01_spark.svg"},
{name:"Луговой жук",xp:120,r:27,speed:285,tier:2,air:true,sprite:"assets/sprites/02_beetle.svg"},
{name:"Ночная моль",xp:320,r:33,speed:300,tier:3,air:true,sprite:"assets/sprites/03_moth.svg"},
{name:"Певчая птица",xp:650,r:39,speed:320,tier:4,air:true,sprite:"assets/sprites/04_bird.svg"},
{name:"Болотный охотник",xp:1100,r:46,speed:300,tier:5,air:false,sprite:"assets/sprites/05_swamp_hunter.svg"},
{name:"Морской планёр",xp:1750,r:53,speed:330,tier:6,air:false,sprite:"assets/sprites/06_glider.svg"},
{name:"Грозовой ястреб",xp:2600,r:61,speed:345,tier:7,air:true,sprite:"assets/sprites/07_hawk.svg"},
{name:"Небесный дракон",xp:3800,r:72,speed:325,tier:9,air:true,sprite:"assets/sprites/08_dragon.svg"},
{name:"Древний страж",xp:5500,r:86,speed:300,tier:11,air:false,sprite:"assets/sprites/09_guardian.svg"}];