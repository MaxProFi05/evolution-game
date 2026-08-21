const WORLD = { w: 12000, h: 7000 };

const BIOMES = [
  { name: "Зелёные земли", x: 0, y: 0, w: 3300, h: 3500, color: "#5d9b55", kind: "land" },
  { name: "Северный лес", x: 0, y: 3500, w: 3300, h: 3500, color: "#356747", kind: "forest" },
  { name: "Большой океан", x: 3300, y: 0, w: 3000, h: 7000, color: "#247ca5", kind: "water" },
  { name: "Золотая пустыня", x: 6300, y: 0, w: 2700, h: 3400, color: "#d6ae62", kind: "desert" },
  { name: "Кристальные горы", x: 9000, y: 0, w: 3000, h: 3400, color: "#8a96a0", kind: "mountain" },
  { name: "Болота", x: 6300, y: 3400, w: 2700, h: 3600, color: "#54754d", kind: "swamp" },
  { name: "Ледяной край", x: 9000, y: 3400, w: 3000, h: 3600, color: "#b9d6de", kind: "snow" }
];

const EVOLUTIONS = [
  { level: 1, name: "Искра", xp: 0, r: 22, speed: 275, tier: 1, air: true, sprite: "assets/sprites/01_spark.svg" },
  { level: 2, name: "Полевой жук", xp: 160, r: 24, speed: 278, tier: 2, air: true, sprite: "assets/sprites/02_beetle.svg" },
  { level: 3, name: "Листокрыл", xp: 560, r: 26, speed: 281, tier: 3, air: true, sprite: "assets/sprites/03_moth.svg" },
  { level: 4, name: "Ночная моль", xp: 1200, r: 28, speed: 284, tier: 4, air: true, sprite: "assets/sprites/03_moth.svg" },
  { level: 5, name: "Малый охотник", xp: 2100, r: 30, speed: 287, tier: 5, air: true, sprite: "assets/sprites/04_bird.svg" },

  { level: 6, name: "Зелёная птица", xp: 3300, r: 32, speed: 290, tier: 6, air: true, sprite: "assets/sprites/04_bird.svg" },
  { level: 7, name: "Болотный прыгун", xp: 4900, r: 34, speed: 292, tier: 7, air: false, sprite: "assets/sprites/05_swamp_hunter.svg" },
  { level: 8, name: "Речной пловец", xp: 7000, r: 36, speed: 294, tier: 8, air: false, sprite: "assets/sprites/06_glider.svg" },
  { level: 9, name: "Песчаный страж", xp: 9700, r: 38, speed: 296, tier: 9, air: false, sprite: "assets/sprites/02_beetle.svg" },
  { level: 10, name: "Лесной летун", xp: 13200, r: 40, speed: 300, tier: 10, air: true, sprite: "assets/sprites/04_bird.svg" },

  { level: 11, name: "Сумеречная птица", xp: 17600, r: 43, speed: 302, tier: 11, air: true, sprite: "assets/sprites/03_moth.svg" },
  { level: 12, name: "Морской планёр", xp: 23100, r: 46, speed: 305, tier: 12, air: false, sprite: "assets/sprites/06_glider.svg" },
  { level: 13, name: "Когтекрыл", xp: 29900, r: 49, speed: 308, tier: 13, air: true, sprite: "assets/sprites/07_hawk.svg" },
  { level: 14, name: "Туманный охотник", xp: 38200, r: 52, speed: 311, tier: 14, air: true, sprite: "assets/sprites/07_hawk.svg" },
  { level: 15, name: "Горный странник", xp: 48300, r: 55, speed: 313, tier: 15, air: false, sprite: "assets/sprites/09_guardian.svg" },

  { level: 16, name: "Каменный клюв", xp: 60500, r: 58, speed: 315, tier: 16, air: true, sprite: "assets/sprites/07_hawk.svg" },
  { level: 17, name: "Грозовой сокол", xp: 75100, r: 61, speed: 320, tier: 17, air: true, sprite: "assets/sprites/07_hawk.svg" },
  { level: 18, name: "Северный летун", xp: 92500, r: 64, speed: 322, tier: 18, air: true, sprite: "assets/sprites/06_glider.svg" },
  { level: 19, name: "Ядовитый охотник", xp: 113100, r: 67, speed: 318, tier: 19, air: false, sprite: "assets/sprites/05_swamp_hunter.svg" },
  { level: 20, name: "Огнекрыл", xp: 137400, r: 70, speed: 323, tier: 20, air: true, sprite: "assets/sprites/08_dragon.svg" },

  { level: 21, name: "Ночной ястреб", xp: 166000, r: 73, speed: 325, tier: 21, air: true, sprite: "assets/sprites/07_hawk.svg" },
  { level: 22, name: "Лавовый хищник", xp: 199500, r: 76, speed: 321, tier: 22, air: false, sprite: "assets/sprites/08_dragon.svg" },
  { level: 23, name: "Кристальный охотник", xp: 238600, r: 79, speed: 324, tier: 23, air: false, sprite: "assets/sprites/09_guardian.svg" },
  { level: 24, name: "Штормовой летун", xp: 284200, r: 82, speed: 330, tier: 24, air: true, sprite: "assets/sprites/07_hawk.svg" },
  { level: 25, name: "Солнечный сокол", xp: 337200, r: 85, speed: 334, tier: 25, air: true, sprite: "assets/sprites/07_hawk.svg" },

  { level: 26, name: "Глубинный страж", xp: 398600, r: 88, speed: 320, tier: 26, air: false, sprite: "assets/sprites/06_glider.svg" },
  { level: 27, name: "Ледяной охотник", xp: 469500, r: 91, speed: 318, tier: 27, air: false, sprite: "assets/sprites/09_guardian.svg" },
  { level: 28, name: "Небесный зверь", xp: 551000, r: 94, speed: 335, tier: 28, air: true, sprite: "assets/sprites/07_hawk.svg" },
  { level: 29, name: "Громовой хищник", xp: 644300, r: 97, speed: 338, tier: 29, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 30, name: "Древний летун", xp: 750800, r: 100, speed: 340, tier: 30, air: true, sprite: "assets/sprites/08_dragon.svg" },

  { level: 31, name: "Золотой дракон", xp: 872000, r: 103, speed: 337, tier: 31, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 32, name: "Теневой дракон", xp: 1009500, r: 106, speed: 340, tier: 32, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 33, name: "Кристальный дракон", xp: 1164000, r: 109, speed: 336, tier: 33, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 34, name: "Ледяной дракон", xp: 1338000, r: 112, speed: 332, tier: 34, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 35, name: "Огненный дракон", xp: 1534000, r: 115, speed: 335, tier: 35, air: true, sprite: "assets/sprites/08_dragon.svg" },

  { level: 36, name: "Штормовой дракон", xp: 1754000, r: 118, speed: 338, tier: 36, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 37, name: "Небесный страж", xp: 2001000, r: 121, speed: 334, tier: 37, air: true, sprite: "assets/sprites/09_guardian.svg" },
  { level: 38, name: "Повелитель болот", xp: 2277000, r: 124, speed: 325, tier: 38, air: false, sprite: "assets/sprites/05_swamp_hunter.svg" },
  { level: 39, name: "Повелитель океана", xp: 2585000, r: 127, speed: 320, tier: 39, air: false, sprite: "assets/sprites/06_glider.svg" },
  { level: 40, name: "Повелитель гор", xp: 2928000, r: 130, speed: 318, tier: 40, air: false, sprite: "assets/sprites/09_guardian.svg" },

  { level: 41, name: "Повелитель небес", xp: 3309000, r: 134, speed: 342, tier: 41, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 42, name: "Древний хранитель", xp: 3731000, r: 138, speed: 325, tier: 42, air: false, sprite: "assets/sprites/09_guardian.svg" },
  { level: 43, name: "Легендарный зверь", xp: 4198000, r: 142, speed: 330, tier: 43, air: true, sprite: "assets/sprites/08_dragon.svg" },
  { level: 44, name: "Мировой страж", xp: 4714000, r: 146, speed: 322, tier: 44, air: false, sprite: "assets/sprites/09_guardian.svg" },
  { level: 45, name: "Верховный страж", xp: 5285000, r: 150, speed: 330, tier: 45, air: true, sprite: "assets/sprites/09_guardian.svg" }
];
