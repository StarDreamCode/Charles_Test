import { _decorator, Animation, animation, Collider2D, Component, Contact2DType, find, instantiate, IPhysics2DContact, macro, math, Node, Prefab, Sprite, SpriteFrame, Vec2, Vec3 } from 'cc';
import { PlayerController } from '../Player/PlayerController';
import { StartManager } from '../Scene/StartManager';
import { EnemyManager } from './EnemyManager';
import { Machinegun_bullet } from '../Player/Machinegun_bullet';
import { SpiderWeb } from '../Player/SpiderWeb';
import { Constant } from '../Constant';
import { PoolManager } from '../PoolManager';
import { Wiper } from '../Player/Wiper';
const { ccclass, property } = _decorator;

@ccclass('Dot')
export class Dot extends Component {

    @property
    speed:number = 20;

    @property
    Score:number = 1;

    @property(Prefab)
    DotSpiderWeb: Prefab;

    @property(Prefab)
    swiper_death: Prefab = null;

    @property(Prefab)
    split_death: Prefab = null;

    EnemyManager: EnemyManager = null;

    public PlayerNode: Node;

    private IsInited: boolean = false;

    private Delay: boolean = false;

    private animationComponent: Animation | null = null;


    protected onLoad(): void {              
          this.PlayerNode=find("Canvas/Bg/Player");  
          if(this.PlayerNode) {
            console.log("已获取Player节点");
            this.IsInited = true;
          }else{
            console.log("未获取player节点");
            this.IsInited = false;
          }
    }

    
    start() {
          
          // 注册单个碰撞体的回调函数
          let collider = this.getComponent(Collider2D);
          if (collider) {
              collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
            this.PlayerNode.once('Dead',this.DotClear,this);
          //延迟生成点1秒后生成
            this.scheduleOnce(() => {
                this.Delay = true;
            }, 1);
    }

    

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
          //计分后播放死亡动画计分然后销毁自身
          const playerController = otherCollider.getComponent(PlayerController);
          const spiderWeb = otherCollider.getComponent(SpiderWeb);
          const wiper = otherCollider.getComponent(Wiper);
  
          if (playerController) return;
  
          if (spiderWeb) {
              this.onContactToSpiderWeb();
              return;
          }
  
          this.Dead();
  
          if (wiper) {
              this.showSwiperDeath();
          } else {
              this.showSplitDeath();
          }
        
    }
    onContactToSpiderWeb(){
      //添加减速状态
      this.speed = 5;
      const isSpiderWeb = instantiate(this.DotSpiderWeb);
      this.node.addChild(isSpiderWeb);
      isSpiderWeb.setWorldPosition(this.node.worldPosition);
    }


    update(deltaTime: number) {
      if (this.IsInited &&  this.Delay) {
        let PlayerPos = this.PlayerNode.getPosition();
        let DotPos = this.node.position;
        let direction = PlayerPos.subtract(DotPos).normalize();
        this.node.position = DotPos.add(direction.multiplyScalar(deltaTime * this.speed));  
       }else {
        return;
      }
    }

    showSwiperDeath() {   
      this.showDeathEffect(this.swiper_death);
  }

    showSplitDeath() {
      this.showDeathEffect(this.split_death);
  }
  /**
   * 显示死亡效果
   *
   * @param deathPrefab 死亡效果预制体
   */
  private showDeathEffect(deathPrefab: Prefab) {
    const deathNode = instantiate(deathPrefab);
    let dotSpriteComp = this.node.getComponent(Sprite);
    if (dotSpriteComp) {
        let dotColor = dotSpriteComp.color;
        let comp = deathNode.getComponent(Sprite);
        if (comp) {
            comp.color = dotColor;
        } else {
            console.error("Death effect prefab missing Sprite component!");
        }
    } else {
        console.error("Current Dot node missing Sprite component!");
    }

    let enemyManager = find("Canvas/Bg/EnemyManager");
    if (enemyManager) {
        enemyManager.addChild(deathNode);
        deathNode.setWorldPosition(this.node.worldPosition);
    } else {
        console.error("EnemyManager node not found!");
    }
}

    isdead:boolean = false;

    Dead(){
        // 计分后销毁自身
        if (this.isdead) return;
        StartManager.getinstance().addScore(this.Score);
        this.scheduleOnce(() => {   
            this.node.destroy();
        }, 0.01);
        this.isdead = true;
    }
    
    DotClear(){
      //清除场地遗存敌人
      if(this.isdead)return;
      this.showSplitDeath();
      this.scheduleOnce(() => {
        this.node.destroy();
    }, 0.01);
      this.isdead = true;
    }

    

    
    protected onDestroy(): void {
      let collider = this.getComponent(Collider2D);
      if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
          //数组移除
          EnemyManager.getInstance().removeDot(this.node);
    
    }
  }



