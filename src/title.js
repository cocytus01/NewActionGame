//myScene.js
var MyLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.director.getWinSize();

        LIFE = 3;
        HP = 5;
        score = 0;
        //音楽再生エンジン
        audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
          audioEngine.playMusic(res.bgm6, true);
        }


        var Title_png = cc.Sprite.create(res.howtoplay_png);

        Title_png.setPosition(size.width / 2, size.height / 2);
        this.addChild(Title_png);
        //add code
         //タップイベントリスナーを登録する

         cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            //キー入力したとき
            onKeyPressed: function(keyCode, event) {
                   console.log(keyCode);

               if (keyCode == 13) {
                   audioEngine.playEffect(res.push_se);
                   s = cc.TransitionFade.create(2, new HowtoScene());
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
      //bgmの再生をとめる
        /*if (audioEngine.isMusicPlaying()) {
          audioEngine.stopMusic();
        }*/
        /*audioEngine.playEffect(res.push_se);
        // 次のシーンに切り替える
        s = cc.TransitionFade.create(2, new HowtoScene());
        cc.director.runScene(s);*/
        //cc.director.runScene(new HowtoScene());
    },
});

var MyScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
    }
});
