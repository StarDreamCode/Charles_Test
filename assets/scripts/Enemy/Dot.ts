import { _decorator, Animation, animation, Collider2D, Component, Contact2DType, find, instantiate, IPhysics2DContact, macro, Node, Prefab, Vec2, Vec3 } from 'cc';
import { PlayerController } from '../Player/PlayerController';
import { StartManager } from '../Scene/StartManager';
import { EnemyManager } from './EnemyManager';
import { Machinegun_bullet } from '../Player/Machinegun_bullet';
import { SpiderWeb } from '../Player/SpiderWeb';
const { ccclass, property } = _decorator;

@ccclass('Dot')
export class Dot extends Component {

    


    @property
    speed:number = 20;

    @property
    Score:number = 1;

    @property(Prefab)
    DotSpiderWeb:Prefab;

    public PlayerNode:Node;

    private IsInited:boolean=false;

    protected onLoad(): void {
          
            this.PlayerNode=find("Canvas/Bg/Player");  
            if(this.PlayerNode) {
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
            this.PlayerNode.once('Dead',this.DotClear,this);
    }

    

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
          //计分后播放死亡动画计分然后销毁自身
          if(otherCollider.getComponent(PlayerController)){
            return;
          }else if(otherCollider.getComponent(SpiderWeb)){
            this.onCantactToSpiderWeb();
          }else{
            this.Dead();
          }
    }
    onCantactToSpiderWeb(){
      //添加减速状态
      this.speed = 5;
      const isSpiderWeb = instantiate(this.DotSpiderWeb);
      this.node.addChild(isSpiderWeb);
      isSpiderWeb.setWorldPosition(this.node.worldPosition);
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
    

    isdead:boolean = false;

    Dead(){
      //播放动画计分后销毁自身
      if(this.isdead)return;

      StartManager.getinstance().addScore(this.Score);
      this.scheduleOnce(function(){   
        this.node.destroy();
      },0.2);
      this.isdead = true;
    }
    
    DotClear(){
      //玩家死亡后播放死亡动画清除场地遗存敌人
      if(this.isdead)return;
      
      this.scheduleOnce(function(){   
        this.node.destroy();
      },0.2);
      this.isdead = true;
    }
    

    EatingMan(){

    }
    protected onDestroy(): void {
      let collider = this.getComponent(Collider2D);
      if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
          //数组相关超出地图外销毁也要考虑
          EnemyManager.getInstance().removeDot(this.node);
  }



}


