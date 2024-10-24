import { _decorator, Component, find, math, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Machinegun_bullet')
export class Machinegun_bullet extends Component {
    @property
    speed:number = 400;

    public PlayerNode:Node;

    protected onLoad(): void {
        this.PlayerNode=find("Canvas/Bg/Player");
        
    }

    start() {
        let PlayerAngle = this.PlayerNode.getWorldRotation();
        this.node.rotation = PlayerAngle;  
    }

    update(deltaTime: number) {
        
        var angle = this.node.angle;
        var direction = new Vec2(Math.cos(angle),Math.sin(angle)).normalize();
        var deltaPos = direction.multiplyScalar(this.speed*deltaTime);
        this.node.position = this.node.position.add(new Vec3(deltaPos.x,deltaPos.y,0));

        var p = this.node.position;
        if(p.x>2000||p.x<-2000||p.y>4000||p.y<-4000){
            this.node.destroy();
        }
   
      
    }
}


