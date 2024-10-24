import { _decorator, Component, Label, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
   
    @property(Label)
    Coin:Label= null;

    //private _CurPos = new Vec3();

    updateUI(count:number){
        this.Coin.string=count.toString();
       /* var i=count.toString().length;
        const CurPos = this.node.position;
        this.node.setPosition(CurPos.x-i*40,CurPos.y,CurPos.z);*/
      
        
    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }
}


