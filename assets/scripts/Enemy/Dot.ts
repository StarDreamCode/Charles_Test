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
  speed: number = 20;

  @property
  Score: number = 1;

  @property(Prefab)
  DotSpiderWeb: Prefab;

  @property(Prefab)
  swiper_death: Prefab = null;

  @property(Prefab)
  split_death: Prefab = null;

  EnemyManager: EnemyManager = null;

  public PlayerNode: Node;

  public Item_Info: Node;

  private IsInited: boolean = false;

  private Delay: boolean = false;

  act_type: number = 0;

  dir: Vec2 = new Vec2(0, 1,);

  isdead: boolean = false;

  danger: boolean = false;


  public init(act_type: number = 0) {
    this.act_type = act_type;


  }

  setdirection(direction: Vec2) {
    this.dir = direction;
  }


  protected onLoad(): void {
    this.PlayerNode = find("Canvas/Bg/Player");
    if (!this.PlayerNode) {
      console.error("未获取player节点，Dot组件初始化失败！");
      return; // 节点未找到，直接返回，不执行后续逻辑
    }
    console.log("已获取Player节点");
    this.IsInited = true;
    this.Item_Info = find("Canvas/Bg/Item_Info");

  }


  start() {

    // 注册单个碰撞体的回调函数
    let collider = this.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    this.PlayerNode.once('Dead', this.DotClear, this);

    //延迟生成点1秒后生成
    this.scheduleOnce(() => {
      this.Delay = true;
    }, 1);
  }






  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
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

  isSpider: boolean = false;
  onContactToSpiderWeb() {
    //添加减速状态
    this.isSpider = true;
    this.speed = 5;
    const isSpiderWeb = instantiate(this.DotSpiderWeb);
    this.node.addChild(isSpiderWeb);
    isSpiderWeb.setWorldPosition(this.node.worldPosition);
  }

  checkDangerExists() {
    const machinegun = this.Item_Info.children.filter(child => child.name === 'Machinegun');
    const flyingSaw = this.PlayerNode.children.filter(child => child.name === 'FlyingSaw');
    if (flyingSaw.length > 0 || machinegun.length > 0) {
      this.danger = true;
    } else {
      this.danger = false;
    }
  }


  update(deltaTime: number) {
    if (this.act_type == 0) {
      this.chasePlayer(deltaTime);
    } else if (this.act_type == 1) {
      this.moveDirection_1(deltaTime);
    } else if (this.act_type == 2) {
      this.moveDirection_2(deltaTime);
    }

    this.checkBounds();
    this.checkDangerExists();

  }

  // 新增方法：边界检测
  checkBounds() {
    const bounds = {
      left: -700,  // 左边界
      right: 700,  // 右边界
      top: 1200,    // 上边界
      bottom: -1200 // 下边界
    };

    const position = this.node.position;

    if (this.isdead) return;

    if (position.x < bounds.left || position.x > bounds.right ||
      position.y < bounds.bottom || position.y > bounds.top) {
      this.scheduleOnce(() => {
        this.node.destroy();
      }, 0.01);
      this.isdead = true;
    }
  }


  chasePlayer(deltaTime: number) {
    if (this.IsInited && this.Delay) {
      let PlayerPos = this.PlayerNode.getPosition();
      let DotPos = this.node.getPosition();
      let direction;
      if (this.danger) {
        direction = PlayerPos.subtract(DotPos).normalize().negative(); // 远离玩家
      } else {
        direction = PlayerPos.subtract(DotPos).normalize(); // 朝向玩家
      }

      this.node.setPosition(DotPos.add(direction.multiplyScalar(deltaTime * this.speed)));

    } else {
      return;
    }
  }
  moveDirection_1(deltaTime: number) {
    if (this.IsInited && this.Delay) {
      let DotPos = this.node.getPosition();
      let direction = this.node.right;
      this.speed += 50 * deltaTime;
      this.speed > 300 ? 300 : this.speed;
      if (this.isSpider) {
        this.speed = 5;
      }
      this.node.position = DotPos.add(direction.multiplyScalar(deltaTime * this.speed));
    } else {
      return;
    }
  }

  moveDirection_2(deltaTime: number) {
    if (this.IsInited && this.Delay) {
      this.speed += 50 * deltaTime;
      this.speed > 300 ? 300 : this.speed;

      let pos = this.node.getPosition();
      let delta = this.dir.clone().multiplyScalar(this.speed * deltaTime);
      pos.x += delta.x;
      pos.y += delta.y;

      this.node.setPosition(pos);
      if (this.isSpider) {
        this.speed = 5;
      }

    } else {
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
    if (!this.node) return;
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

  Dead() {
    // 计分后销毁自身
    if (this.isdead) return;
    StartManager.getinstance().addScore(this.Score);
    this.scheduleOnce(() => {
      this.node.destroy();
    }, 0.01);
    this.isdead = true;
  }

  DotClear() {
    //清除场地遗存敌人
    if (this.isdead) return;
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



