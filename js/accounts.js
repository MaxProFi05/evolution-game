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
        password = password.trim();


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

        const login = localStorage.getItem(
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


    getLevelFromXP(xp) {

        let level = 1;


        if (
            typeof EVOLUTIONS === "undefined"
        ) {

            return level;

        }


        for (const evolution of EVOLUTIONS) {

            if (
                xp >= evolution.xp
            ) {

                level = evolution.level;

            }

        }


        return Math.min(
            45,
            level
        );

    },


    saveProgress(xp, nickname) {

        if (!this.current) {

            return;

        }


        const accounts = this.getAll();


        if (!accounts[this.current]) {

            return;

        }


        accounts[this.current].xp = Math.max(
            0,
            Math.floor(xp)
        );


        if (nickname) {

            accounts[this.current].nickname =
                nickname;

        }


        accounts[this.current].level =
            this.getLevelFromXP(xp);


        this.saveAll(accounts);


        this.updateMenu();

    },


    updateMenu() {

        const account =
            this.getAccount();


        if (!account) {

            return;

        }


        const accountInfo =
            document.querySelector(
                "#accountInfo"
            );


        if (accountInfo) {

            accountInfo.textContent =
                account.nickname;

        }


        const levelText =
            document.querySelector(
                ".level-text"
            );


        if (levelText) {

            levelText.textContent =
                `УРОВЕНЬ ${account.level} / 45`;

        }


        const menuXpText =
            document.querySelector(
                "#menuXpText"
            );


        if (menuXpText) {

            menuXpText.textContent =
                `${account.xp} XP`;

        }


        const menuXpFill =
            document.querySelector(
                "#menuXpFill"
            );


        if (menuXpFill) {

            let currentXP = 0;
            let nextXP = 100;


            if (
                typeof EVOLUTIONS !== "undefined"
            ) {

                const currentEvolution =
                    EVOLUTIONS.find(
                        evolution =>
                            evolution.level === account.level
                    );


                const nextEvolution =
                    EVOLUTIONS.find(
                        evolution =>
                            evolution.level ===
                            account.level + 1
                    );


                if (currentEvolution) {

                    currentXP =
                        currentEvolution.xp;

                }


                if (nextEvolution) {

                    nextXP =
                        nextEvolution.xp;

                }

            }


            let percent = 100;


            if (
                account.level < 45
            ) {

                percent =
                    (
                        (account.xp - currentXP) /
                        (nextXP - currentXP)
                    ) * 100;

            }


            percent = Math.max(
                0,
                Math.min(
                    100,
                    percent
                )
            );


            menuXpFill.style.width =
                `${percent}%`;

        }


        const evolutionName =
            document.querySelector(
                ".evolution-name"
            );


        if (
            evolutionName &&
            typeof EVOLUTIONS !== "undefined"
        ) {

            const evolution =
                EVOLUTIONS.find(
                    item =>
                        item.level === account.level
                );


            if (evolution) {

                evolutionName.textContent =
                    evolution.name ||
                    evolution.title ||
                    `Эволюция ${account.level}`;

            }

        }

    },


    logout() {

        this.current = null;


        localStorage.removeItem(
            "skywildCurrentAccount"
        );

    }

};
