import { _decorator, Component, Event, find, instantiate, math, Node, Prefab } from 'cc';
import { StartManager } from '../Scene/StartManager';
import { PlayerController } from '../Player/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property
    speed:number = 5;

    @property
    Dot1SpawnRate:number = 1;
    @property
    Dot2SpawnRate:number = 2;
    @property
    Dot3SpawnRate:number = 3;
    @property
    Dot4SpawnRate:number = 4;
    @property
    Dot5SpawnRate:number = 5;
    @property
    Dot6SpawnRate:number = 6;
    

    @property(Prefab)
    Dot1Prefab:Prefab = null;
    @property(Prefab)
    Dot2Prefab:Prefab = null;
    @property(Prefab)
    Dot3Prefab:Prefab = null;
    @property(Prefab)
    Dot4Prefab:Prefab = null;
    @property(Prefab)
    Dot5Prefab:Prefab = null;
    @property(Prefab)
    Dot6Prefab:Prefab = null;

    

    start() {  
        
    }

    update(deltaTime: number) {
        
    }

    EnemyGenerated(){
        this.schedule(this.Dot1Spawn,this.Dot1SpawnRate);
        this.schedule(this.Dot2Spawn,this.Dot2SpawnRate);
        this.schedule(this.Dot3Spawn,this.Dot3SpawnRate);
        this.schedule(this.Dot4Spawn,this.Dot4SpawnRate);
        this.schedule(this.Dot5Spawn,this.Dot5SpawnRate);
        this.schedule(this.Dot6Spawn,this.Dot6SpawnRate);     
    }

    onDestroy(): void {
        this.unschedule(this.Dot1Spawn);
        this.unschedule(this.Dot2Spawn);
        this.unschedule(this.Dot3Spawn);
        this.unschedule(this.Dot4Spawn);
        this.unschedule(this.Dot5Spawn);
        this.unschedule(this.Dot6Spawn);
    }

    Dot1Spawn(){
        this.DotSpawn(this.Dot1Prefab)
    }
    Dot2Spawn(){
        this.DotSpawn(this.Dot2Prefab)
    }
    Dot3Spawn(){
        this.DotSpawn(this.Dot3Prefab)
    }
    Dot4Spawn(){
        this.DotSpawn(this.Dot4Prefab)
    }
    Dot5Spawn(){
        this.DotSpawn(this.Dot5Prefab)
    }
    Dot6Spawn(){
        this.DotSpawn(this.Dot6Prefab)
    }
  
    DotSpawn(Dotprefab:Prefab){
        const Dot = instantiate(Dotprefab);
        this.node.addChild(Dot);
        const randomX = math.randomRangeInt(-545,545);
        const randomY = math.randomRangeInt(-880,880);
        Dot.setPosition(randomX,randomY,0);

    }

    
}


