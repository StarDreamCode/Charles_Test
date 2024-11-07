import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EndUI')
export class EndUI extends Component {
    @property(Label)
    PastBestScore:Label= null;

    @property(Label)
    CurScore:Label= null;

    @property(Label)
    TotalCoin:Label= null;

   



    @property(Label)
    Menu_PastBestScore:Label= null;



    start() {
        
    }

    ShowGameOverUI (highestScore: number , CurrentScore: number ,totalCoin:number  ) {
        this.PastBestScore.string = highestScore.toString();
        this.Menu_PastBestScore.string = highestScore.toString();
        this.CurScore.string = CurrentScore.toString();
        this.TotalCoin.string = totalCoin.toString();
        
        
        this.node.active = true;

    }

    update(deltaTime: number) {
        
    }
}


