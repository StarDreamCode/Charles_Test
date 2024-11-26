import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
import { Index, ItemType, } from '../Enum/Index';
import { Reward } from './Reward';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {


    @property
    ItemSpawnRate: number = 4;

    @property(Prefab)
    ItemPrefabs: Prefab[] = [];

    @property
    ItemMax: number = 4;

    @property([Node])
    ItemArray: Node[] = [];

    // private _item:ItemTyPE[]=[];
    //  @property
    //  ItemType:ItemType = null;

    private static instance: Item = null;

    public static getInstance(): Item {
        return this.instance;
    }

    start() {
        Item.instance = this;
    }

    update(deltaTime: number) {

    }

    ItemGenerated() {
        this.schedule(this.ItemSystemSpawn, this.ItemSpawnRate);
    }

    ItemSystemSpawn() {
        try {
            //判断预制体数量是否小于4个再进行生成
            let count = this.ItemArray.length;
            if (count >= this.ItemMax) {
                return;
            }
            if (this.ItemPrefabs.length === 0) {
                console.error("No item prefabs available.");
                return;
            }
            const randomItemIndex = math.randomRangeInt(0, this.ItemPrefabs.length - 1);
            this.ItemSpawn(this.ItemPrefabs[randomItemIndex]);
        } catch (error) {
            console.error("Error in ItemSystemSpawn:", error);
        }
    }

    /**
     * 根据给定的预制件生成一个物品节点，并将其添加到当前节点的子节点列表中。
     *
     * @param Itemprefab 预制件 - 要生成的物品预制件。
     * @returns 返回生成的物品节点。
     */


    ItemSpawn(Itemprefab: Prefab): Node {
        // this._item.push( math.randomRangeInt(0,10))
        const Item = instantiate(Itemprefab);
        this.node.addChild(Item);
        const randomX = math.randomRangeInt(-545, 545);
        const randomY = math.randomRangeInt(-880, 880);
        Item.setPosition(randomX, randomY, 0);
        this.ItemArray.push(Item);
        return Item;

    }

    /**
     * 从数组中移除指定的节点
     *
     * @param n 要移除的节点
     */
    removeItem(n: Node) {
        const index = this.ItemArray.indexOf(n);
        if (index !== -1) {
            this.ItemArray.splice(index, 1);
        }
    }

    clearItem() {
        for (let r of this.ItemArray) {
            const reward = r.getComponent(Reward);
            reward.RewardClear();
        }
    }

    stopItemGenerated() {
        this.unschedule(this.ItemSystemSpawn);
    }

    public onDestroy(): void {
        this.unscheduleAllCallbacks();
        for (let item of this.ItemArray) {
            item.destroy();
        }
        this.ItemArray.length = 0;

    }


}
