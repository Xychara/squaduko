import './App.css'; 
import React, {useState} from 'react';

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

const Board = ({}) => {
  const [selected, setSelected] = useState([0,0]);

const inputHandler = function(e) {
  result.innerHTML = selected.value;
}

  return (
    <div className="box-array">
      <Sector spos={[1,1,1]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[1,4,2]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[1,7,3]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[4,1,4]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[4,4,5]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[4,7,6]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[7,1,7]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[7,4,8]} setSelected={setSelected} selected={selected}/>
      <Sector spos={[7,7,9]} setSelected={setSelected} selected={selected}/>
    </div>
  );
}

const Sector = ({spos, setSelected, selected}) => (
  <div className="sector">
    <Box pos={[spos[0],spos[1],spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0],spos[1]+1,spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0],spos[1]+2,spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0]+1,spos[1],spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0]+1,spos[1]+1,spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0]+1,spos[1]+2,spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0]+2,spos[1],spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0]+2,spos[1]+1,spos[2]]} setSelected={setSelected} selected={selected}/>
    <Box pos={[spos[0]+2,spos[1]+2,spos[2]]} setSelected={setSelected} selected={selected}/>
  </div>
);

const Box = ({val,pos,setSelected,selected}) => {
  const style = {
    backgroundColor: arrayEquals(pos,selected) ? 'lightblue' :
    (selected[0]==pos[0] || selected[1]==pos[1] || selected[2]==pos[2]) ? 'grey' : 'black'
  };

  function toggleSelected() {
    console.log("Clicked at " + pos);
    setSelected(arrayEquals(selected,pos) ? [0,0] : pos);
  };

  return (
    <div className="box" style={style}
    onClick={toggleSelected}>
      <div className="num">{val}</div>
    </div>
    );
  }

function App() {
  return (
    <div className="container">
      <Board/>
    </div>
  );
}

export default App;


//TODO:
//centering (all of it)
//make only one clicked at a time
//type/press button at bottom to modify selected one
//notes: while holding shift or second row of buttons, different font color
//notes react to input values

//make it work online - database?