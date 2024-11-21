import { _decorator, Component, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bomb')
export class Bomb extends Component {
    public PlayerNode: Node;
    protected onLoad(): void {
        this.PlayerNode = find("Canvas/Bg/Player");
    }
    start() {
        this.scheduleOnce(function () {
            this.node.destroy();
        }, 3);
        this.PlayerNode.once('Dead', this.BombClear, this);
    }

    BombClear() {
        if (this.node) {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.2);
        }

    }

    update(deltaTime: number) {

    }

    protected onDestroy(): void {
        this.PlayerNode.off('Dead', this.BombClear, this);
    }
}


