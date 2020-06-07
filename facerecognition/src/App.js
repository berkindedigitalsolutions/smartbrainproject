import React, { Component} from 'react';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';

const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '223670dbbd6d48e19b8da62249c07922'
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
      value_area: 800     
    }
    }
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value})
    }
  onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input})
      app.models.predict(
      Clarifai.COLOR_MODEL,this.state.input)
      .then(
      function(response) {
        console.log("Response is",response);
            },
      function(err) {
        // there was an error
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params ={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
        />

        
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }

}

export default App;
