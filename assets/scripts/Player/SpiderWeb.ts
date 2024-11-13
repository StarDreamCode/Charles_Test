import { _decorator, Component, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpiderWeb')
export class SpiderWeb extends Component {
    public PlayerNode:Node;

    protected onLoad() {
        this.PlayerNode = find("Canvas/Bg/Player"); 
    }
    start() {
 
        this.scheduleOnce(function(){   
            this.node.destroy();
          },10);
        this.PlayerNode.once('Dead',this.WiperClear,this);


        
    }
    WiperClear(){
        this.scheduleOnce(function(){   
            this.node.destroy();
          },0.2);
    }

    update(deltaTime: number) {
        
    }
}


