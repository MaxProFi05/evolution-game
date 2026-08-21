const OWNER_LOGIN = "MaxPro official";
const OWNER_XP = 5285000;

const Accounts = {

    current: null,

    getAll() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "skywildAccounts"
                )
            ) || {};

        } catch {

            return {};

        }

    },

    saveAll(accounts) {

        localStorage.setItem(

            "skywildAccounts",

            JSON.stringify(accounts)

        );

    },

    register(login, password) {

        const accounts =
            this.getAll();

        login =
            login.trim();

        if (!login) {

            return {

                ok: false,

                message:
                    "Введите логин"

            };

        }

        if (login.length < 3) {

            return {

                ok: false,

                message:
                    "Логин минимум 3 символа"

            };

        }

        if (password.length < 3) {

            return {

                ok: false,

                message:
                    "Пароль минимум 3 символа"

            };

        }

        if (accounts[login]) {

            return {

                ok: false,

                message:
                    "Такой аккаунт уже существует"

            };

        }

        accounts[login] = {

            password: password,

            nickname: login,

            xp: 0,

            level: 1,

            role: "PLAYER",

            created: Date.now()

        };

        if (
            login === OWNER_LOGIN
        ) {

            accounts[login].xp =
                OWNER_XP;

            accounts[login].level =
                45;

            accounts[login].role =
                "OWNER";

        }

        this.saveAll(accounts);

        this.current =
            login;

        localStorage.setItem(

            "skywildCurrentAccount",

            login

        );

        return {

            ok: true,

            message:
                login === OWNER_LOGIN

                    ? "👑 OWNER аккаунт создан!"

                    : "Аккаунт создан"

        };

    },

    login(login, password) {

        const accounts =
            this.getAll();

        login =
            login.trim();

        if (!accounts[login]) {

            return {

                ok: false,

                message:
                    "Аккаунт не найден"

            };

        }

        if (
            accounts[login].password !==
            password
        ) {

            return {

                ok: false,

                message:
                    "Неверный пароль"

            };

        }

        if (
            login === OWNER_LOGIN
        ) {

            accounts[login].xp =
                OWNER_XP;

            accounts[login].level =
                45;

            accounts[login].role =
                "OWNER";

            this.saveAll(accounts);

        }

        this.current =
            login;

        localStorage.setItem(

            "skywildCurrentAccount",

            login

        );

        return {

            ok: true,

            message:
                login === OWNER_LOGIN

                    ? "👑 Добро пожаловать, OWNER!"

                    : "Вход выполнен"

        };

    },

    autoLogin() {

        const login =
            localStorage.getItem(
                "skywildCurrentAccount"
            );

        if (!login) {

            return false;

        }

        const accounts =
            this.getAll();

        if (!accounts[login]) {

            return false;

        }

        if (
            login === OWNER_LOGIN
        ) {

            accounts[login].xp =
                OWNER_XP;

            accounts[login].level =
                45;

            accounts[login].role =
                "OWNER";

            this.saveAll(accounts);

        }

        this.current =
            login;

        return true;

    },

    getAccount() {

        if (!this.current) {

            return null;

        }

        const accounts =
            this.getAll();

        const account =
            accounts[this.current];

        if (!account) {

            return null;

        }

        if (
            this.current === OWNER_LOGIN
        ) {

            account.xp =
                OWNER_XP;

            account.level =
                45;

            account.role =
                "OWNER";

            accounts[this.current] =
                account;

            this.saveAll(accounts);

        }

        return account;

    },

    saveProgress(
        xp,
        nickname
    ) {

        if (!this.current) {

            return;

        }

        const accounts =
            this.getAll();

        if (
            !accounts[this.current]
        ) {

            return;

        }

        accounts[this.current].nickname =
            nickname;

        if (
            this.current === OWNER_LOGIN
        ) {

            accounts[this.current].xp =
                OWNER_XP;

            accounts[this.current].level =
                45;

            accounts[this.current].role =
                "OWNER";

        } else {

            accounts[this.current].xp =
                Math.max(

                    0,

                    Math.floor(xp)

                );

            let level = 1;

            for (
                const evolution
                of EVOLUTIONS
            ) {

                if (
                    xp >=
                    evolution.xp
                ) {

                    level =
                        evolution.level;

                }

            }

            accounts[this.current].level =
                Math.min(
                    45,
                    level
                );

            accounts[this.current].role =
                "PLAYER";

        }

        this.saveAll(accounts);

    },

    logout() {

        this.current =
            null;

        localStorage.removeItem(
            "skywildCurrentAccount"
        );

    }

};
