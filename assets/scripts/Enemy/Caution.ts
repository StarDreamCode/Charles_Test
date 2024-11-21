import { _decorator, Component, find, instantiate, math, Node, Prefab, tween, Vec2 } from 'cc';
import { Dot } from './Dot';
import { Constant } from '../Constant';
import { PoolManager } from '../PoolManager';
import { EnemyManager } from './EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('Caution')
export class Caution extends Component {

    @property(Node)
    sprite: Node = null;

    @property(Prefab)
    enemyPrefabs: Prefab[] = [];

    public PlayerNode: Node;

    public EnemyManager: Node;

    isdestroyed: boolean = false;

    public genEnemy = 2;

    public Gameover: boolean = false;

    seq = 0;

    protected onLoad(): void {
        this.PlayerNode = find('Canvas/Bg/Player');
        this.EnemyManager = find('Canvas/Bg/EnemyManager');


    }


    start() {
        this.genEnemy = math.randomRangeInt(1, 3);
        this.play();
        this.PlayerNode.once('Dead', this.CautionClear, this);
    }

    CautionClear() {
        if (this.node) {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.2);
            this.isdestroyed = true;
        }
        this.Gameover = true;
        this.unscheduleAllCallbacks();
    }


    play() {
        if (this.Gameover) return;
        tween(this.node).delay(1.5).call(() => {
            this.sprite.active = false;
            // gen enemy
            if (this.genEnemy == 1) {
                this.schedule(() => this.genEnemy_type_1(), 0.15, 30);
            } else if (this.genEnemy == 2) {
                this.schedule(() => this.genEnemy_type_2(), 0.15, 30);
            }
        }).delay(3.5).call(() => {
            this.unscheduleAllCallbacks();
            this.node.destroy();
        }).start();
        this.isdestroyed = true;

    }


    genEnemy_type_1() {
        if (this.Gameover) return;
        for (let i = 0; i < 15; i++) {
            if (!this.enemyPrefabs || this.enemyPrefabs.length === 0) {
                console.error('No enemy prefabs available');
                return;
            }

            const randomIndex = Math.floor(Math.random() * this.enemyPrefabs.length);
            const enemyPrefab = this.enemyPrefabs[randomIndex];
            // 生成预制体
            const enemyNode = instantiate(enemyPrefab);
            enemyNode.setPosition(this.node.position);
            enemyNode.setRotationFromEuler(0, 0, i * 24);

            const enemyScript = enemyNode.getComponent(Dot);
            if (enemyScript) {
                enemyScript.init(1);
            }
            this.EnemyManager.addChild(enemyNode);
            EnemyManager.getInstance().DotArray.push(enemyNode);

        }
    }

    genEnemy_type_2() {
        if (this.Gameover) return;
        if (!this.enemyPrefabs || this.enemyPrefabs.length === 0) {
            console.error('No enemy prefabs available');
            return;
        }

        for (let i = 0; i < 15; i++) {
            const randomIndex = Math.floor(Math.random() * this.enemyPrefabs.length);
            const enemyPrefab = this.enemyPrefabs[randomIndex];
            // 生成预制体
            const enemyNode = instantiate(enemyPrefab);
            enemyNode.setPosition(this.node.position);
            enemyNode.setRotationFromEuler(0, 0, i * 24);

            const enemyScript = enemyNode.getComponent(Dot);

            let dir = new Vec2(0, -1);
            dir = dir.rotate(Constant.PI * 24 * i / 180 + Constant.PI * 3 * this.seq / 180);
            enemyScript.setdirection(dir);
            if (enemyScript) {
                enemyScript.init(2);
            }
            this.EnemyManager.addChild(enemyNode);
            EnemyManager.getInstance().DotArray.push(enemyNode);

        }
        this.seq++
    }


    update(deltaTime: number) {

    }

    protected onDestroy(): void {
        this.PlayerNode.off('Dead', this.CautionClear, this);
        this.unscheduleAllCallbacks();
    }
}


