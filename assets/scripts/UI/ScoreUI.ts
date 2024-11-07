import { _decorator, Component, Label, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
   
    @property(Label)
    Coin:Label= null;

    start() {
        
    }

    updateUI(count:number){
        this.Coin.string=count.toString();
    }

    update(deltaTime: number) {
        
    }

}


