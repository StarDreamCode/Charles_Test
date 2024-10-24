import { _decorator, Animation, AudioClip, AudioSource, Collider2D, Component, Contact2DType, EventTouch, FixedConstraint, Input, input, IPhysics2DContact, Node, Vec3 } from 'cc';
import { GameState, ItemType } from '../Enum/Index';
import { Item } from '../Item/Item';
import { Reward } from '../Item/Reward';
import { EnemyManager } from '../Enemy/EnemyManager';
const { ccclass, property } = _decorator;


@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Node)
    Body:Node = null;

    @property(Animation)
    Emotion_Woops:Animation = null;

    @property(Animation)
    Emotion_Avoid:Animation = null;

    @property(AudioSource)
    Emotion_Woops_Audio:AudioSource = null;

    @property
    PlayerSpeed:number = 1;

    public _canControl:boolean = true;

    private static instance:PlayerController;

    public static getinstance():PlayerController{
        return this.instance;
    }  
 
    protected onLoad(): void {
        PlayerController.instance = this;
        input.on(Input.EventType.TOUCH_MOVE,this.onTouchMove,this)
    }

    
    onTouchMove(event:EventTouch){

        const p = this.node.position;
        
        let targetposion = new Vec3(p.x+event.getDeltaX()*this.PlayerSpeed,p.y+event.getDeltaY()*this.PlayerSpeed,p.z);

        let radian = Math.atan2(targetposion.y-p.y,targetposion.x-p.x);

        let angle = radian*180/(Math.PI);

        this.node.angle = angle-90;
      
        if(targetposion.x<-10||targetposion.x>10||targetposion.y<-10||targetposion.y>10){
            this.node.emit('out_of_range',event) 
        }
        if(targetposion.x<-550){
            targetposion.x=-550
        }
        if(targetposion.x>550){
            targetposion.x=550
        }
        if(targetposion.y<-877){
            targetposion.y=-877
        }
        if(targetposion.y>877){
            targetposion.y=877
        }  
        this.node.setPosition(targetposion)
        
    }

     
    start() {
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
          }
          

    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次

        const reward = otherCollider.getComponent(Reward)
        if(reward){
            switch(reward.RewardType){
                case ItemType.BlueEnergy:{
                    this.getBlueEnergy();
                    break;
                }
                case ItemType.Bomb:{
                    this.getBomb();
                     break;
                }      
                case ItemType.RedEnergy:{
                    this.getRedEnergy();
                    break;
                }
                case ItemType.FlyingSaw:{
                     this.getFlyingSaw();
                     break; 
                }    
                case ItemType.SpiderWeb:{
                    this.getSpiderWeb();
                    break;
                }
                case ItemType.Shield:{
                    this.getShield();
                    break;
                }          
                case ItemType.Wiper:{
                    this.getWiper();
                    break;
                }         
                case ItemType.Turret:{
                    this.getTurret();
                    break; 
                }        
                case ItemType.EatingMan:{
                    this.getEatingMan();
                    break; 
                }                
                case ItemType.Fire:{
                    this.getFire();
                    break; 
                }
                case ItemType.Coin:{
                    this.getCoin();
                    break;           
                }
                   
                     
                    
            }
        }else{
            this.onContactToDot();
        }
       
        

    }
    getBlueEnergy(){
       // this.node.getComponent(Animation).play('BlueEnergy');
        console.log("getBlueEnergy");
    }
    getBomb(){
        console.log("getBomb");
    }
    getRedEnergy(){
        console.log("getRedEneygy");
    }
    getFlyingSaw(){
        console.log("getFlyingSaw");
    }
    getSpiderWeb(){
        console.log("getSpiderWeb");
        EnemyManager.getInstance().ongetSpiderWeb();
    }
    getShield(){
        console.log("getShield");
    }
    getWiper(){
        console.log("getWiper");
    }
    getTurret(){
        console.log("getTurret");
    }
    getEatingMan(){
        console.log("getEatingMan");
        EnemyManager.getInstance().ongetEatingMan();
    }
    getFire(){
        console.log("getFire");
    }
    getCoin(){
        console.log("getFire");
    }

   


    onContactToDot(){
        const p = this.node.position;
        this.Emotion_Woops.node.setPosition(p.x+20,p.y+20,p.z);
        this.Emotion_Woops.play();
        this.Emotion_Woops_Audio.play();
        this.node.emit('Dead');
    }

    onPreSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次将要处理碰撞体接触逻辑时被调用
        console.log('onPreSolve');
        const p = this.node.position;
        this.Emotion_Avoid.node.setPosition(p.x+40,p.y+40,p.z);
        this.Emotion_Avoid.play();
        
    }

    disableControl(){
        console.log('无法控制');
        this._canControl = false;
    }

    enableControl(){
        this._canControl = true;
    }

    public setIsCanControl(_canControl:boolean){
        if(_canControl){
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove,this); //截取触摸
        } else {
            input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove,this); //禁止截取触摸
        }
 
    }

    update(deltaTime: number) {
        
    
              
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE,this.onTouchMove,this)
   
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
          }

    }
}


