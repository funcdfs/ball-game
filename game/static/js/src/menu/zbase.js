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

        <div class="game-menu-item game-menu-item-sign-out">
            Sign Out
        </div>
        <div class="game-menu-item game-menu-item-author">
            About Author
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
        // this.$menu.show();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function () {
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.click(function () {
            console.log("click settings");
        });
        this.$author.click(function () {
            console.log("click author")
        })
        this.$sign_out.click(function () {
            console.log("click sign_out")
            outer.logout_on_remote();
        })
    }

    logout_on_remote() {
        $.ajax({
            url: "http://47.97.213.122/settings/logout/",
            type: "GET",
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }
    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}