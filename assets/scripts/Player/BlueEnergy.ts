import { _decorator, Component, find, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlueEnergy')
export class BlueEnergy extends Component {

    @property
    speed: number = 1200;

    direction: Vec3;

    inited: boolean = false;

    public PlayerNode: Node;

    protected onLoad(): void {
        this.PlayerNode = find("Canvas/Bg/Player");
    }

    start() {
        this.node.rotation = this.PlayerNode.rotation;
        this.direction = this.node.getWorldPosition().subtract(this.PlayerNode.getWorldPosition()).normalize();
        this.inited = true;
        this.PlayerNode.once('Dead', this.BlueEnergyClear, this);

    }

    BlueEnergyClear() {
        if (this.node) {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.2);
        }
    }

    update(deltaTime: number) {
        if (!this.inited) {
            return;
        }
        var pos = this.node.position.clone();
        var deltaPos = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        this.node.position = pos.add(deltaPos);

        var p = this.node.position;
        if (p.x > 1200 || p.x < -1200 || p.y > 1500 || p.y < -1500) {
            this.node.destroy();
        }
    }

}


