// EatingMan.ts
import { _decorator, Component, Node, Vec2, find, PhysicsSystem, Vec3, physics, PhysicsSystem2D } from 'cc';
import { EnemyManager } from '../Enemy/EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('EatingMan')
export class EatingMan extends Component {

    @property
    Speed = 100;

    private enemyManager: EnemyManager | null = null;

    public PlayerNode: Node;

    onLoad() {
        // 在onLoad中查找EnemyManager实例
        this.PlayerNode = find("Canvas/Bg/Player"); // 获取Player节点
        const enemyManagerNodePath = 'Canvas/Bg/EnemyManager'; // 将路径提取为变量，便于管理和修改
        this.enemyManager = find(enemyManagerNodePath).getComponent(EnemyManager);
        if (!this.enemyManager) {
            console.error('EnemyManager not found!');
            return;
        }
    }

    protected start(): void {
        this.PlayerNode.once('Dead', this.eatingManClear, this);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 5);
    }

    eatingManClear() {
        if (this.node) {
            this.scheduleOnce(function () {
                this.node.destroy();
            }, 0.2);
        } else {
            console.log("eatingmanObject is null");
        }

    }

    update(deltaTime: number) {
        if (!this.enemyManager || this.enemyManager.DotArray.length === 0) {
            console.log('No dots found!');
            return;
        }

        const myPos = this.node.position;
        let closestDot: Node | null = null;
        let closestDistance = Infinity;

        // 遍历EnemyManager中的dots数组，找到最近的Dot
        this.enemyManager.DotArray.forEach((dot) => {
            const dotPos = dot.position;
            const distance = Vec2.distance(myPos, dotPos);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestDot = dot;
            }
        });

        // 如果有最近的Dot，则向它移动并朝向它
        if (closestDot) {
            const dotPos = closestDot.getPosition();
            const direction = dotPos.subtract(myPos).normalize();
            const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI) - 90;
            this.node.angle = angle;
            this.node.position = myPos.add(direction.multiplyScalar(deltaTime * this.Speed));
        }

    }
}