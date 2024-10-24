import { _decorator, Animation, animation, Collider2D, Component, Contact2DType, find, IPhysics2DContact, macro, Node, Vec2, Vec3 } from 'cc';
import { PlayerController } from '../Player/PlayerController';
import { StartManager } from '../Scene/StartManager';
import { EnemyManager } from './EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('Dot')
export class Dot extends Component {

    


    @property
    speed:number = 80;

    @property
    Score:number = 1;

    public PlayerNode:Node;

    private IsInited:boolean=false;

    protected onLoad(): void { 
      this.PlayerNode=find("Canvas/Bg/Player");  
      if(this.PlayerNode){
        console.log("已获取Player节点");
        this.IsInited = true;
      }else{
        console.log("未获取player节点");
      }
    }
    
    start() {
          // 注册单个碰撞体的回调函数
          let collider = this.getComponent(Collider2D);
          if (collider) {
              collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }

            this.PlayerNode.once('Dead',this.isPlayerDead,this);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
          //计分后播放死亡动画计分然后销毁自身
          if(otherCollider.getComponent(PlayerController)){
            StartManager.getinstance().addScore(this.Score);
            this.scheduleOnce(function(){   
              this.node.destroy();
            },1);
          }
          

    }


    update(deltaTime: number) {
      if(this.IsInited){
        let PlayerPos = this.PlayerNode.getPosition();
        let DotPos = this.node.position;
        let direction = PlayerPos.subtract(DotPos).normalize();
        this.node.position=DotPos.add(direction.multiplyScalar(deltaTime*this.speed));  
      }else{
        return;
      }
    }

    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
              collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
            EnemyManager.getInstance().removeEnermy(this.node)
        
    }

    isPlayerDead(){
      
    }
    

    EatingMan(){

    }

    SpiderWeb(){
      
    }

}


