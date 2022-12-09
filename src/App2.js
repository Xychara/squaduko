import './App2.css'; 
import React, {useEffect, useState} from 'react';
import databaseService from "./databaseService.js";

function stringHas(string,char) {
  return string.indexOf(char)!==-1;
}

const NoteGrid = (notes) => (
  <div className='subgrid'>
    {Array(9).fill(0).map((e,index) => 
      (<div className='note'>{stringHas(notes,index+1) ? index+1 : ""}</div>))}
  </div>
);

const Board = () => {
  const [selected, setSelected] = useState(-2);  
  const [board_vals, setBoard_vals] = useState(new Array(81).fill(0));
  const [board_notes, setBoard_notes] = useState(new Array(81).fill(""));

  //----------DATABASE STUFF START----------
  useEffect(()=>{
    
    function onDataChange(items) {
      items.forEach((item) => {
        if(item.key === "selected") setSelected(item.val());
        if(item.key === "board_vals") setBoard_vals(item.val());
        if(item.key === "board_notes") setBoard_notes(item.val());
      });
    }

    databaseService.getAll().on("value", onDataChange);
    return () => {
      databaseService.getAll().off("value", onDataChange);
    }
  }, []);
  //-----------DATABASE STUFF END-----------

  function shouldHighlight(index, selected) {
    // return true if any of the below:
    // const same_box = Math.ceil(index%9/3)==Math.ceil(selected%9/3) //same 3 cols
    //               && Math.ceil(index/27)==Math.ceil(selected/27); //same 3 rows
    // const same_row = Math.ceil(index/9)==Math.ceil(selected/9);
    // const same_col = selected%9==index%9;
    return (Math.floor((index-1)%9/3)===Math.floor((selected-1)%9/3) 
    && Math.ceil(index/27)===Math.ceil(selected/27))
    ||(Math.ceil(index/9)===Math.ceil(selected/9))
    ||(selected%9===index%9)
  }
  
  function getClassName(selected, index, val) {
    return "cell"
    + (selected===index ? " selected" 
    : board_vals[selected]%10===val%10&&val>0 ? " equiv"
    : shouldHighlight(index+1, selected+1) ? " highlighted" : "")
    + (val>10 ? " given" : "");
  }

  useEffect(() => {

    function changeBoard(val,index) {
      const temp = [...board_vals];
      temp[index] = temp[index] === val ? 0 : val;
      setBoard_vals(temp);
      databaseService.update("board_vals",board_vals);
    }

    function changeNotes(val,index) {
      const temp = [...board_notes];
      if (val) {
        // val in current ? add val : remove val;
        const current = temp[index];
        temp[index] = stringHas(current,val) ? current.replace(val,'') : current+val;
        setBoard_notes(temp);
      } else { //0 => clear
        temp[index] = "";
        setBoard_notes(temp);
      }
      databaseService.update("board_notes",board_notes);
    }

    function handleDigit(event) {
      if (49 <= event.which && event.which <= 57 && selected>=0) { //digit
        const key = event.which-48; //number
        if (event.shiftKey) changeNotes(key,selected);
        else if (event.altKey) changeBoard(key+10,selected);
        else changeBoard(key,selected);
      }
      if (event.which === 8 && selected>=0) { //delete
        //if val nonempty, delete it. if empty, clear notes.
        if (board_vals[selected]) changeBoard(0,selected);
        else changeNotes(0,selected);
      }
    };  

    document.addEventListener('keydown',handleDigit);
    
    return () => {
      document.removeEventListener('keydown',handleDigit);
    };
  }, [board_notes, board_vals, selected]);

  function toggleSelected(index) {
    // console.log(index + " :index|selected: " + selected);
    setSelected(selected===index ? -2 : index);
    databaseService.update("selected",selected);
  }

  const Cells = board_vals.map((val,index) => (
    <div key={index.toString()} 
          id={index.toString()} 
          className={getClassName(selected,index,val)}
          onClick={()=>toggleSelected(index)}>
      {val ? val%10 : NoteGrid(board_notes[index])}
    </div>
    )
  );

  return (
    <div className="cell-grid">
      {Cells}
    </div>
  );
}



function App2() {
  return (
    <div id="container" className="container">
      <Board/>
    </div>
  );
}

export default App2;


//TODO:
//make notes appear in corners rather than just centrally

//buttons at the bottom (change when holding shift/ctrl, buttons to turn on/off notes/main modes?)

//make it work online - realtime database?
