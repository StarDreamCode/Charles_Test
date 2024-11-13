import { _decorator, Component, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fire')

export class Fire extends Component {

    public PlayerNode:Node;
    protected onLoad(): void {
        this.PlayerNode = find('Canvas/Bg/Player');
    }
    start() {
        this.scheduleOnce(function(){   
            this.node.destroy();
          },10);
          this.PlayerNode.once('Dead',this.FireClear,this);
    }

    FireClear() {
        this.scheduleOnce(function(){   
            this.node.destroy();
          },0.2);
    }

    update(deltaTime: number) {
        
    }
}

