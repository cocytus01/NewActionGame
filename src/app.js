var space;
var onGround = false;
var score = 0 ;
var shapeArray = [];
var objectArray = [];
var HP = 5;
var LIFE = 3;
var death_se = true;
if (typeof SpriteTag == "undefined") {
   var SpriteTag = {};
   SpriteTag.terrain = 1;
   SpriteTag.bomb = 2;
   SpriteTag.koban = 4;
   SpriteTag.food = 8;
   SpriteTag.monster1 = 16;
   SpriteTag.monster2 = 32;
   SpriteTag.player = 128;
   SpriteTag.goal = 64;
};

var callbacks = [];
var PlayerStar_X = 140;



var gameLayer;
var gameScene = cc.Scene.extend({
   onEnter: function() {
      this._super();

      audioEngine = cc.audioEngine;

      var backgroundLayer = cc.LayerGradient.create(cc.color(0xdf, 0x9f, 0x83, 255), cc.color(0xfa, 0xf7, 0x9f, 255));
      this.addChild(backgroundLayer);

      if (!audioEngine.isMusicPlaying()) {
      bgm_rnd = Math.floor(Math.random()*6);
      if(bgm_rnd==0){
      audioEngine.playMusic(res.bgm1, true);
      }
      if(bgm_rnd==1){
      audioEngine.playMusic(res.bgm1, true);
      }
      if(bgm_rnd==2){
      audioEngine.playMusic(res.bgm2, true);
      }
      if(bgm_rnd==3){
      audioEngine.playMusic(res.bgm2, true);
      }
      if(bgm_rnd==4){
      audioEngine.playMusic(res.bgm5, true);
      }
      if(bgm_rnd==5){
      audioEngine.playMusic(res.bgm5, true);
      }
    }
    //audioEngine.setMusicVolume(audioEngine.getMusicVolume(res.bgm1) - 0.3);

      space = new cp.Space();
      space.gravity = cp.v(0, -100);
      //デバッグモード可視化
      var debugDraw = cc.PhysicsDebugNode.create(space);
      debugDraw.setVisible(false);
      this.addChild(debugDraw, 100);

      /*var wallBottom = new cp.SegmentShape(space.staticBody,
         cp.v(-4294967294, 1), // start point
         cp.v(4294967295, 1), // MAX INT:4294967295
         0); // thickness of wall
      space.addStaticShape(wallBottom);*/

      gameLayer = new game();
      gameLayer.init();
      this.addChild(gameLayer);
   }
});

var game = cc.Layer.extend({
   player: null,
   scroll_gb: null,

   init: function() {
      this._super();

      this.scroll_gb = new Scroll_BG(this);
      var tiledmap = new Tiledmap(this);



      this.player = new Player(this, PlayerStar_X, 188, SpriteTag.player);
      //   var terrain  = new Terrain(this, 100,30,SpriteTag.terrain);
      //   var koban  = new Objects(this, 250,30,SpriteTag.koban);

      scoreText = cc.LabelTTF.create("Coin×" +score ,"Stencil Std","20",cc.TEXT_ALIGNMENT_CENTER);
      scoreText.setColor(255,255,255);
      this.addChild(scoreText);
      scoreText.setPosition(this.player.sprite.getPosition().x, 300);

      hpText = cc.LabelTTF.create("HP:" + HP ,"Stencil Std","20",cc.TEXT_ALIGNMENT_CENTER);
      hpText.setColor(255,255,255);
      this.addChild(hpText);
      hpText.setPosition(this.player.sprite.getPosition().x + 100, 300);

      lifeText = cc.LabelTTF.create("Stock×" + LIFE ,"Stencil Std","20",cc.TEXT_ALIGNMENT_CENTER);
      lifeText.setColor(255,255,255);
      this.addChild(lifeText);
      lifeText.setPosition(this.player.sprite.getPosition().x + 200, 300);

      this.scheduleUpdate();

      cc.eventManager.addListener({
         event: cc.EventListener.KEYBOARD,
         //キー入力したとき
         onKeyPressed: function(keyCode, event) {
                console.log(keyCode);

            if (keyCode == 37) { //左
              if(onGround == true){
                //this.player.sprite.stopAllActions();
                this.player.sprite.runAction(this.player.runningAction);
              }
               this.player.body.applyImpulse(cp.v(-10, 0), cp.v(0, 0)); //run speed
               this.player.sprite.setFlippedX(true);

               //var pos =   this.player.body.p;
               //  player.body.setPos(cp.v(pos.x + 1, pos.y));
            } else if (keyCode == 38 && onGround == true) { //上

              onGround = false;
               if(this.player.body.vy == 0){
               console.log(this.player.body.vy);
               this.player.sprite.stopAllActions();
               this.player.sprite.runAction(this.player.jumpUpAction);
                 this.player.body.applyImpulse(cp.v(0, 150), cp.v(0, 0)); //run speed
                 cc.audioEngine.playEffect(res.jump_mp3);
              }
               //this.sprite.runAction(this.jumpAction);
            } else if (keyCode == 39) { //右
              if(onGround == true){
                //this.player.sprite.stopAllActions();
                this.player.sprite.runAction(this.player.runningAction);
              }
               this.player.body.applyImpulse(cp.v(10, 0), cp.v(0, 0)); //run speed
               this.player.sprite.setFlippedX(false);
            } else if (keyCode == 40) { //下
              this.player.body.getImpulse = setImpulse(cp.v(0, 0), cp.v(0, 0));
            }
         }.bind(this),
         //キーを離したとき
         onKeyReleased: function(keyCode, event){
         }
      }, this);

      //this.collisionBegin.bind(this) bind(this)を付けると、イベントリスナーでthisが使えるようになる
      space.setDefaultCollisionHandler(this.collisionBegin.bind(this), null, null, null);

   },
   addCallback: function(callback) {
      callbacks.push(callback);
   },
   update: function(dt) {
      //コイン位置更新
      scoreText.setPosition(this.player.sprite.getPosition().x, 300);
      hpText.setPosition(this.player.sprite.getPosition().x +100, 300);
      lifeText.setPosition(this.player.sprite.getPosition().x +200, 300);

      space.step(dt);
      for (var i = shapeArray.length - 1; i >= 0; i--) {
         shapeArray[i].image.x = shapeArray[i].body.p.x
         shapeArray[i].image.y = shapeArray[i].body.p.y
            //   var angle = Math.atan2(-shapeArray[i].body.rot.y, shapeArray[i].body.rot.x);
            //   shapeArray[i].image.rotation = angle * 57.2957795;
      }

      var dX = this.player.getDistanceX();
      this.setPosition(cc.p(-dX, 0));
      //this.scroll_gb.checkAndReload(this.player.sprite.x );

      //無敵モード中の視覚効果
      if (this.player.sprite.invulnerability > 0) {
        this.player.sprite.invulnerability--;
        this.player.sprite.setOpacity(255 - this.player.sprite.getOpacity());
      }else{
        this.player.sprite.setOpacity(255);
      }

      //addCallback関数に登録された処理を順番に実行する
      for (var i = 0; i < callbacks.length; ++i) {
         callbacks[i]();
      }
      callbacks = [];

      //死亡処理
      if(HP <= 0 || this.player.sprite.getPosition().y < -50 ){
        if(death_se == true){

          death_se = false;
        }
        audioEngine.stopMusic();
        LIFE = LIFE - 1;
        //主人公消える
        //this.player.sprite.setOpacity(0);
        this.player.sprite.stopAllActions();
        this.player.sprite.runAction(this.player.deathAction);
        //死亡時、行動を止める
        this.pauseSchedulerAndActions();

        if(LIFE == 0 ){
          s = cc.TransitionFade.create(2, new GameOverScene());
          cc.director.runScene(s);
        }else {
        setTimeout(function(){
          audioEngine.setMusicVolume(audioEngine.getMusicVolume(res.bgm1) + 0.7);
          //audioEngine.stopAllEffects();
          cc.director.runScene(new gameScene);
          score = 0;
          HP = 5;
          death_se = true;
        },1500);
      }
      }
   },

   collisionBegin: function(arbiter, space) {

      if (arbiter.a.tag == SpriteTag.terrain || arbiter.b.tag == SpriteTag.terrain) {
        console.log("着いてる");
        onGround = true;
        this.player.sprite.stopAllActions();
        this.player.sprite.runAction(this.player.idolAction);


      } else {

         if (arbiter.a.tag == SpriteTag.koban || arbiter.b.tag == SpriteTag.koban) {
           score += 1;
           scoreText.setString("Coin×"+score);
            cc.audioEngine.playEffect(res.pickup_coin_mp3);
         }
         if (arbiter.a.tag == SpriteTag.food || arbiter.b.tag == SpriteTag.food) {
           cc.audioEngine.playEffect(res.heal_se);
           HP += 1;
           hpText.setString("HP:"+ HP);
         }
         if (arbiter.a.tag == SpriteTag.bomb || arbiter.b.tag == SpriteTag.bomb) {
            cc.audioEngine.playEffect(res.up_mp3);
            LIFE += 1;
            lifeText.setString("Stock:"+ LIFE);

         }
         if (arbiter.a.tag == SpriteTag.monster1 || arbiter.b.tag == SpriteTag.monster1) {
            cc.audioEngine.playEffect(res.delete_mp3);
            HP -= 1;
            hpText.setString("HP:"+ HP);
            this.player.sprite.invulnerability = 100;

         }
         if (arbiter.a.tag == SpriteTag.monster2 || arbiter.b.tag == SpriteTag.monster2) {
            cc.audioEngine.playEffect(res.damage_mp3);
            HP -= 5;
            hpText.setString("HP:"+ HP);
            if(HP > 0){
              this.player.sprite.invulnerability = 100;
            }
         }
         if (arbiter.a.tag == SpriteTag.goal || arbiter.b.tag == SpriteTag.goal) {
           audioEngine.stopMusic();
           this.player.sprite.stopAllActions();

           //死亡時、行動を止める
           this.pauseSchedulerAndActions();
           setTimeout(function(){
             //audioEngine.stopAllEffects();
             cc.director.runScene(new ClearScene);
           },1500);
         }
         if (arbiter.a.tag == SpriteTag.player) {
            var collision_obj = arbiter.b; // 衝突したShapeの取得
         } else {
            var collision_obj = arbiter.a; // 衝突したShapeの取得
         }
         //衝突したオブジェクトを消すのは、update関数で定期的に行う
         this.addCallback(function() {
            for (var int = 0; int < objectArray.length; int++) { // 衝突したコインを探す
               var object = objectArray[int]; // 配置済みオブジェクトの取得
               if (object.shape == collision_obj) { // 衝突したコインの場合
                  console.log("hit");
                  if(arbiter.a.tag != SpriteTag.monster1 && arbiter.b.tag != SpriteTag.monster1){//モンスター以外なら削除
                    if(arbiter.a.tag != SpriteTag.monster2 && arbiter.b.tag != SpriteTag.monster2){//モンスター以外なら削除
                      if(arbiter.a.tag != SpriteTag.goal && arbiter.b.tag != SpriteTag.goal){//モンスター以外なら削除
                        object.removeFromParent();
                      }
                    }
                  }
                  break; // 処理を抜ける
               }
            }
         }.bind(this));
      }

      return true;
   },

});
