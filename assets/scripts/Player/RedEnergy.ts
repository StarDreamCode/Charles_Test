import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RedEnergy')
export class RedEnergy extends Component {
    start() {

        this.scheduleOnce(function(){   
            this.node.destroy();
          },10);
    }


    update(deltaTime: number) {
        
    }
}


