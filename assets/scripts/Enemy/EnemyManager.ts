import { _decorator, Component, Event, find, instantiate, math, Node, Prefab, Vec2, Vec3 } from 'cc';
import { StartManager } from '../Scene/StartManager';
import { PlayerController } from '../Player/PlayerController';
import { Dot } from './Dot';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property
    DotSpawnRate: number = 0.25;

    @property(Prefab)
    DotPrefabs: Prefab[] = [];

    @property([Node])
    DotArray: Node[] = [];

    @property(Prefab)
    Caution: Prefab = null;

    public PlayerNode: Node;

    private static instance: EnemyManager = null;

    public static getInstance(): EnemyManager {
        return this.instance;
    }

    protected onLoad(): void {
        this.PlayerNode = find('Canvas/Bg/Player');
        if (!this.PlayerNode) {
            console.log('EnemyManager找不到 Player 节点');
        }
    }

    start() {
        EnemyManager.instance = this;
    }

    update(deltaTime: number) {

    }

    /**
     * 生成敌人
     *
     * @returns 无返回值
     */
    EnemyGenerated() {
        this.schedule(() => {
            const randomDotIndex = math.randomRangeInt(0, this.DotPrefabs.length);
            this.spawnDot(this.DotPrefabs[randomDotIndex]);
        }, this.DotSpawnRate); // 每0.3秒生成一个随机敌人

        const randomIndex = math.randomRangeInt(30, 41);

        this.schedule(() => {
            const cautionNode = instantiate(this.Caution);
            cautionNode.setPosition(0, 0, 0);
            this.node.addChild(cautionNode);
        }, 30, randomIndex, 5);
    }


    /**
     * 生成一个点并将其添加到场景中
     *
     * @param dotPrefab 点预制体
     * @returns 返回生成的点节点
     */
    spawnDot(dotPrefab: Prefab): Node {
        if (!this.PlayerNode) {
            console.error('PlayerNode 未初始化，无法生成 Dot');
            return null;
        }

        const dotNode = instantiate(dotPrefab);
        let randomPosition;
        let distanceToPlayer;
        do {
            randomPosition = this.getRandomPosition();
            if (!(randomPosition instanceof Vec2)) {
                console.error('randomPosition 不是 Vec2 类型');
                return null;
            }
            distanceToPlayer = Vec2.distance(randomPosition, new Vec2(this.PlayerNode.getPosition().x, this.PlayerNode.getPosition().y));
        } while (distanceToPlayer < 100);
        dotNode.setPosition(randomPosition.x, randomPosition.y, 0);
        this.node.addChild(dotNode);
        this.DotArray.push(dotNode);
        return dotNode;
    }

    /**
     * 获取一个随机位置
     *
     * @returns 随机位置的 Vec2 对象
     */
    getRandomPosition(): Vec2 {
        const randomX = math.randomRangeInt(-545, 545);
        const randomY = math.randomRangeInt(-880, 880);
        return new Vec2(randomX, randomY);
    }


    /**
     * 从点数组中移除指定的节点
     *
     * @param n 要移除的节点
     */
    removeDot(n: Node) {
        const index = this.DotArray.indexOf(n);
        if (index !== -1) {
            this.DotArray.splice(index, 1);
        }
    }

    stopEnemyGenerated() {
        this.unscheduleAllCallbacks();
    }



    onDestroy(): void {
        this.unscheduleAllCallbacks();
    }
}


