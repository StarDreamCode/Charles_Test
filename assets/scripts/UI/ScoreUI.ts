import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
    @property(Label)
    Score:Label= null;

    updateUI(count:number){
        this.Score.string=count.toString();
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


