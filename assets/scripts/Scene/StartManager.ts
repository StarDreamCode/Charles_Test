import { _decorator, Animation, AudioSource, Component,  director,  Event,  game,  Game,  input,  Input,  instantiate,  Label,  math,  Node, Prefab, Sprite, Touch } from 'cc';
import { PlayerController } from '../Player/PlayerController';
import { GameState } from '../Enum/Index';
import { EnemyManager } from '../Enemy/EnemyManager';
import { ScoreUI } from '../UI/ScoreUI';
import { Item } from '../Item/Item';
import { GUI } from '../UI/GUI';
import { AudioMgr } from '../Audio/AudioMgr';
import { EndUI } from '../UI/EndUI';
const { ccclass, property } = _decorator;

@ccclass('StartManager')
export class StartManager extends Component {
  

    @property(PlayerController)
    public PlayerController:PlayerController = null;

    @property(EnemyManager)
    public EnemyManager:EnemyManager = null;

    @property(Item)
    public Item:Item = null;

    @property(AudioSource)
    public BGM:AudioSource = null;

    @property(Node)
    public GUI:Node = null;

    @property(Animation)
    public BgAnime:Animation = null;

    @property(Animation)
    public GuiEnd:Animation = null;

    @property(Node)
    public Shop:Node = null;

    @property(Node)
    public PauseMask:Node = null;

    @property
    private score:number=0;

    @property(ScoreUI)
    ScoreUI:ScoreUI= null;

    @property(EndUI)
    EndUI:EndUI = null;

    @property(Label)
    Time:Label= null;

    
    //用于计分
    private static instance:StartManager;

    public static getinstance():StartManager{
        return this.instance;
    }  

    public Timer = 0;

    private _elapsedTime = 0;

    private _counting:boolean = false;
    

    protected onLoad(): void {
        StartManager.instance = this;
    }   
   

    start() {
        this.setCurState(GameState.GS_START); 
        
        this.PlayerController.node.once('out_of_range',this.out_of_range,this);
        this.PlayerController.node.once('Dead',this.Dead,this);
       


    }
    out_of_range(){
        this.setCurState(GameState.GS_GAME);
    }

    Dead(){
        this.setCurState(GameState.GS_END);
    }

    onShopButtonClick(){
        console.log("按到了");
        this.Shop.active = true;
        
    }
    onPauseButtonClick(){
        console.log('暂停游戏');
    //    director.pause();
        game.pause();
        this.PauseMask.active=true;
        this.PlayerController.disableControl();
        
    }
    onResumeButtionClick(){
   //     director.resume();
        game.resume();
        this.PauseMask.active=false;
        this.PlayerController.enableControl();
    }
    onHomeButtionClick(){
        this.setCurState(GameState.GS_START);
    }
    onRestartButtionClick(){
        this.setCurState(GameState.GS_START);
    }
    onHowtoButtionClick(){

    }

   
    setCurState(value:GameState){
        if(value==GameState.GS_START){
            this.GUI.active=false;
            this.BGM.stop();
            
            


        }else if(value==GameState.GS_GAME){
            this.startTimer();
            this.EnemyManager.EnemyGenerated();
            this.Item.ItemGenerated();
            this.GUI.active=true;
            this.BgAnime.play('BgAnime');
            this.BGM.play();
            
            
        }else if(value==GameState.GS_END){
            this.GameOverSum();
          //  this.PlayerController.node.active = false;
            this.GuiEnd.play();
            this.EnemyManager.onDestroy();
            this.Item.onDestroy();   
            this.BGM.stop();
            this.PlayerController.destroy();
        }
        
    }

    public addScore (s:number) {
        this.score+=s;
        this.ScoreUI.updateUI(this.score);
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

    GameOverSum(){
        let hScore = localStorage.getItem("HighestScore");
        let hScoreInt = 0 ;

        if(hScore!==null) {
            hScoreInt = parseInt(hScore,10);  //读取数据 10进制
        }
        
        if(this.Timer>hScoreInt) {
            localStorage.setItem("HighestScore",this.Timer.toString());//存储数据
        }

        let TotalCoin = localStorage.getItem("TotalCoin");
        let TotalCoinInt = 0 ;

        if(TotalCoin==null) {
            TotalCoinInt = parseInt(TotalCoin,10);  //读取数据 10进制
        }
        
        if(this.score>TotalCoinInt) {
            this.score += TotalCoinInt;
            localStorage.setItem("TotalCoin",this.score.toString());//存储数据
        }

        this.EndUI.ShowGameOverUI(hScoreInt,this.Timer,this.score);
    }
    
    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
       
    }
}




