import React from 'react';
import { Boombox } from './components/Boombox/Boombox';

const App = () => {
  const audioFiles = [
    {
      title: "116",  // Update these titles
      url: "/audio/116.mp3"
    },
    {
      title: "Defeat", // Update these titles
      url: "/audio/defeat.mp3"
    }
  ];

  return (
    <div className="App">
      <Boombox audioFiles={audioFiles} />
    </div>
  );
};

export default App;