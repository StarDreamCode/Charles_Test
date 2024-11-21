import { _decorator, Component, Node, SpriteFrame, math, Sprite } from 'cc';
import { PoolManager } from '../PoolManager';
const { ccclass, property } = _decorator;

@ccclass('SplitDeath')
export class SplitDeath extends Component {
    @property([SpriteFrame])
    sprites: SpriteFrame[] = new Array<SpriteFrame>;

    onLoad() {
        let sp_idx = math.randomRangeInt(0, this.sprites.length);
        let comp = this.node.getComponent(Sprite)
        comp.spriteFrame = this.sprites[sp_idx];
    }

    onEnable() {
        this.scheduleOnce(this.putback, 2);
    }

    putback() {
        this.node.active = false;
        PoolManager.instance().putNode(this.node);
    }
}


