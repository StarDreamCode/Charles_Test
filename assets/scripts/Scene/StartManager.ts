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
    public BgAnimeback:Animation = null;

    @property(Animation)
    public GuiEnd:Animation = null;

    @property(Node)
    public Shop:Node = null;

    @property(Node)
    public PauseMask:Node = null;

    @property(Node)
    public Howto:Node = null;

    @property
    private Coin:number=0;

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
        this.PlayerController.node.on('get100Coin',this.addScorePlus,this)
    }
    out_of_range(){
        this.setCurState(GameState.GS_GAME);
    }
    Dead(){
        this.setCurState(GameState.GS_END);
    }

    onShopButtonClick(){
        this.Shop.active = true;
        this.PlayerController.disableControl();      
    }
    onShopButtonBackClick(){
        this.Shop.active = false;
        this.PlayerController.enableControl(); 
        this.setCurState(GameState.GS_START);
        
    }

    onPauseButtonClick(){
        director.pause();
        this.PauseMask.active=true;
        this.BGM.pause();
        this.PlayerController.disableControl();
        
    }
    onResumeButtionClick(){ 
        director.resume();
        this.PauseMask.active=false;
        this.BGM.play();
        this.PlayerController.enableControl();
    }
    onHomeButtonClick(){
        this.setCurState(GameState.GS_START);
        this.EnemyManager.onDestroy();
    }
    onRestartButtionClick(){
        this.EndUI.node.active = false;
        this.setCurState(GameState.GS_START);
    }
    onHowtoButtionClick(){
        this.Howto.active = true;
        
    }

    offHowtoButtionClick(){
        this.Howto.active = false;
    }

   
    setCurState(value:GameState){
        if(value==GameState.GS_START){
            this.BgAnimeback.play();
            this.PlayerController.node.setPosition(0,0,0);
            this.PlayerController.node.once('out_of_range',this.out_of_range,this);
            this.GUI.active=false;
            this.BGM.stop();
            this.PlayerController.enableControl();
            
            


        }else if(value==GameState.GS_GAME){
            this.startTimer();
            this.PlayerController.enableControl();     
            this.EnemyManager.EnemyGenerated();
            this.Item.ItemGenerated();
            this.GUI.active=true;
            this.BgAnime.play('BgAnime');
            this.BGM.play();
            this.PlayerController.node.once('Dead',this.Dead,this);
            this.ScoreUI.updateUI(0);
            
            
            
            
        }else if(value==GameState.GS_END){
            this.GameOverSum();
            this.GuiEnd.play();
            this.GUI.active=false;
            this.EnemyManager.stopEnemyGenerated();
            this.Item.stopItemGenerated();
            this.Item.clearItem();
            this.BGM.stop();
            this.PlayerController.disableControl();

        }
        
    }

    public addScore (scoreToAdd: number) {
        this.Coin += scoreToAdd;
    if (this.ScoreUI) {
        this.ScoreUI.updateUI(this.Coin);
    } else {
        console.error("ScoreUI is not initialized.");
    }
    }

    public addScorePlus () {
        this.Coin += 100;
    if (this.ScoreUI) {
        this.ScoreUI.updateUI(this.Coin);
    } else {
        console.error("ScoreUI is not initialized.");
    }
    }

    startTimer() {
        this._elapsedTime = 0;
        this._counting = true;
        this.schedule(this.updateTimeUI,1)
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
            hScoreInt = parseInt(hScore || "0",10);  //读取数据 10进制
        }
        
        if(this.Timer>hScoreInt) {
            localStorage.setItem("HighestScore",this.Timer.toString());//存储数据
        }


        
        let TotalCoin = localStorage.getItem("TotalCoin");
        let TotalCoinInt = 0 ;

        if(TotalCoin==null) {
            TotalCoinInt = parseInt(TotalCoin || "0",10);  //读取数据 10进制
        }
        
        TotalCoinInt += this.Coin;
        localStorage.setItem("TotalCoin",TotalCoinInt.toString());//存储数据
        

        this.EndUI.ShowGameOverUI(hScoreInt,this.Timer,TotalCoinInt);
    }
    
    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
       this.node.off('get100Coin',this.addScorePlus,this);
    }
}




