import { _decorator, Component, find, Node, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShieldBomb')
export class ShieldBomb extends Component {
    
    public PlayerNode: Node;

    private isDestroyed: boolean = false; // 添加标志位，防止重复销毁

    protected onLoad() {
        this.PlayerNode = find("Canvas/Bg/Player")as Node;
        if (!this.PlayerNode) {
            console.error("Failed to find PlayerNode.");
        }
    }
    start() {
        this.scheduleOnce(() => {
            if (!this.isDestroyed) { // 检查是否已销毁
                this.node.destroy();
                this.isDestroyed = true; // 更新标志位
            }
        }, 3);
        
        if (this.PlayerNode) {
            this.PlayerNode.once('Dead', this.ShieldBombClear, this);
        } else {
            console.error("PlayerNode is not set.");
        }
    }

    ShieldBombClear() {
        if (!this.isDestroyed) { // 检查是否已销毁
            this.scheduleOnce(() => {
                this.node.destroy();
                this.isDestroyed = true; // 更新标志位
            }, 0.2);
        }
    }
    
    update(deltaTime: number) {

    }
    protected onDestroy(): void {
        this.PlayerNode.off('Dead', this.ShieldBombClear, this);
        this.isDestroyed = true; // 确保在onDestroy时更新标志位
    }
}


