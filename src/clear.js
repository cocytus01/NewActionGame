//thirdScene.js
var ClearLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();
        //cc.audioEngine.playEffect(res.bell_mp3);
        //音楽再生エンジン
        audioEngine = cc.audioEngine;

        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.fanfare, false);
        }

        var gameoverBG_png = cc.Sprite.create(res.clear_png);
        gameoverBG_png.setPosition(size.width / 2, size.height / 2);
        this.addChild(gameoverBG_png);

        var coinlabel = cc.LabelTTF.create("MAXCoin:"+score+"×10="+score*10, "ＭＳ Ｐゴシック", 30);
        coinlabel.setPosition(size.width / 2, 200);
        this.addChild(coinlabel, 1);

        var hplabel = cc.LabelTTF.create("KeepHP:"+HP+"×100="+HP*100, "ＭＳ Ｐゴシック", 30);
        hplabel.setPosition(size.width / 2, 160);
        this.addChild(hplabel, 1);

        var stocklabel = cc.LabelTTF.create("KeepLIFE:"+LIFE+"×500="+LIFE*500, "ＭＳ Ｐゴシック", 30);
        stocklabel.setPosition(size.width / 2, 120);
        this.addChild(stocklabel, 1);

        var stick = cc.LabelTTF.create("---------------------", "ＭＳ Ｐゴシック", 30);
        stick.setPosition(size.width / 2, 100);
        this.addChild(stick, 1);

        var Total = score*10+HP*100+LIFE*500;

        var totallabel = cc.LabelTTF.create("TOTAL:"+Total, "ＭＳ Ｐゴシック", 30);
        totallabel.setPosition(size.width / 2, 80);
        this.addChild(totallabel, 1);

        if(Total < 1500){
          var hyokalabel = cc.LabelTTF.create("評価:不可", "ＭＳ Ｐゴシック", 30);
          hyokalabel.setPosition(size.width / 2, 50);
          this.addChild(hyokalabel, 1);
        }else if (Total >= 2000){
            var hyokalabel = cc.LabelTTF.create("評価:可", "ＭＳ Ｐゴシック", 30);
            hyokalabel.setPosition(size.width / 2, 50);
            this.addChild(hyokalabel, 1);

        }else if(Total >= 3000){
            var hyokalabel = cc.LabelTTF.create("評価:良", "ＭＳ Ｐゴシック", 30);
            hyokalabel.setPosition(size.width / 2, 50);
            this.addChild(hyokalabel, 1);
        }else if(Total >= 4000){
            var hyokalabel = cc.LabelTTF.create("評価:優", "ＭＳ Ｐゴシック", 30);
            hyokalabel.setPosition(size.width / 2, 50);
            this.addChild(hyokalabel, 1);
        }else if(Total >= 5000){
            var hyokalabel = cc.LabelTTF.create("評価:秀", "ＭＳ Ｐゴシック", 30);
            hyokalabel.setPosition(size.width / 2, 50);
            this.addChild(hyokalabel, 1);
        }

        cc.eventManager.addListener({
           event: cc.EventListener.KEYBOARD,
           //キー入力したとき
           onKeyPressed: function(keyCode, event) {
                  console.log(keyCode);

              if (keyCode == 13) {
                if (audioEngine.isMusicPlaying()) {
                  audioEngine.stopMusic();
                }
                  audioEngine.playEffect(res.push_se);
                  s = cc.TransitionFade.create(2, new MyScene());
                  cc.director.runScene(s);
              }
           },//.bind(this),
           //キーを離したとき
           onKeyReleased: function(keyCode, event){
           }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
          }, this);
          return true;
        },
    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {

      //cc.director.runScene(new MyScene());
    },
});


var ClearScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        // 背景レイヤーをその場で作る
        var backgroundLayer = new cc.LayerColor(new cc.Color(0, 0, 0, 200));
        this.addChild(backgroundLayer);

        var layer3 = new ClearLayer();
        this.addChild(layer3);
    }
});
