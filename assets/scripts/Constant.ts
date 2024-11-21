import { _decorator, Component, Node, Rect, math } from 'cc';
import { StartManager } from './Scene/StartManager';
const { ccclass, property } = _decorator;

@ccclass('Constant')
export class Constant {
   static PlayerBound: Rect = new Rect(-560, -900, 1120, 1800);  // 玩家活动范围
   static EnemyBound: Rect = new Rect(-560, -900, 1120, 1800);   // 敌人产生范围
   static EnemyToPlayerDis = 300.0;
   static StartManager:StartManager = null;
   static playerNode:Node = null;
   static PI = 3.14159;
 
   static CollisionTag = {
        PLAYER : 0,
        ENEMY : 1,
        ITEM_3 : 103,
        ITEM_4 : 104,
        ITEM_7 : 107,
        WEAPON_3 : 203,
        WEAPON_4 : 204,
        WEAPON_7 : 207,
   };

   static EnemyColor = {
        ENEMY_1 : math.color(211, 187, 255, 255),
        ENEMY_2 : math.color(195, 131, 188, 255),
        ENEMY_3 : math.color(68, 138, 202, 255),
        ENEMY_4 : math.color(153, 211, 80, 255),
        ENEMY_5 : math.color(160, 145, 138, 255),
        ENEMY_6 : math.color(234, 95, 216, 255),
   };
}

