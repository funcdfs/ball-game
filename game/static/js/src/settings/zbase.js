class Settings {
    constructor(game_root) {
        this.game_root = game_root;
        this.platform = "WEB";
        this.username = "no_user";
        this.photo = "https://s2.loli.net/2021/12/09/SG5unjPJftqULgI.jpg";

        this.$settings = $(`
        <div class="game-settings">
        <section class="game-settings-login">
        <!-- 背景颜色 -->
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="box">
            <!-- 背景圆 -->
            <div class="circle" style="--x: 0"></div>
            <div class="circle" style="--x: 1"></div>
            <div class="circle" style="--x: 2"></div>
            <div class="circle" style="--x: 3"></div>
            <div class="circle" style="--x: 4"></div>
            <div class="circle" style="--x: 5"></div>
            <div class="circle" style="--x: 6"></div>
            <!-- 登录框 -->
            <div class="container">
                <div class="form">
                    <div class="info-title"> 
                        <span> Made by <a href="http://github.com/fengwei2002">github.com/fengwei2002</a></span>
                    </div>
                    <form name="login_from">
                    
                    <div class="game-settings-login-username">
                        <div class="inputBox">
                            <input
                                id = "login-username"
                                type="text"
                                placeholder="username"
                                name="login_username"
                            />
                        </div>
                    </div>
                        <div class="inputBox">
                            <input
                                id = "login-password"
                                class="game-settings-login-password"
                                type="password"
                                placeholder="password"
                                name="login_password"
                            />
                        </div>
                        <div class="inputBox">
                            <input
                                class="game-settings-login-sign-in"
                                type="button"
                                value="sign in"
                            />
                            <input
                                class="game-settings-login-sign-up"
                                type="button"
                                value="sign up"
                            />
                        </div>
                        <div></div>
                        <p class="game-settings-login-forget">
                            forget password?<a href="#"> click here </a>
                        </p>
                        <p class="game-settings-login-error-message">
                            error message
                        </p>
                        <p class="game-settings-login-third">
                            第三方登录
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <section class="game-settings-register">
        <!-- 背景颜色 -->
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="box">
            <!-- 背景圆 -->
            <div class="circle" style="--x: 0"></div>
            <div class="circle" style="--x: 1"></div>
            <div class="circle" style="--x: 2"></div>
            <div class="circle" style="--x: 3"></div>
            <div class="circle" style="--x: 4"></div>
            <div class="circle" style="--x: 5"></div>
            <div class="circle" style="--x: 6"></div>
            <!-- 登录框 -->
            <div class="container">
                <div class="form">
                    <div class="info-title">
                        <span
                            >Made by
                            <a href="http://github.com/fengwei2002"
                                >github.com/fengwei2002</a
                            ></span
                        >
                    </div>
                    <form name="register-from">
                        <div class="inputBox">
                            <input
                                id = "register-username"
                                class="game-settings-register-username"
                                type="text"
                                placeholder="username"
                                name="register_username"
                            />
                        </div>


                        <div class="inputBox">
                            <input
                                id = "register-password"
                                class="game-settings-register-password"
                                type="password"
                                placeholder="password"
                                name="register_password"
                            />
                        </div>
                        <div class="inputBox">
                            <input
                                id = "register-repeat-password"
                                class="game-settings-register-repeat-password"
                                type="password"
                                placeholder="repeat password"
                                name="repeat_password"
                            />
                        </div>
                        <div class="inputBox">
                            <input
                                class="game-settings-register-sign-in"
                                type="button"
                                value="sign in"
                            />
                            <input
                                class="game-settings-register-sign-up"
                                type="button"
                                value="sign up"
                            />
                        </div>
                        <div></div>
                        <p class="game-settings-register-error-message">
                            error message
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
    </div>
`);

        this.$login = this.$settings.find(".game-settings-login");
        this.$login_username = this.$login.find(".game-settings-login-username input");
        this.$login_password = this.$login.find("#login-password")
        this.$login_submit = this.$login.find(".game-settings-login-sign-in")
        this.$login_error_message = this.$login.find(".game-settings-login-error-message")
        this.$login_register = this.$login.find(".game-settings-login-sign-up")
        this.$login_third = this.$login.find(".game-settings-login-third")
        this.$login_forget = this.$login.find(".game-settings-login-forget")
        this.$login.hide();
        this.$login_error_message.hide();
        this.$login_third.hide();
        this.$login_forget.hide();

        this.$register = this.$settings.find(".game-settings-register");
        this.$register_username = this.$register.find(".game-settings-register-username");
        this.$register_password = this.$register.find(".game-settings-register-password");
        this.$register_password_confirm = this.$register.find(".game-settings-register-repeat-password");
        this.$register_submit = this.$register.find(".game-settings-register-sign-up");
        this.$register_error_message = this.$register.find(".game-settings-register-error-message");
        this.$register_login = this.$register.find(".game-settings-register-sign-in");

        this.$register.hide();
        this.$register_error_message.hide();

        this.game_root.$game.append(this.$settings);

        this.start();
        // this.$settings.hide(); 
    }

    start() {
        this.$settings.show();
        this.$login.show();
        this.add_listening_events();
    }
    show_register() {
        this.$login.hide();
        this.$register.show();
    }

    show_login() {
        this.$register.hide();
        this.$login.show();
    }

    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();
    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function () {
            outer.show_register();
        })
        this.$login_submit.click(function () {
            outer.login_on_remote();
            // console.log("username", outer.$login_username.val())
            // console.log("password", outer.$login_password.val())
        })
    }

    add_listening_events_register() {
        let outer = this;

        this.$register_login.click(function () {
            outer.show_login();
        })
        this.$register_submit.click(function () {
            outer.register_on_remote();
        })
    }

    login_on_remote() {
        let outer = this
        let username = outer.$login_username.val();
        let password = outer.$login_password.val();
        this.$login_error_message.empty();


        $.ajax({
            url: "http://47.97.213.122/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    outer.$login.hide();
                    outer.$register.hide();
                    outer.game_root.menu.show();
                } else {
                    outer.$login_error_message.html(resp.result);
                    outer.$login_error_message.show();
                }
            }
        });
    }

    register_on_remote() {
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        console.log(username, password, password_confirm)
        this.$register_error_message.empty();

        $.ajax({
            url: "http://47.97.213.122/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    outer.show_login();
                    outer.$register.hide();
                } else {
                    outer.$register_error_message.html(resp.result);
                    outer.$register_error_message.show();
                }
            }
        });
    }

}
