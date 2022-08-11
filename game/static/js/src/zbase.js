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
