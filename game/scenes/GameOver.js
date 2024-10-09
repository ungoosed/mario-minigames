import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');

    }
    init(data) {
        this.player1Burgers = data.player1Burgers
        this.player2Burgers = data.player2Burgers
        this.player1Damage = data.player1Damage
        this.player2Damage = data.player2Damage
    }

    create() {
        if (this.player1Burgers >= this.player2Burgers) {
            if (this.player1Burgers == this.player2Burgers) {
                this.add.text(0, 0, 'IT WAS A TIE! You Both Got ' + this.player1Burgers + ' Burgers', {
                    fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                })
            } else {
                this.add.text(0, 0, 'Player 1 WON. They Got ' + this.player1Burgers + ' BURGERS', {
                    fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                })
                this.add.text(0, 500, 'Player 2 only got  ' + this.player2Burgers + ' BURGERS', {
                    fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                })
            }
        } else {
            if (this.player1Burgers == this.player2Burgers) {
                this.add.text(0, 0, 'IT WAS A TIE! You Both Got ' + this.player1Burgers + ' Burgers', {
                    fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                })
            } else {
                this.add.text(0, 0, 'Player 2 WON. They Got ' + this.player2Burgers + ' BURGERS', {
                    fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                })
                this.add.text(0, 500, 'Player 1 only got  ' + this.player1Burgers + ' BURGERS', {
                    fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                })
            }
        }

        this.input.once('pointerdown', () => {

            this.scene.start('ChooseCharacter');

        });
    }
}
