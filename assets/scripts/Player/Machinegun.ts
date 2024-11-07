import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Machinegun')
export class Machinegun extends Component {
    @property
    ShootRate:number = 0.5;

  /*  @property
    shootTimer:number = 0;*/

    @property(Node)
    BulletParent:Node = null;

    @property(Prefab)
    Bullet:Prefab = null;

    @property(Node)
    Player:Node = null;

    @property
    Time:number = 5;

    protected onLoad(): void {
    //  this.BulletParent=find("Canvas/Bg/Item_Info/BulletParent");
      
  }

    start() {
        this.schedule(this.BulletSpawn,this.ShootRate);
        this.scheduleOnce(this.MachinegunOff,this.Time);
        
     //   const p = this.Player.getRotation();
      //  this.BulletParent.setRotation(p);
    }

    update(deltaTime: number) {

      this.node.eulerAngles = this.Player.eulerAngles;
      this.node.position = this.Player.position;
      /*  this.shootTimer+=deltaTime;
        if(this.shootTimer>this.ShootRate){
            this.shootTimer=0;
            const bullet = instantiate(this.Bullet);
            this.BulletParent.addChild(bullet);
            bullet.setWorldPosition(this.node.worldPosition);
        }*/
    }
    BulletSpawn(){
        const bullet = instantiate(this.Bullet);
        this.BulletParent.addChild(bullet);
        bullet.setWorldPosition(this.node.getChildByName("Machinegun_position").worldPosition);
    }

    MachinegunOff(){
      this.node.active =false;
    }

    protected onDestroy(): void {
      
    }
}


