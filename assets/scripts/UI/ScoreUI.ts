import { _decorator, Component, Label, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
   
    @property(Label)
    Coin:Label= null;

    public digitCount: number = 0;

    start() {
        this.scheduleOnce(() => {
            this.setInitialCoinSpritePosition();
        }, 0);
    }

    updateUI(count:number){
        this.Coin.string=count.toString();

        // 检测的位数
        this.digitCount = this.getDigitCount(count);
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
        const newPosition = new Vec3(this.node.position.x - this.digitCount*30, this.node.position.y, this.node.position.z);
        this.node.setPosition(newPosition);
     }

}


