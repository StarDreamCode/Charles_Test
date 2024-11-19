import { _decorator, Component, Label, Node, Vec3 } from 'cc';
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

    @property(Node)
    CoinSprite: Node = null;

    public digitCount: number = 0;



    start() {  
        this.scheduleOnce(() => {
            this.setInitialCoinSpritePosition();
        }, 0);
    }

    ShowGameOverUI (highestScore: number , currentScore: number ,totalCoin:number  ) {
        this.PastBestScore.string = highestScore.toString();
        this.Menu_PastBestScore.string = highestScore.toString();
        this.CurScore.string = currentScore.toString();
        this.TotalCoin.string = totalCoin.toString();
        this.node.active = true;

         // 检测 TotalCoin 的位数
         this.digitCount = this.getDigitCount(totalCoin);
         console.log(`TotalCoin has ${this.digitCount} digits`);

    }

    update(deltaTime: number) {
        
    }

    private getDigitCount(number: number): number {
        if (number === 0) return 1; // 特殊情况处理
        return Math.floor(Math.log10(Math.abs(number))) + 1;
    }

    private setInitialCoinSpritePosition() {
       // 向左移动
       const newPosition = new Vec3(this.CoinSprite.position.x - this.digitCount*30, this.CoinSprite.position.y, this.CoinSprite.position.z);
       this.CoinSprite.setPosition(newPosition);
    }


}


