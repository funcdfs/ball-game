class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class = "game-menu">
    <div class = "game-menu-background-box">
        <div class="game-menu-item game-menu-item-single" >
            Single Player Mode
        </div>

        <div class="game-menu-item game-menu-item-multi">
            Multi Player Mode
        </div>

        <div class="game-menu-item game-menu-item-settings">
            Settings
        </div>
        <div class="game-menu-item game-menu-item-author">
            About Author
        </div>

        <div class="game-menu-item game-menu-item-sign-out">
            Sign Out
        </div>
    </div>
</div>
        `);
        this.$menu.hide();
        this.root.$game.append(this.$menu);
        this.$single_mode = this.$menu.find('.game-menu-item-single');
        this.$multi_mode = this.$menu.find('.game-menu-item-multi');
        this.$settings = this.$menu.find('.game-menu-item-settings');
        this.$author = this.$menu.find('.game-menu-item-author')
        this.$sign_out = this.$menu.find('.game-menu-item-sign-out')
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            outer.hide();
            outer.root.$playground.show();
        });
        this.$multi_mode.click(function () {
            console.log("click multi mode");
        });
        this.$settings.click(function () {
            console.log("click settings");
        });
        this.$author.click(function () {
            console.log("click author")
        })
        this.$sign_out.click(function () {
            console.log("click sign_out")
            outer.root.settings.logout_on_remote();
        })
    }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}let GAME_OBJECTS = [];

class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);

        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < GAME_OBJECTS.length; i++) {
            if (GAME_OBJECTS[i] === this) {
                GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < GAME_OBJECTS.length; i++) {
        let obj = GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(GAME_ANIMATION);
}


requestAnimationFrame(GAME_ANIMATION);
class GameMap extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class Particle extends GameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends GameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.friction = 0.9;
        this.spent_time = 0;

        this.cur_skill = null;

        if (this.is_me) {
            this.img = new Image();
            this.img.src = this.playground.root.$settings.photo;
        }
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                }

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function (e) {
            if (e.which === 81) {  // q
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "#A78BFA";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        for (let i = 0; i < 20 + Math.random() * 10; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        if (!this.is_me && this.spent_time > 4 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
        }

        if (this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render() {
        if (this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}
class FireBall extends GameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class GamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="game-playground"></div>`);

        this.hide();
        this.start();
    }

    get_random_color() {
        let colors = [
            "#9768ab",
            "#145266",
            "#d9688f",
            "#2cf543",
            "#a37e26",
        ];
        return colors[Math.floor(Math.random() * 5)];
    }

    start() {
    }

    show() {  // 打开playground界面
        this.$playground.show();
        this.root.$game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        for (let i = 0; i < 4; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }

    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
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
            url: "https://app1029.acapp.acwing.com.cn/settings/login/",
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
                    outer.game_root.$menu.show();
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
            url: "https://app1029.acapp.acwing.com.cn/settings/register/",
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
export class AGame {
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);
        this.$menu = new GameMenu(this);
        this.$playground = new GamePlayground(this);
        this.$settings = new Settings(this);

        this.start();
    }

    start() {
    }
}
