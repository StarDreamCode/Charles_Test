import { _decorator, Component, find, math, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Machinegun_bullet')
export class Machinegun_bullet extends Component {
    @property
    speed: number = 1200;

    direction: Vec3;

    inited: boolean = false;

    public PlayerNode: Node;

    protected onLoad(): void {
        this.PlayerNode = find("Canvas/Bg/Player");

    }

    start() {
        // let PlayerAngle = this.PlayerNode.getWorldRotation();
        this.node.rotation = this.PlayerNode.rotation;
        this.direction = this.node.getWorldPosition().subtract(this.PlayerNode.getWorldPosition()).normalize();
        this.inited = true;
    }

    update(deltaTime: number) {
        if (!this.inited) {
            return;
        }
        var pos = this.node.position.clone();
        var deltaPos = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        this.node.position = pos.add(deltaPos);

        var p = this.node.position;
        if (p.x > 2000 || p.x < -2000 || p.y > 4000 || p.y < -4000) {
            this.node.destroy();
        }


    }
}


