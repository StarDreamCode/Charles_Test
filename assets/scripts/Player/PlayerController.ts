import { _decorator, Animation, AudioClip, AudioSource, Collider2D, Component, Contact2DType, EventTouch, FixedConstraint, Input, input, IPhysics2DContact, Node, Vec3 } from 'cc';
import { GameState } from '../Enum/Index';
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

    private _canControl:boolean = true;
 




    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE,this.onTouchMove,this)
        input.on(Input.EventType.TOUCH_END,this.onTouchEnd,this)
        
        
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

    onTouchEnd(){

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
        console.log('onBeginContact');
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
        input.off(Input.EventType.TOUCH_END,this.onTouchEnd,this)
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
          }

    }
}


