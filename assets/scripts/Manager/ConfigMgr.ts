import { _decorator } from "cc";
import { Singleton } from "../Base/Singleton";
const { ccclass, property } = _decorator;

@ccclass("ConfigMgr")
export class ConfigMgr extends Singleton {
  //懒汉单例
  public static get ins() {
    return super.GetInstance<ConfigMgr>();
  }

  /**
   *存所有Json配置表的对象
   *不直接用，给addTable方法用
   * @private
   * @type {*}
   * @memberof ConfigMgr
   */
  private _dataTables: any = {};

  /**
   *添加Json配置表的方法
   *不直接用，给ResMgr用
   * @param {string} tableName 表名作键
   * @param {*} tableContent 一张表的Json对象
   * @return {*}
   * @memberof ConfigMgr
   */
  addTable(tableName: string, tableContent: any) {
    if (this._dataTables[tableName]) {
      return;
    }

    //用于存放单个Json配置表对象
    let dict = {};
    let num = tableContent.data.length;
    //遍历Json对象数组
    for (let i = 0; i < num; i++) {
      //获取每个Json元素（每行）
      let data = tableContent.data[i];
      //存放每行的Json对象（id做键，Json对象作值）
      dict[Number(data.id)] = data; //通过id保存
    }

    this._dataTables[tableName] = dict;
  }

  /**
   * 根据表名获取单个Json配置表对象
   * @param {string} tableName  表名
   * @returns {object} 单个Json配置表对象
   */
  getTable(tableName: string) {
    return this._dataTables[tableName];
  }

  /**
   * 根据表名和id获取一行Json对象
   * @param {string} tableName 表名
   * @param {number} key 一行Json对象的id
   * @returns {Object} 一行Json对象
   */
  queryOne(tableName: string, key: number) {
    var table = this.getTable(tableName);
    if (!table) {
      return null;
    }

    console.log("queryOne==>>" + tableName + "," + key);

    return JSON.parse(table[key]);
  }
}
