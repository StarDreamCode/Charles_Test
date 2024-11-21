import { _decorator, Animation, AudioClip, AudioSource, Collider2D, Component, Contact2DType, EventTouch, FixedConstraint, Input, input, instantiate, IPhysics2DContact, misc, Node, Prefab, Vec3 } from 'cc';
import { GameState, ItemType } from '../Enum/Index';
import { Item } from '../Item/Item';
import { Reward } from '../Item/Reward';
import { EnemyManager } from '../Enemy/EnemyManager';
import { StartManager } from '../Scene/StartManager';
const { ccclass, property } = _decorator;


@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Node)
    Body: Node = null;

    @property(Animation)
    Emotion_Woops: Animation = null;

    @property(Animation)
    Emotion_Avoid: Animation = null;

    @property(AudioSource)
    Emotion_Woops_Audio: AudioSource = null;

    @property
    PlayerSpeed: number = 2;

    @property(Prefab)
    Machinegun: Prefab = null;

    @property(Prefab)
    BlueEnergy: Prefab = null;

    @property(Prefab)
    RedEnergy: Prefab = null;

    @property(Prefab)
    Wiper: Prefab = null;

    @property(Prefab)
    Fire: Prefab = null;

    @property(Prefab)
    SpiderWeb: Prefab = null;

    @property(Prefab)
    FlyingSaw: Prefab = null;

    @property(Prefab)
    Bomb: Prefab = null;

    @property(Prefab)
    Shield: Prefab = null;

    @property(Prefab)
    EatingMan: Prefab = null;

    @property(Node)
    Item_info: Node = null;

    @property
    CoinValue: number = 100;

    targetAngle: number = 0;

    public _canControl: boolean = true;

    private canMove: boolean = true;

    private canRotate: boolean = true;

    public isdanger: boolean = false;

    public hasMachinegun: boolean = false;

    private static instance: PlayerController;

    public static getinstance(): PlayerController {
        return this.instance;
    }

    private deltaTime: number = 0;

    protected onLoad(): void {
        PlayerController.instance = this;
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

    }


    public onTouchMove(event: EventTouch) {
        if (!this._canControl) return;

        const p = this.node.position;

        const boundary = { minX: -550, maxX: 550, minY: -877, maxY: 877, };

        let targetPosition = new Vec3(p.x + event.getDeltaX() * this.PlayerSpeed, p.y + event.getDeltaY() * this.PlayerSpeed, p.z);

        // 应用硬边界限制
        targetPosition.x = Math.max(Math.min(targetPosition.x, boundary.maxX), boundary.minX);
        targetPosition.y = Math.max(Math.min(targetPosition.y, boundary.maxY), boundary.minY);

        // 应用软边界限制并发出事件
        if (targetPosition.x < -40 || targetPosition.x > 40 || targetPosition.y < -40 || targetPosition.y > 40) {
            this.node.emit('out_of_range', event);
        }

        if (this.canRotate && !this.hasMachinegun) {
            let radian = Math.atan2(targetPosition.y - p.y, targetPosition.x - p.x);
            this.targetAngle = radian * (180 / Math.PI);
            this.node.angle = this.rotateToDirection(this.node.angle, this.targetAngle - 90, 10, 1);
        } else {
            this.onTouchStart(event);
        }

        if (this.canMove) {
            this.node.setPosition(targetPosition);
        }

    }

    public onTouchStart(event: EventTouch) {
        if (!this._canControl) return;

        // 获取触摸位置
        const touchPosition = event.getLocation();

        // 获取角色当前位置
        const playerPosition = this.node.position;

        // 计算触摸位置相对于角色当前位置的角度
        const deltaX = touchPosition.x - playerPosition.x;
        const deltaY = touchPosition.y - playerPosition.y;

        let radian = Math.atan2(deltaY, deltaX);
        let targetAngle = radian * (180 / Math.PI);

        // 调整目标角度，使其与角色当前角度一致
        this.targetAngle = targetAngle - 90; // 假设角色初始角度为0度

        // 平滑旋转角色
        this.node.angle = this.MachinegunRotate(this.node.angle, this.targetAngle, 5, 1);
    }

    protected rotateToDirection(angle1: number, angle2: number, speed: number, dt: number) {
        //计算角度差值，确保差值在-π到π之间
        let diff = angle2 - angle1;
        const pi = Math.PI;
        const angelIndegrees = misc.radiansToDegrees(pi);
        while (diff > angelIndegrees) {
            diff -= 2 * angelIndegrees;
        }
        while (diff < -angelIndegrees) {
            diff += 2 * angelIndegrees;
        }
        //根据速度和时间步长计算本次旋转的角度增量
        let rotation = speed * dt;

        //如果增量会导致超过目标角度，就直接设置为目标角度
        if (Math.abs(diff) < Math.abs(rotation)) {
            return angle2;
        }
        //根据角度差量的正负来确定旋转方向
        if (diff > 0) {
            angle1 += rotation;
        } else {
            angle1 -= rotation;
        }
        return angle1;
    }

    protected MachinegunRotate(angle1: number, angle2: number, speed: number, dt: number) {
          //计算角度差值，确保差值在-π到π之间
          let diff = angle2 - angle1;
          const pi = Math.PI;
          const angelIndegrees = misc.radiansToDegrees(pi);
          while (diff > angelIndegrees) {
              diff -= 2 * angelIndegrees;
          }
          while (diff < -angelIndegrees) {
              diff += 2 * angelIndegrees;
          }
          //根据速度和时间步长计算本次旋转的角度增量
          let rotation = speed * dt;
  
          //如果增量会导致超过目标角度，就直接设置为目标角度
          if (Math.abs(diff) < Math.abs(rotation)) {
              return angle2;
          }
          //根据角度差量的正负来确定旋转方向
          if (diff > 0) {
              angle1 += rotation;
          } else {
              angle1 -= rotation;
          }
          return angle1;
    }


    start() {
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.canMove = true;
        this.canRotate = true;


    }
    showEmotionDanger() {
        const p = this.node.getPosition();
        this.Emotion_Avoid.node.setPosition(p.x + 40, p.y + 40, p.z);
        this.Emotion_Avoid.play();

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次

        const reward = otherCollider.getComponent(Reward)
        if (reward) {
            switch (reward.RewardType) {
                case ItemType.BlueEnergy: {
                    this.getBlueEnergy();
                    break;
                }
                case ItemType.Bomb: {
                    this.getBomb();
                    break;
                }
                case ItemType.RedEnergy: {
                    this.getRedEnergy();
                    break;
                }
                case ItemType.FlyingSaw: {
                    this.getFlyingSaw();
                    break;
                }
                case ItemType.SpiderWeb: {
                    this.getSpiderWeb();
                    break;
                }
                case ItemType.Shield: {
                    this.getShield();
                    break;
                }
                case ItemType.Wiper: {
                    this.getWiper();
                    break;
                }
                case ItemType.Turret: {
                    this.getTurret();
                    break;
                }
                case ItemType.EatingMan: {
                    this.getEatingMan();
                    break;
                }
                case ItemType.Fire: {
                    this.getFire();
                    break;
                }
                case ItemType.Coin: {
                    this.getCoin();
                    break;
                }



            }
        } else {
            if (this.isdanger) {
                this.onContactToDot();
            }
            this.showEmotionDanger();
            this.isdanger = true;
            this.scheduleOnce(() => {
                this.cancelDanger()
            }, 2)


        }



    }
    getBlueEnergy() {
        // this.node.getComponent(Animation).play('BlueEnergy');
        console.log("getBlueEnergy");
        this.scheduleOnce(this.BlueEnergySpawn, 1);
    }
    getBomb() {
        console.log("getBomb");
        this.scheduleOnce(this.BombSpawn, 0.1);

    }
    getRedEnergy() {
        console.log("getRedEneygy");
        this.scheduleOnce(this.RedEnergySpawn, 0.1);
    }
    getFlyingSaw() {
        console.log("getFlyingSaw");
        this.scheduleOnce(this.FlyingSawSpawn, 0.1);
    }
    getSpiderWeb() {
        console.log("getSpiderWeb");
        this.scheduleOnce(this.SpiderWebSpawn, 0.1);
    }
    getShield() {
        console.log("getShield");
        this.scheduleOnce(this.ShieldSpawn, 0.1);
    }
    getWiper() {
        console.log("getWiper");
        this.scheduleOnce(this.WiperSpawn, 0.1);
    }
    getTurret() {
        console.log("getTurret");
        this.scheduleOnce(this.MachinegunSpawn, 0.1);
    }
    getEatingMan() {
        console.log("getEatingMan");
        this.scheduleOnce(this.EatingManSpawn, 0.1);
        //  EnemyManager.getInstance().ongetEatingMan();
    }
    getFire() {
        console.log("getFire");
        this.schedule(this.FireSpawn, 0.1);
        this.scheduleOnce(this.StopFireSpawn, 4);

    }
    getCoin() {
        console.log("getCoin");
        this.node.emit('get100Coin', this.node);
    }

    BlueEnergySpawn() {
        const BE_bullet = instantiate(this.BlueEnergy);
        this.Item_info.addChild(BE_bullet);
        BE_bullet.setWorldPosition(this.node.getChildByName("Bullet_Position").worldPosition);

    }
    RedEnergySpawn() {
        const Red_bullet = instantiate(this.RedEnergy);
        this.Item_info.addChild(Red_bullet);
        Red_bullet.setWorldPosition(this.node.worldPosition);
    }
    WiperSpawn() {
        const Wiper = instantiate(this.Wiper);
        this.Item_info.addChild(Wiper);

    }
    FireSpawn() {
        const Fire = instantiate(this.Fire);
        this.Item_info.addChild(Fire);
        Fire.setWorldPosition(this.node.worldPosition);
    }
    StopFireSpawn() {
        this.unschedule(this.FireSpawn);
    }

    SpiderWebSpawn() {
        const SpiderWeb = instantiate(this.SpiderWeb);
        this.Item_info.addChild(SpiderWeb);
        SpiderWeb.setWorldPosition(this.node.worldPosition);
    }

    FlyingSawSpawn() {
        const FlyingSaw = instantiate(this.FlyingSaw);
        this.node.addChild(FlyingSaw);
        FlyingSaw.setWorldPosition(this.node.worldPosition);
    }
    BombSpawn() {
        const Bomb = instantiate(this.Bomb);
        this.Item_info.addChild(Bomb);
        Bomb.setWorldPosition(this.node.worldPosition);
    }
    ShieldSpawn() {
        const Shield = instantiate(this.Shield);
        this.node.addChild(Shield);
        Shield.setWorldPosition(this.node.worldPosition);
    }
    EatingManSpawn() {
        const EatingMan = instantiate(this.EatingMan);
        this.Item_info.addChild(EatingMan);
        EatingMan.setWorldPosition(this.node.worldPosition);
    }
    MachinegunSpawn() {
        const Machinegun = instantiate(this.Machinegun);
        this.Item_info.addChild(Machinegun);
        Machinegun.setWorldPosition(this.node.worldPosition);
    }

    public cancelDanger() {
        this.isdanger = false;
    }



    onContactToDot() {
        const p = this.node.getPosition();
        this.Emotion_Woops.node.setPosition(p.x + 20, p.y + 20, p.z);
        this.Emotion_Woops.play();
        this.Emotion_Woops_Audio.play();
        this.node.emit('Dead');
        this.unscheduleAllCallbacks();

    }

    disableControl() {
        console.log('禁止控制');
        this._canControl = false;
        this.setIsCanControl(this._canControl);
    }

    enableControl() {
        console.log('允许控制');
        this._canControl = true;
        this.setIsCanControl(this._canControl);
    }

    public setIsCanControl(_canControl: boolean) {
        if (_canControl) {
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this); //截取触摸
        } else {
            input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this); //禁止截取触摸
        }

    }

    checkMachinegunExists(): void {
        const machineguns = this.Item_info.children.filter(child => child.name === 'Machinegun');
        if (machineguns.length > 0) {
            this.canMove = false;
            this.hasMachinegun = true;
        } else {
            this.canMove = true;
            this.hasMachinegun = false;
        }
    }

    update(deltaTime: number) {
        this.deltaTime = deltaTime;
        this.checkMachinegunExists();
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off('Dead', this.onContactToDot, this);
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

    }
}


