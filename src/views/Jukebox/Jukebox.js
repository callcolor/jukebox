import React, { Component } from 'react';
import AudioSpectrum from 'react-audio-spectrum';

import AsciiJukebox from '../../components/AsciiJukebox/AsciiJukebox';
import JukeboxConsole from '../../components/JukeboxConsole/JukeboxConsole';

import './Jukebox.css';

export default class extends Component {
  render() {
    return (
      <div className="jumbotron jumbotron-fluid full-height view-jukebox">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <JukeboxConsole />
            </div>
            <div className="col-sm-6">
              <AsciiJukebox />
            </div>
          </div>
        </div>
        <div className="visualizer-audio-wrapper">
          <audio style={{display: 'none'}} id="jukebox-audio-controls" crossOrigin="anonymous" src="https://jukebox.kansascitygeek.com:8700/;" />
          <AudioSpectrum
            id="audio-canvas"
            height={200}
            width={300}
            audioId={'jukebox-audio-controls'}
            capColor={'green'}
            capHeight={0}
            meterWidth={2}
            meterCount={512}
            meterColor={[
              {stop: 0, color: 'black'},
              {stop: 0.5, color: 'green'},
              {stop: 1, color: 'green'}
            ]}
            gap={4}
          />
        </div>
      </div>
    );
  }
}
