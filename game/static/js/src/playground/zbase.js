class GamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="game-playground"></div>`);
        this.colors_index = -1;
        this.hide();
        this.root.$game.append(this.$playground);
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
        this.colors_index++;
        return colors[this.colors_index];
    }

    start() {
        let outer = this;
        $(window).resize(function () {
            outer.resize();
        });
    }


    show(mode) {  // 打开playground界面
        let outer = this;
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));

        if (mode === "single mode") {
            for (let i = 0; i < 5; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.15, "robot"));
            }
        } else if (mode === "multi mode") {
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function () {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }
    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
