import { _decorator, Component, find, Node, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShieldBomb')
export class ShieldBomb extends Component {
    
    public PlayerNode: Node;

    private rigidBody2D: RigidBody2D | null = null; // 声明并初始化为 null

    private isDestroyed: boolean = false; // 添加标志位，防止重复销毁

    protected onLoad() {
        this.PlayerNode = find("Canvas/Bg/Player")as Node;
        if (!this.PlayerNode) {
            console.error("Failed to find PlayerNode.");
        }
         // 获取 RigidBody2D 组件
         this.rigidBody2D = this.getComponent(RigidBody2D);
         if (!this.rigidBody2D) {
             console.error("RigidBody2D component not found.");
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
            if (this.rigidBody2D) {
                this.rigidBody2D.enabled = false; // 确保 rigidBody2D 不为 null
            } else {
                console.error("RigidBody2D is null when trying to set active.");
            }
            this.scheduleOnce(() => {
                this.node.destroy();
                this.isDestroyed = true; // 更新标志位
            }, 0.2);
        }
    }
    
    update(deltaTime: number) {
          // 确保在每次更新时检查 rigidBody2D 是否为 null
          if (this.rigidBody2D === null) {
            console.error("RigidBody2D is null in update method.");
        }
    }
    protected onDestroy(): void {
        if (this.PlayerNode) {
            this.PlayerNode.off('Dead', this.ShieldBombClear, this);
        }
        this.isDestroyed = true; // 确保在onDestroy时更新标志位
    }
}


