const c = document.querySelector("#game");
const g = c.getContext("2d");

const mini = document.querySelector("#minimap");
const mg = mini.getContext("2d");


function resize() {
    c.width = innerWidth;
    c.height = innerHeight;
}

addEventListener("resize", resize);
resize();


const mouse = {
    x: 0,
    y: 0,
    down: false
};


const keys = new Set();

let player;
let foods = [];

let cam = {
    x: 0,
    y: 0
};

let last = 0;
let running = false;

const imgs = {};


/* =========================
   ЗАГРУЗКА КАРТИНОК ЭВОЛЮЦИЙ
========================= */

EVOLUTIONS.forEach(e => {

    if (e.sprite && !imgs[e.sprite]) {

        const img = new Image();

        img.src = e.sprite;

        imgs[e.sprite] = img;
    }

});


const rnd = (a, b) =>
    Math.random() * (b - a) + a;


/* =========================
   БИОМ
========================= */

function biome(x, y) {

    return BIOMES.find(b =>
        x >= b.x &&
        x < b.x + b.w &&
        y >= b.y &&
        y < b.y + b.h
    ) || BIOMES[0];

}


/* =========================
   ТЕКУЩАЯ ЭВОЛЮЦИЯ
========================= */

function evo() {

    let current = EVOLUTIONS[0];

    for (const evolution of EVOLUTIONS) {

        if (player.xp >= evolution.xp) {
            current = evolution;
        }

    }

    return current;

}


/* =========================
   XP АККАУНТА
========================= */

function getAccountXP() {

    const account = Accounts.getAccount();

    if (!account) {
        return 0;
    }

    return Number(account.xp) || 0;

}


/* =========================
   СОЗДАНИЕ ИГРОКА
========================= */

function init() {

    const account = Accounts.getAccount();

    const savedXP = getAccountXP();

    player = {

        x: 1300,
        y: 1700,

        xp: savedXP,

        hp: 100,
        en: 100,
        air: 100,
        water: 100,

        kills: 0,

        angle: 0,

        nickname:
            account?.nickname ||
            "Игрок"

    };


    foods = [];


    for (let i = 0; i < 1500; i++) {
        food();
    }


    cam.x = player.x;
    cam.y = player.y;


    if (
        typeof AntiCheat !== "undefined"
    ) {

        AntiCheat.resetChecks(player);

    }


    running = true;

    last = performance.now();

    requestAnimationFrame(loop);

}


/* =========================
   СОЗДАНИЕ ЕДЫ
========================= */

function food() {

    const b =
        BIOMES[
            Math.floor(
                Math.random() * BIOMES.length
            )
        ];


    const current =
        player ?
        evo() :
        EVOLUTIONS[0];


    const maxTier =
        Math.min(
            45,
            Math.max(
                3,
                (current.tier || 1) + 5
            )
        );


    const tier =
        1 +
        Math.floor(
            Math.random() * maxTier
        );


    foods.push({

        x: rnd(
            b.x + 30,
            b.x + b.w - 30
        ),

        y: rnd(
            b.y + 30,
            b.y + b.h - 30
        ),

        r: rnd(5, 11),

        tier: tier,

        xp: Math.round(
            8 +
            tier * 8 +
            tier * tier * 1.4
        )

    });

}


/* =========================
   ЭКРАНЫ И МЕНЮ
========================= */

const authScreen =
    document.querySelector("#authScreen");

const menu =
    document.querySelector("#menu");

const authLogin =
    document.querySelector("#authLogin");

const authPassword =
    document.querySelector("#authPassword");

const authMessage =
    document.querySelector("#authMessage");


function openMenu() {

    const account =
        Accounts.getAccount();


    if (!account) {
        return;
    }


    if (authScreen) {
        authScreen.classList.add("hidden");
    }


    if (menu) {
        menu.classList.remove("hidden");
    }


    const accountInfo =
        document.querySelector("#accountInfo");


    if (accountInfo) {

        accountInfo.textContent =
            "👤 " +
            account.nickname +
            " | Уровень " +
            account.level +
            "/45 | " +
            Math.floor(account.xp) +
            " XP";

    }


    if (
        typeof Accounts.updateMenu ===
        "function"
    ) {

        Accounts.updateMenu();

    }

}


/* =========================
   РЕГИСТРАЦИЯ
========================= */

const registerBtn =
    document.querySelector("#registerBtn");


if (registerBtn) {

    registerBtn.onclick = () => {

        const result =
            Accounts.register(
                authLogin.value,
                authPassword.value
            );


        if (authMessage) {
            authMessage.textContent =
                result.message;
        }


        if (result.ok) {

            openMenu();

        }

    };

}


/* =========================
   ВХОД
========================= */

const loginBtn =
    document.querySelector("#loginBtn");


if (loginBtn) {

    loginBtn.onclick = () => {

        const result =
            Accounts.login(
                authLogin.value,
                authPassword.value
            );


        if (authMessage) {
            authMessage.textContent =
                result.message;
        }


        if (result.ok) {

            openMenu();

        }

    };

}


/* =========================
   АВТОВХОД
========================= */

if (
    typeof Accounts !== "undefined" &&
    Accounts.autoLogin()
) {

    openMenu();

}


/* =========================
   ВЫХОД ИЗ АККАУНТА
========================= */

const logoutBtn =
    document.querySelector("#logoutBtn");


if (logoutBtn) {

    logoutBtn.onclick = () => {

        Accounts.logout();

        running = false;


        if (menu) {
            menu.classList.add("hidden");
        }


        const hud =
            document.querySelector("#hud");

        if (hud) {
            hud.classList.add("hidden");
        }


        const minimapBox =
            document.querySelector("#minimapBox");

        if (minimapBox) {
            minimapBox.classList.add("hidden");
        }


        if (authLogin) {
            authLogin.value = "";
        }

        if (authPassword) {
            authPassword.value = "";
        }


        if (authScreen) {
            authScreen.classList.remove("hidden");
        }

    };

}


/* =========================
   КНОПКА ИГРАТЬ
========================= */

const playButton =
    document.querySelector("#play");


if (playButton) {

    playButton.onclick = () => {

        const account =
            Accounts.getAccount();


        if (!account) {

            if (authMessage) {
                authMessage.textContent =
                    "Сначала войдите в аккаунт";
            }

            return;

        }


        if (menu) {
            menu.classList.add("hidden");
        }


        const hud =
            document.querySelector("#hud");

        if (hud) {
            hud.classList.remove("hidden");
        }


        const minimapBox =
            document.querySelector("#minimapBox");

        if (minimapBox) {
            minimapBox.classList.remove("hidden");
        }


        init();

    };

}


/* =========================
   УПРАВЛЕНИЕ МЫШЬЮ
========================= */

c.onmousemove = e => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

};


c.onmousedown = () => {

    mouse.down = true;

};


addEventListener(
    "mouseup",
    () => {

        mouse.down = false;

    }
);


/* =========================
   КЛАВИАТУРА
========================= */

addEventListener(
    "keydown",
    e => {

        keys.add(e.code);

    }
);


addEventListener(
    "keyup",
    e => {

        keys.delete(e.code);

    }
);


/* =========================
   ОБНОВЛЕНИЕ ИГРЫ
========================= */

function update(dt) {

    if (!player) {
        return;
    }


    const e = evo();

    const oldX = player.x;
    const oldY = player.y;


    const b =
        biome(
            player.x,
            player.y
        );


    let dx = 0;
    let dy = 0;


    /* ДВИЖЕНИЕ МЫШЬЮ */

    if (mouse.down) {

        dx =
            mouse.x -
            c.width / 2;

        dy =
            mouse.y -
            c.height / 2;

    }


    /* WASD */

    if (keys.has("KeyA")) {
        dx -= 220;
    }

    if (keys.has("KeyD")) {
        dx += 220;
    }

    if (keys.has("KeyW")) {
        dy -= 220;
    }

    if (keys.has("KeyS")) {
        dy += 220;
    }


    const d =
        Math.hypot(dx, dy);


    const boost =
        keys.has("Space") &&
        player.en > 0;


    if (d > 0) {

        let speed =
            (e.speed || 180) *
            (
                boost ?
                1.5 :
                1
            );


        if (
            b.kind === "water" &&
            e.air
        ) {

            speed *= 0.55;

        }


        player.x +=
            dx / d *
            speed *
            dt;


        player.y +=
            dy / d *
            speed *
            dt;


        player.angle =
            Math.atan2(dy, dx);

    }


    /* ГРАНИЦЫ МИРА */

    player.x =
        Math.max(
            0,
            Math.min(
                WORLD.w,
                player.x
            )
        );


    player.y =
        Math.max(
            0,
            Math.min(
                WORLD.h,
                player.y
            )
        );


    /* ЭНЕРГИЯ */

    player.en =
        Math.max(
            0,
            Math.min(
                100,

                player.en +

                (
                    boost ?
                    -28 :
                    15
                ) * dt

            )
        );


    /* ВОЗДУХ */

    if (
        b.kind === "water" &&
        e.air
    ) {

        player.air =
            Math.max(
                0,
                player.air -
                20 * dt
            );


        if (
            player.air <= 0
        ) {

            player.hp -=
                7 * dt;

        }

    } else {

        player.air =
            Math.min(
                100,
                player.air +
                30 * dt
            );

    }


    /* ВОДА */

    player.water =
        Math.max(
            0,
            player.water -
            0.45 * dt
        );


    if (
        b.kind === "water"
    ) {

        player.water =
            Math.min(
                100,
                player.water +
                25 * dt
            );

    }


    if (
        player.water <= 0
    ) {

        player.hp -=
            4 * dt;

    }


    /* ПОЕДАНИЕ ЕДЫ */

    for (
        let i = foods.length - 1;
        i >= 0;
        i--
    ) {

        const f = foods[i];


        const distance =
            Math.hypot(
                f.x - player.x,
                f.y - player.y
            );


        if (

            distance <
            (e.r || 20) + f.r &&

            f.tier <=
            (e.tier || 1) + 1

        ) {

            player.xp += f.xp;

            foods.splice(i, 1);

            food();

        }

    }


    /* СМЕРТЬ */

    if (
        player.hp <= 0
    ) {

        player.hp = 100;

        player.en = 100;
        player.air = 100;
        player.water = 100;


        player.xp =
            Math.floor(
                player.xp * 0.90
            );


        player.x = 1300;
        player.y = 1700;

    }


    /* АНТИЧИТ */

    if (
        typeof AntiCheat !==
        "undefined"
    ) {

        AntiCheat.clampPlayer(player);


        AntiCheat.validateMovement(
            player,
            oldX,
            oldY,
            dt,
            e.speed || 180
        );


        AntiCheat.saveSafeXP(player);

    }


    /* СОХРАНЕНИЕ */

    Accounts.saveProgress(
        player.xp,
        player.nickname
    );


    /* КАМЕРА */

    cam.x +=

        (
            player.x -
            cam.x
        ) *

        Math.min(
            1,
            dt * 6
        );


    cam.y +=

        (
            player.y -
            cam.y
        ) *

        Math.min(
            1,
            dt * 6
        );

}


/* =========================
   МИРОВЫЕ КООРДИНАТЫ
========================= */

function sc(x, y) {

    return [

        x -
        cam.x +
        c.width / 2,

        y -
        cam.y +
        c.height / 2

    ];

}


/* =========================
   ОТРИСОВКА
========================= */

function draw() {

    if (!player) {
        return;
    }


    g.fillStyle = "#78c8e6";

    g.fillRect(
        0,
        0,
        c.width,
        c.height
    );


    /* БИОМЫ */

    for (const b of BIOMES) {

        const p =
            sc(b.x, b.y);


        g.fillStyle = b.color;


        g.fillRect(
            p[0],
            p[1],
            b.w,
            b.h
        );

    }


    /* ЕДА */

    for (const f of foods) {

        const p =
            sc(f.x, f.y);


        const hue =
            (f.tier * 31) % 360;


        g.fillStyle =
            `hsl(${hue} 85% 62%)`;


        g.beginPath();


        g.arc(
            p[0],
            p[1],
            f.r,
            0,
            Math.PI * 2
        );


        g.fill();

    }


    /* ИГРОК */

    const e = evo();


    const p =
        sc(
            player.x,
            player.y
        );


    const im =
        imgs[e.sprite];


    g.save();

    g.translate(
        p[0],
        p[1]
    );

    g.rotate(
        player.angle
    );


    if (
        im &&
        im.complete &&
        im.naturalWidth > 0
    ) {

        g.drawImage(

            im,

            -(e.r || 20) * 1.45,

            -(e.r || 20),

            (e.r || 20) * 2.9,

            (e.r || 20) * 2

        );

    } else {

        g.fillStyle = "#ffffff";

        g.beginPath();

        g.arc(
            0,
            0,
            e.r || 20,
            0,
            Math.PI * 2
        );

        g.fill();

    }


    g.restore();


    /* HUD */

    const level = e.level || 1;


    const next =
        EVOLUTIONS[
            Math.min(
                level,
                EVOLUTIONS.length - 1
            )
        ];


    let pct = 100;


    if (
        level < 45 &&
        next &&
        next.xp > e.xp
    ) {

        pct =

            (
                player.xp -
                e.xp
            )

            /

            (
                next.xp -
                e.xp
            )

            * 100;

    }


    const formName =
        document.querySelector("#formName");


    if (formName) {

        formName.textContent =

            player.nickname +

            " | Уровень " +

            level +

            "/45 | " +

            (e.name || "Эволюция") +

            " | " +

            Math.floor(
                player.xp
            ) +

            " XP";

    }


    const hp =
        document.querySelector("#hp");

    if (hp) {
        hp.style.width =
            Math.max(
                0,
                player.hp
            ) + "%";
    }


    const energy =
        document.querySelector("#energy");

    if (energy) {
        energy.style.width =
            player.en + "%";
    }


    const air =
        document.querySelector("#air");

    if (air) {
        air.style.width =
            player.air + "%";
    }


    const water =
        document.querySelector("#water");

    if (water) {
        water.style.width =
            player.water + "%";
    }


    const xp =
        document.querySelector("#xp");

    if (xp) {

        xp.style.width =

            Math.max(
                0,
                Math.min(
                    100,
                    pct
                )
            ) + "%";

    }


    const biomeText =
        document.querySelector("#biome");

    if (biomeText) {

        biomeText.textContent =
            biome(
                player.x,
                player.y
            ).name;

    }


    drawMini();

}


/* =========================
   МИНИКАРТА
========================= */

function drawMini() {

    if (!player) {
        return;
    }


    mg.clearRect(
        0,
        0,
        mini.width,
        mini.height
    );


    const sx =
        mini.width /
        WORLD.w;


    const sy =
        mini.height /
        WORLD.h;


    for (const b of BIOMES) {

        mg.fillStyle =
            b.color;


        mg.fillRect(

            b.x * sx,
            b.y * sy,

            b.w * sx,
            b.h * sy

        );

    }


    mg.fillStyle =
        "#ffffff";


    mg.beginPath();


    mg.arc(

        player.x * sx,
        player.y * sy,

        3,

        0,
        Math.PI * 2

    );


    mg.fill();

}


/* =========================
   ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ
========================= */

function loop(t) {

    if (!running) {
        return;
    }


    const dt =

        Math.min(

            0.05,

            (
                t -
                last
            ) / 1000

        );


    last = t;


    update(dt);

    draw();


    requestAnimationFrame(loop);

}
