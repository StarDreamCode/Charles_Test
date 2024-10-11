import { _decorator, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Index')
export class Index extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}

//游戏状态
export enum GameState {
    GS_START,
    GS_GAME,
    GS_END
}

export enum DotType{
    Dot_1,
    Dot_2,
    Dot_3,
    Dot_4,
    Dot_5,
    Dot_6,

}
export enum ItemTyPE{
    
    BlueEnergy,
    Bomb,
    RedEnergy,
    FlyingSaw,
    SpiderWeb,
    Shield,
    Wiper,
    Turret,
    EatingMan,
    Fire,
    Coin,

}






