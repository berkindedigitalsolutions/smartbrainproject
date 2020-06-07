import React, { Component} from 'react';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';

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
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row*height,
        rightCol: width - (clarifaiFace.right_col*width),
        bottomRow: height - (clarifaiFace.bottom_row*height)
      }
    }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box })
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value})
    }
  onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input})
      app.models
      .predict(
        "a403429f2ddf4b49b307e318f00e528b",
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  
  }

  onRouteChange = (route) => {
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params ={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} />  
        { this.state.route ==='signin' ? 
        <Signin onRouteChange={this.onRouteChange} />
        :
        <div>

        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
        />

        
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        }    
      </div>
    );
  }

}

export default App;
