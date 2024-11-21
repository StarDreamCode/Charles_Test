import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Machinegun')
export class Machinegun extends Component {
  @property
  ShootRate: number = 0.5;

  /*  @property
    shootTimer:number = 0;*/

  public BulletParent: Node = null;

  @property(Prefab)
  Bullet: Prefab = null;

  @property(Node)
  Player: Node = null;

  @property
  MachinegunTime: number = 8;

  public PlayerNode: Node;

  protected onLoad(): void {
    this.PlayerNode = find("Canvas/Bg/Player");
    this.BulletParent = find("Canvas/Bg/Item_Info/BulletParent");

  }

  start() {
    this.schedule(this.BulletSpawn, this.ShootRate);
    this.scheduleOnce(() => {
      this.node.destroy();
    }, this.MachinegunTime);
    this.PlayerNode.once('Dead', this.MachinegunClear, this);

    //   const p = this.Player.getRotation();
    //  this.BulletParent.setRotation(p);
  }

  update(deltaTime: number) {

    this.node.eulerAngles = this.PlayerNode.eulerAngles;
    this.node.position = this.PlayerNode.position;

    /*  this.shootTimer+=deltaTime;
      if(this.shootTimer>this.ShootRate){
          this.shootTimer=0;
          const bullet = instantiate(this.Bullet);
          this.BulletParent.addChild(bullet);
          bullet.setWorldPosition(this.node.worldPosition);
      }*/
  }
  BulletSpawn() {
    const bullet = instantiate(this.Bullet);
    this.BulletParent.addChild(bullet);
    bullet.setWorldPosition(this.node.getChildByName("Machinegun_position").worldPosition);
  }

  MachinegunClear() {
    if (this.node) {
      this.scheduleOnce(() => {
        this.node.destroy();
      }, 0.2);
    }
  }

  protected onDestroy(): void {
    this.PlayerNode.off('Dead', this.MachinegunClear, this);
  }
}


