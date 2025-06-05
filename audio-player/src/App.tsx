import React from 'react';
import { Boombox } from './components/Boombox/Boombox';

const App = () => {
  const audioFiles = [
    {
      title: "Song 1",
      url: "/audio/116.mp3"  // Update with your actual filename
    },
    {
      title: "Song 2",
      url: "/audio/defeat.mp3"  // Update with your actual filename
    }
  ];

  return (
    <div className="App">
      <Boombox audioFiles={audioFiles} />
    </div>
  );
};

export default App;