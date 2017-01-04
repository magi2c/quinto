'use strict';

var Game = React.createClass({
    displayName: 'Game',

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(Grid, { data: this.props.tableData, dataCut: this.props.tableDataCut })
        );
    }
});

var Grid = React.createClass({
    displayName: 'Grid',

    listMatrix: function listMatrix() {
        var matrix = [],
            k,
            i;
        var data = this.props.data;
        for (i = 0, k = -1; i < data.length; i++) {
            if (i % 10 === 0) {
                k++;
                matrix[k] = [];
            }
            matrix[k].push(data[i]);
        }
        return matrix;
    },
    rowNodes: function rowNodes() {
        var placeHolder = [];
        var that = this;
        var tiles = this.listMatrix().map(function (numbers) {
            numbers.map(function (number, index) {
                placeHolder.push(React.createElement(Tile, { data: number, key: number, currentNumber: that.state.currentNumber }));
            });
        });
        return placeHolder;
    },
    getInitialState: function getInitialState() {
        return { currentNumber: '-', currentNumberText: "_", lastCalledNumbers: [], currentCount: 0 };
    },
    lloro: function lloro() {
        numToLloro(this.state.currentNumber, this.state.voiceselection);
    },
    updateCurrentNumberLabel: function updateCurrentNumberLabel() {
        if (this.props.dataCut.length == 0) {
            alert('All numbers have been called.');
            return;
        }

        var randomIndex = Math.floor(Math.random() * this.props.dataCut.length);
        var number = this.props.dataCut[randomIndex];
        this.props.dataCut.splice(randomIndex, 1);

        var numText = numToLloro(number, this.state.voiceselection);

        if (this.state.lastCalledNumbers.indexOf(number) > -1) {
            return;
        }

        if (this.state.lastCalledNumbers.length === 5) {
            this.state.lastCalledNumbers.shift();
        }
        this.state.lastCalledNumbers.push(number);

        this.setState({ currentNumber: number, currentNumberText: numText, lastCalledNumbers: this.state.lastCalledNumbers, currentCount: this.state.currentCount + 1 });
    },
    displayLastNumbers: function displayLastNumbers() {
        var node = [];
        this.state.lastCalledNumbers.map(function (number) {
            node.push(React.createElement(NumberComponent, { number: number, key: number }));
        });
        return node;
    },

    handleChange: function handleChange(event) {
        this.setState({ voiceselection: event.target.value });
    },

    render: function render() {
        return React.createElement(
            'section',
            { className: 'section' },
            React.createElement(
                'div',
                { className: 'columns' },
                React.createElement(
                    'div',
                    { className: 'column is-one-third' },
                    React.createElement(
                        'div',
                        { className: 'control' },
                        React.createElement(
                            'span',
                            { className: '' },
                            React.createElement(
                                'a',
                                { onClick: this.updateCurrentNumberLabel, className: 'button is-success is-large' },
                                'Next!'
                            )
                        ),
                        React.createElement(
                            'span',
                            { className: 'select is-pulled-right' },
                            React.createElement(
                                'select',
                                { value: this.state.voiceselection, onChange: this.handleChange },
                                React.createElement(
                                    'option',
                                    { value: 'UK English Female' },
                                    'UK English Female'
                                ),
                                React.createElement(
                                    'option',
                                    { value: 'Catalan Male' },
                                    'Catalan Male'
                                )
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'control' },
                        React.createElement(
                            'span',
                            { className: 'last-numbers is-pulled-right' },
                            this.displayLastNumbers()
                        ),
                        React.createElement(
                            'a',
                            { onClick: this.lloro, className: 'current button is-success is-large' },
                            this.state.currentNumber
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        this.state.currentNumberText
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'column' },
                    React.createElement(
                        'div',
                        { className: 'grid' },
                        this.rowNodes()
                    )
                )
            )
        );
    }
});

var Tile = React.createClass({
    displayName: 'Tile',

    getInitialState: function getInitialState() {
        var name = this.props.data === this.props.currentNumber ? 'tile active' : 'tile';
        return { className: name };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setState({ className: 'tile active animated pulse' });
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return nextProps.data === nextProps.currentNumber;
    },
    render: function render() {

        if ((this.props.data + 1) % 11) {
            return React.createElement(
                'div',
                { className: this.state.className },
                this.props.data
            );
        } else {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: this.state.className },
                    this.props.data
                )
            );
        }
    }
});

var NumberComponent = React.createClass({
    displayName: 'NumberComponent',

    render: function render() {
        return React.createElement(
            'span',
            { className: 'tag is-success' },
            this.props.number
        );
    }
});

for (var tableData = [], i = 0; i < 90; ++i) {
    tableData[i] = i + 1;
}var tableDataCut = tableData.slice(0);

ReactDOM.render(React.createElement(Game, { tableData: tableData, tableDataCut: tableDataCut }), document.getElementById('main'));

var numToLloro = function numToLloro(num, language) {

    var numText = '';
    var options = {};
    if (language == 'Catalan Male') {
        if (lloro[num] != undefined) {
            numText = lloro[num];
            options = { pitch: 0.6, rate: 0.8 };
        } else {
            numText = 'Elllllll ' + num;
            options = { pitch: 0.6, rate: 0.8 };
        }
    } else {
        numText = 'Theeee ' + num;
    }

    responsiveVoice.speak(numText, language, options);

    return numText;
};

var lloro = {
    1: "Un que fa por",
    2: "Un aneguet",
    3: "Orella de gat",
    4: "Una cadireta",
    5: "Cincooo",
    6: "El dia de Reis",
    7: "Un que té set (que es foti!)",
    8: "Un de mamellut",
    9: "Davanter centre",
    10: "Pelat el jove",
    11: "La Diada",
    12: "Els mesos",
    13: "El de la mala sort",
    14: "Agafa un cagarro i... esmorza!",
    15: "La nena maca",
    16: "L'edat del pavo",
    17: "Que dise?",
    18: "La majoria d'edat",
    19: "Sant Josep",
    20: "Pelat la nena",
    21: "L'aneguet coix",
    22: "Parelleta d'ànecs",
    23: "Sant Jordi",
    24: "Sant Joan",
    25: "Nadal!",
    26: "Sant Esteve",
    27: "La verge de Montserrat",
    28: "Els sants innocents",
    29: "El tramvia",
    30: "El trempat",
    31: "L'últim dia de l'any",
    33: "Parella de tresos (els collons dels pagesos!)",
    44: "Quac-quac",
    45: "Mitja part",
    46: "Temps afegit",
    50: "Pelat el del mig",
    54: "Studio 54",
    55: "Parella de músics",
    58: "Anem a Sabadell per la C58",
    60: "El cansat",
    64: "Quasi jubilat",
    65: "La jubilació",
    66: "Parella d'embarassades",
    67: "Em jubilaré",
    69: "El més porc de tots",
    70: "Pelat la tieta",
    80: "Pelat l'àvia/la iaia",
    82: "El naranjito",
    90: "Pelat l'últim"
};