import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
import { Index, ItemType, } from '../Enum/Index';
import { Reward } from './Reward';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {

    
    @property
    ItemSpawnRate:number = 4;

    @property(Prefab)
    Item0Prefab:Prefab = null;

    @property(Prefab)
    Item1Prefab:Prefab = null;

    @property(Prefab)
    Item2Prefab:Prefab = null;

    @property(Prefab)
    Item3Prefab:Prefab = null;

    @property(Prefab)
    Item4Prefab:Prefab = null;

    @property(Prefab)
    Item5Prefab:Prefab = null;

    @property(Prefab)
    Item6Prefab:Prefab = null;

    @property(Prefab)
    Item7Prefab:Prefab = null;

    @property(Prefab)
    Item8Prefab:Prefab = null;

    @property(Prefab)
    Item9Prefab:Prefab = null;

    @property(Prefab)
    Item10Prefab:Prefab = null;

    @property
    ItemMax:number = 4;

    @property([Node])
    ItemArray:Node[]=[];

   // private _item:ItemTyPE[]=[];
      //  @property
   //  ItemType:ItemType = null;

   private static instance:Item = null;

   public static getInstance():Item{
       return this.instance;
   }

    start() {
        Item.instance = this; 
    }

    update(deltaTime: number) {
        
    }

    ItemGenerated(){
        //判断预制体数量是否小于4个再进行生成
        let count = this.ItemArray.length;
        if(count > this.ItemMax) {
            this.unschedule(this.ItemSystemSpawn);
        }else {
            this.schedule(this.ItemSystemSpawn,this.ItemSpawnRate);
        }
    }

    public onDestroy(): void {
        this.unschedule(this.ItemSystemSpawn);

        for(let r of this.ItemArray) {
            const reward = r.getComponent(Reward);
            reward.RewardClear();
        }   
        
    }

    ItemSystemSpawn(){
        const randomNumber = math.randomRangeInt(0,10);
        let Prefab = null;
        if (randomNumber==0){
            Prefab = this.Item0Prefab
        }else if(randomNumber==1){
            Prefab = this.Item1Prefab
        }else if(randomNumber==2){
            Prefab = this.Item2Prefab
        }else if(randomNumber==3){
            Prefab = this.Item3Prefab
        }else if(randomNumber==4){
            Prefab = this.Item4Prefab
        }else if(randomNumber==5){
            Prefab = this.Item5Prefab
        }else if(randomNumber==6){
            Prefab = this.Item6Prefab
        }else if(randomNumber==7){
            Prefab = this.Item7Prefab
        }else if(randomNumber==8){
            Prefab = this.Item8Prefab
        }else if(randomNumber==9){
            Prefab = this.Item9Prefab
        }else if(randomNumber==10){
            Prefab = this.Item10Prefab
        }
        this.ItemSpawn(Prefab);
    }
    
    ItemSpawn(Itemprefab:Prefab):Node{
       // this._item.push( math.randomRangeInt(0,10))
        const Item = instantiate(Itemprefab);
        this.node.addChild(Item);
        const randomX = math.randomRangeInt(-545,545);
        const randomY = math.randomRangeInt(-880,880);
        Item.setPosition(randomX,randomY,0);
        this.ItemArray.push(Item);
        return Item;

    }

    removeItem(n:Node) {
        const index = this.ItemArray.indexOf(n);
        if(index!==-1) {
            this.ItemArray.splice(index,1);
        }
    }


}
