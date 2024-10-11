import { _decorator, Animation, AudioSource, Component,  director,  Event,  input,  Input,  instantiate,  Label,  math,  Node, Prefab, Sprite, Touch } from 'cc';
import { PlayerController } from '../Player/PlayerController';
import { GameState } from '../Enum/Index';
import { EnemyManager } from '../Enemy/EnemyManager';
import { ScoreUI } from '../UI/ScoreUI';
import { GUI } from '../UI/GUI';
const { ccclass, property } = _decorator;

@ccclass('StartManager')
export class StartManager extends Component {
  

    @property(PlayerController)
    public PlayerController:PlayerController = null;

    @property(EnemyManager)
    public EnemyManager:EnemyManager = null;

    @property(AudioSource)
    public BGM:AudioSource = null;

    @property(Node)
    public GUI:Node = null;

    @property(Animation)
    public BgAnime:Animation = null;

    @property(Node)
    public Shop:Node = null;

    @property(Node)
    public PauseMask:Node = null;
    
    @property
    private score:number=0;

    @property(ScoreUI)
    ScoreUI:ScoreUI= null;

    private static instance:StartManager;

    public static getinstance():StartManager{
        return this.instance;
    }

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
        director.pause();
        this.PauseMask.active=true;
        this.PlayerController.disableControl();
        
    }
    onResumeButtionClick(){
        director.resume();
        this.PauseMask.active=false;
        this.PlayerController.enableControl();
    }
    

   
    setCurState(value:GameState){
        if(value==GameState.GS_START){
            this.GUI.active=false;
            this.BGM.stop();
            
            


        }else if(value==GameState.GS_GAME){
            this.EnemyManager.EnemyGenerated();
            this.GUI.active=true;
            this.BgAnime.play('BgAnime');
            this.BGM.play();
            
            
        }else if(value==GameState.GS_END){
            
            
        }
        
    }

    public addScore(s:number){
        this.score+=s;
        this.ScoreUI.updateUI(this.score);

    }
    
    protected onDestroy(): void {
        
    }
    update(deltaTime: number) {
        
    }
}




