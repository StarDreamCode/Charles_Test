import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {


    start() {

        director.preloadScene("Start", function () {
            console.log('Start Scene is preloaded');
        });

        director.loadScene("Start");


    }

    update(deltaTime: number) {

    }



}


