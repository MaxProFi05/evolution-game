const Accounts = {

    current: null,


    getAll() {

        try {

            return JSON.parse(
                localStorage.getItem("skywildAccounts")
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

        const accounts = this.getAll();

        login = login.trim();

        if (!login) {

            return {
                ok: false,
                message: "Введите логин"
            };

        }


        if (login.length < 3) {

            return {
                ok: false,
                message: "Логин минимум 3 символа"
            };

        }


        if (password.length < 3) {

            return {
                ok: false,
                message: "Пароль минимум 3 символа"
            };

        }


        if (accounts[login]) {

            return {
                ok: false,
                message: "Такой аккаунт уже существует"
            };

        }


        accounts[login] = {

            password: password,

            nickname: login,

            xp: 0,

            level: 1,

            created: Date.now()

        };


        this.saveAll(accounts);


        this.current = login;


        localStorage.setItem(
            "skywildCurrentAccount",
            login
        );


        return {
            ok: true,
            message: "Аккаунт создан"
        };

    },


    login(login, password) {

        const accounts = this.getAll();

        login = login.trim();


        if (!accounts[login]) {

            return {
                ok: false,
                message: "Аккаунт не найден"
            };

        }


        if (
            accounts[login].password !== password
        ) {

            return {
                ok: false,
                message: "Неверный пароль"
            };

        }


        this.current = login;


        localStorage.setItem(
            "skywildCurrentAccount",
            login
        );


        return {
            ok: true,
            message: "Вход выполнен"
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


        const accounts = this.getAll();


        if (!accounts[login]) {

            return false;

        }


        this.current = login;


        return true;

    },


    getAccount() {

        if (!this.current) {

            return null;

        }


        const accounts = this.getAll();


        return accounts[this.current] || null;

    },


    saveProgress(xp, nickname) {

        if (!this.current) {

            return;

        }


        const accounts = this.getAll();


        if (!accounts[this.current]) {

            return;

        }


        accounts[this.current].xp =
            Math.max(
                0,
                Math.floor(xp)
            );


        accounts[this.current].nickname =
            nickname;


        let level = 1;


        for (const evolution of EVOLUTIONS) {

            if (
                xp >= evolution.xp
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


        this.saveAll(accounts);

    },


    logout() {

        this.current = null;


        localStorage.removeItem(
            "skywildCurrentAccount"
        );

    }

};
