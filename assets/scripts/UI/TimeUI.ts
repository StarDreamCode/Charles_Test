/*import { _decorator, Component, Label, mat4, Node } from 'cc';
import { StartManager } from '../Scene/StartManager';
const { ccclass, property } = _decorator;

@ccclass('TimeUI')
export class TimeUI extends Component {

    @property(Label)
    Time:Label= null;

    public Timer = 0;

    private _elapsedTime = 0;

    private _counting:boolean = false;
    

    start() {
        this.startTimer();
    }

    startTimer() {
        this._counting = true;

        this.schedule(this.updateTimeUI)
    }

    updateTimeUI(dt: number) {
        if(this._counting){
            this._elapsedTime += dt ;
            this.Timer = Math.floor(this._elapsedTime);
            this.Time.string =this.Timer.toString();
        }
    }
   

    stopTimer() {
        // 设置计时器为停止状态
        this._counting = false;
        // 取消schedule计时器
        this.unschedule(this.updateTimeUI);
    }

    update(deltaTime: number) {
  
    }
}


*/