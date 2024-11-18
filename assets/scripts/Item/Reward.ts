import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { ItemType } from '../Enum/Index';
import { PlayerController } from '../Player/PlayerController';
import { Item } from './Item';
const { ccclass, property } = _decorator;

@ccclass('Reward')
export class Reward extends Component {
   
    @property
    RewardType:ItemType = ItemType.BlueEnergy;
    
    start() {
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        //碰撞后播放动画以及音效然后销毁自身
        if(otherCollider.getComponent(PlayerController)){
          this.scheduleOnce(function(){   
            this.node.destroy();
          },0.2);
        }
        

  }

    update(deltaTime: number) {
                                  
    }

    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
              collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
            //数组Item的移除
            Item.getInstance().removeItem(this.node)
    }

    RewardClear(){
      //播放动画销毁自身

      this.scheduleOnce(function(){   
        this.node.destroy();
      },0.2);
    }
}


