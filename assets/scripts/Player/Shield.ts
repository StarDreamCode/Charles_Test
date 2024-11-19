import { _decorator, assert, Collider2D, Component, Contact2DType, find, instantiate, IPhysics2DContact, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shield')
export class Shield extends Component {

    @property(Prefab)
    ShieldBomb:Prefab = null;

    public item_info: Node;

    private isBombSpawned = false;

    protected onLoad(): void {
        this.item_info=find("Canvas/Bg/Item_Info");  
        if (!this.item_info) {
            console.error("Failed to find item_info node.");
        }
    }
    /**
     * 开始函数
     *
     * 获取当前对象的 Collider2D 组件，并监听接触开始事件
     */
    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        } else {
            console.error("Failed to get Collider2D component on Shield.");
        }
        
    }

    /**
     * 当两个碰撞体开始接触时调用此方法。
     *
     * @param selfCollider 自身碰撞体
     * @param otherCollider 其他碰撞体
     * @param contact 接触信息，可能为null
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (!this.isBombSpawned) { // 确保只生成一次炸弹
            this.BombSpawn();
            this.isBombSpawned = true; // 设置标志为true
        }
     }

     /**
      * 生成炸弹
      */
    BombSpawn() {
        if(this.ShieldBomb && this.item_info){
            var Bomb = instantiate(this.ShieldBomb);
            if (Bomb) {
                this.item_info.addChild(Bomb);
            Bomb.setWorldPosition(this.node.worldPosition);
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 1);
            }
        } else {
            console.error("Failed to instantiate ShieldBomb or item_info is not set.");
        }

    }

    update(deltaTime: number) {
        
    }
    /**
     * 销毁对象时调用的方法
     */
    onDestroy() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}


