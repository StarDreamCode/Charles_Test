import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
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

    start() {
        this.schedule(this.BulletSpawn,this.ShootRate);
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
}


