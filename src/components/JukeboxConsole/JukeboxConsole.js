import React, { Component } from 'react';
import axios from 'axios';

import './JukeboxConsole.css';

const man = [
  '--- Command List ---',
  '',
  'search <Song Name>',
  'play <Number: 1-10>',
  '',
  '--- End Command List ---',
];

export default class extends Component {
  constructor(props) {
    super(props)
    this.formatInput = this.formatInput.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.prompt = '>';
    this.state = {
      input: '',
      output: man.concat([]),
    }
  }

  componentDidMount() {
    document.getElementById('jukebox-console-input').focus();
    window.addEventListener('click', () => {
      document.getElementById('jukebox-console-input').focus();
      document.getElementById('jukebox-audio-controls').play();
    });
    this.getNowPlaying();
    setInterval(this.getNowPlaying, 5000);
  }

  getNowPlaying() {
    axios.get('https://jukebox.kansascitygeek.com:8800/7.html').then(response => {
      const nowplaying = response.data.replace('</body></html>', '').split(',').pop();
      if (this.nowplaying !== nowplaying) {
        this.nowplaying = nowplaying;
        this.state.output.push(`-- Playing ${nowplaying} --`);
        this.setState({
          output: this.state.output,
        });
      }
    });
  }

  formatInput(str) {
    return this.prompt + ' ' + str;
  }

  cleanInput(str = '') {
    str = str.replace(this.prompt, '');
    str = str.replace(/\s\s+/g, ' ');
    if (str.indexOf(' ') === 0) {
      str = str.replace(' ', '');
    }
    return str;
  }

  handleInput(e) {
    const input = this.cleanInput(e.target.value);
    this.setState({
      input,
    });
  }

  getCommand(str) {
    const commands = ['play', 'search'];
    let found = false;
    commands.forEach(command => {
      if (str.indexOf(command) === 0) {
        if (str.indexOf(command + ' ') === 0 && str.length > command.length + 1) {
          found = command;
        } else if (str.indexOf(command + ' ') === 0 || str === command) {
          found = true;
          this.state.output.push(`Error: ${command} requires one parameter, none found.`);
          this.setState({
            output: this.state.output,
          });
        }
      }
    });
    if (!found) {
      this.state.output.push('Error: command not found')
      this.setState({
        output: this.state.output,
      });
    } else if (found === true) {
      return false;
    }
    return found;
  }

  handleSubmit(e) {
    e.preventDefault();
    const input = this.cleanInput(this.state.input);

    if (input === '') return;

    if (input === 'clear') {
      this.setState({
        output: [],
        input: '',
      });
      return;
    }

    if (input === 'help') {
      this.setState({
        output: this.state.output.concat(man),
        input: '',
      });
      return;
    }

    const command = this.getCommand(input);
    const parameter = this.state.input.replace(command + ' ', '');
    if (command === 'play') {
      this.play(parameter);
    } else if (command === 'search') {
      this.search(parameter);
    }

    this.setState({
      input: '',
    });
  }

  search(str) {
    this.state.output.push('Searching...');
    this.setState({
      output: this.state.output,
    });
    axios.get('https://jukebox.kansascitygeek.com/search.php', {
      params: {
        search: str
      }
    }).then(response => {
      this.results = response.data;
      response.data.forEach(result => {
        this.state.output.push(`${result.index} ${result.name}`);
      });
      this.setState({
        output: this.state.output,
      });
    });
  }

  play(int) {
    if (!this.results) {
      this.state.output.push('Error: result set is empty');
      this.setState({
        output: this.state.output,
      });
      return;
    }
    let found = false;
    this.results.forEach(result => {
      if (parseInt(result.index, 10) === parseInt(int, 10)) {
        found = result;
      }
    })
    if (!found) {
      this.state.output.push('Error: input out of range');
      this.setState({
        output: this.state.output,
      });
      return;
    }
    this.state.output.push(`Downloading...`);
    this.setState({
      output: this.state.output,
    });
    axios.get('https://jukebox.kansascitygeek.com/play.php', {
      params: {
        id: found.id,
        user: found.name,
      }
    }).then(response => {
      this.state.output.push(`Queued ${found.name}`);
      this.setState({
        output: this.state.output,
      });
      document.getElementById('jukebox-audio-controls').play();
    });
  }

  render() {
    const input = this.formatInput(this.state.input);
    const output = this.state.output.join("\n");

    return (
      <div className="jukebox-console">
        <div className="ticker">
          <pre>
            {output}
          </pre>
        </div>
        <form onSubmit={this.handleSubmit} autoComplete="off">
          <input id="jukebox-console-input" value={input} onChange={this.handleInput} className="console" />
          <input type="submit" style={{display: 'none'}} />
        </form>
      </div>
    );
  }
}
