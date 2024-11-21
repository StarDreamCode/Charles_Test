import { _decorator, Component, Node, view, Canvas, winSize } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FullScreenAdapter')
export class FullScreenAdapter extends Component {
    onLoad() {
        // 设置窗口大小变化时的回调
        if (view) {
            view.setResizeCallback(() => this.screenAdapter());
        }
        this.screenAdapter();
    }

    screenAdapter() {
        if (!Canvas || !Canvas.instance) {
            console.error('Canvas instance is not available');
            return;
        }

        try {
            if (!winSize || !Canvas.instance.designResolution) {
                console.error('winSize or designResolution is not available');
                return;
            }

            // 计算当前屏幕和设计稿的宽高比
            const currentScreenRatio = winSize.width / winSize.height;
            const designScreenRatio = Canvas.instance.designResolution.width / Canvas.instance.designResolution.height;

            console.log(`Current Screen Ratio: ${currentScreenRatio}, Design Screen Ratio: ${designScreenRatio}`);

            if (currentScreenRatio <= 1) {
                // 竖屏模式
                if (currentScreenRatio <= designScreenRatio) {
                    this.setFit(false, true);
                    console.log('Setting fitWidth for portrait mode');
                } else {
                    this.setFit(true, false);
                    console.log('Setting fitHeight for portrait mode');
                }
            } else {
                // 横屏模式
                this.setFit(true, false);
                console.log('Setting fitHeight for landscape mode');
            }
        } catch (error) {
            console.error('Error in screenAdapter:', error);
        }
    }

    setFit(fitHeight: boolean, fitWidth: boolean) {
        if (Canvas && Canvas.instance) {
            Canvas.instance.fitHeight = fitHeight;
            Canvas.instance.fitWidth = fitWidth;
            console.log(`Set fitHeight: ${fitHeight}, fitWidth: ${fitWidth}`);
        }
    }
}