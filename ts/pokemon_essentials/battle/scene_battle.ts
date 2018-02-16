namespace PE.Battle {
  export class Scene_Battle extends Scene_Base {
    hud: Sprite;
    partyBar: UI.HPBar;
    movesSelection: UI._MovesSelection;
    battleCommands: UI.BattleCommands;
    message: UI.Window_BattleMessage;

    layers: { bg: Sprite; bg2: Sprite; weather: Weathers.WeatherLayer } = { bg: undefined, bg2: undefined, weather: undefined };

    sprites = {};

    create() {
      super.create();
      this.createLayers();
    }

    start() {
      super.start();
      $Battle.scene = this;
      $Battle.changePhase(Phase.ActionSelection);
    }

    update() {
      super.update();
      $Battle.update();
      switch ($Battle.phase) {
        case Phase.ActionSelection:
          this.partyBar.visible = true;
          this.hud.visible = true;
          this.battleCommands.updateInput();
          break;
        case Phase.MoveSelection:
          this.partyBar.visible = false;
          this.hud.visible = false;
          this.movesSelection.updateInput();
          break;
        case Phase.Animation:
          this.partyBar.visible = true;
          break;
        default:
          this.partyBar.visible = false;
      }
    }

    stop() {
      super.stop();
    }

    terminate() {
      super.terminate();
    }

    createLayers() {
      this.createBackground();
      this.createBattlers();

      this.createUI();

      this.createWindowLayer();
      this.createMessageWindow();
    }

    createBackground() {
      this.layers['bg'] = new Sprite();
      this.layers['bg'].bitmap = ImageManager.loadBitmap('img/battlebacks/', 'bg-forest', undefined, undefined);
      this.layers['bg'].x = Graphics.width / 2;
      this.layers['bg'].y = Graphics.height + 80;
      this.layers['bg'].anchor.x = 0.5;
      this.layers['bg'].anchor.y = 1;
      this.addChild(this.layers['bg']);

      this.layers['bg2'] = new Sprite();
      this.addChild(this.layers['bg2']);


    }

    createMessageWindow() {
      this.message = new UI.Window_BattleMessage();
      this.addWindow(this.message);
      this.message.subWindows().forEach(function (window) {
        this.addWindow(window);
      }, this);
    }

    createBattlers() {

      for (const index of $Battle.sides.foe.actives) {
        let battler = $Battle.battlers[index];
        let fx = Graphics.width - 96;
        let fy = 240
        this.sprites[index] = new Sprites.Battler(battler.pokemon, Sprites.BattlersFacing.Front);
        this.sprites[index].x = fx;
        this.sprites[index].y = fy;
        this.sprites[index].scale.x = 2;
        this.sprites[index].scale.y = 2;
        this.sprites[index].anchor.x = 0.5;
        this.sprites[index].anchor.y = 1;
        this.addChild(this.sprites[index]);
      }

      for (const index of $Battle.sides.player.actives) {
        let battler = $Battle.battlers[index];
        let x = 96;
        let y = Graphics.height;
        this.sprites[index] = new Sprites.Battler(battler.pokemon, Sprites.BattlersFacing.Back);
        this.sprites[index].x = x;
        this.sprites[index].y = y;
        this.sprites[index].scale.x = 3;
        this.sprites[index].scale.y = 3;
        this.sprites[index].anchor.x = 0.5;
        this.sprites[index].anchor.y = 1;
        this.addChild(this.sprites[index]);
      }
    }


    createUI() {
      this.layers.weather = new Weathers.WeatherLayer();
      this.addChild(this.layers.weather);

      let x = Graphics.width - 168;
      let y = Graphics.height - 108;
      this.battleCommands = new UI.BattleCommands(x, y);
      this.battleCommands.visible = false;
      this.addChild(this.battleCommands);

      for (const index of $Battle.sides.foe.actives) {
        let battler = $Battle.battlers[index];
        let h2 = new UI.HPBar(battler, Graphics.width - 208, 48, true);
        this.addChild(h2);
      }

      for (const index of $Battle.sides.player.actives) {
        let battler = $Battle.battlers[index];
        this.partyBar = new UI.HPBar(battler, 16, Graphics.height - 64, false);
        this.partyBar.visible = false;
        this.addChild(this.partyBar);

        this.movesSelection = new UI._MovesSelection(battler);
        this.addChild(this.movesSelection);
      }





      let msg = i18n._('What will %1 do?', $Battle.player.active.name);
      this.hud = new Sprite(new Bitmap(300, 32));
      this.hud.bitmap.fontSize = 20;
      this.hud.bitmap.drawText(msg, 0, 0, 300, 32, 'right');
      this.hud.x = Graphics.width - 8;
      this.hud.y = Graphics.height;
      this.hud.anchor.x = 1;
      this.hud.anchor.y = 1;
      this.hud.visible = false;
      this.addChild(this.hud);
    }


    showAbilityIndicator(ability: string, foeSide: boolean) {
      let x = 0;
      let y = 192;
      if (foeSide) { x = Graphics.width - 224; y = 96; }
      let sing = new UI.AbilityIndicator(ability);
      sing.x = x;
      sing.y = y;
      this.addChild(sing);
    }
    setWeather(weather: Weathers) {
      this.layers.weather.setWeather(weather);
    }
  }
}
