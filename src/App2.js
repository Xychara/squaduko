import './App2.css'; 
import React, {useEffect, useState} from 'react';
import databaseService from "./databaseService.js";

function arrHas(arr,char) {
  if (typeof(arr)==="undefined") return false;
  return arr.indexOf(char)!==-1;
}

var colorDict = {
  0: "",
  1: "red",
  2: "orange",
  3: "yellow",
  4: "green",
  5: "forestgreen",
  6: "blue",
  7: "purple",
  8: "periwinkle",
  9: "white"
}

const NoteGrid = (loc, notes, centers) => {

  function constructSubgrid() {
    const sorted = notes.split("").sort((a,b)=>parseInt(a)-parseInt(b));
    var result = Array(9).fill(0);
    var locs = [];
    if (sorted.length<=4) { //1-4
      locs = [0,2,6,8];
    } else if (sorted.length<=6||centers.length >= 3) { // 4-6
      locs = [0,1,2,6,7,8];
    } else if (sorted.length===9&&centers.length === 0) { // 9, but prioritize centers
      locs = [0,1,2,3,4,5,6,7,8];
    } else { // 6-8 or 9 w/centers
      locs = [0,1,2,3,5,6,7,8];
    }
    
    for (var i=0; i<sorted.length&&i<locs.length; i++) {
      result[locs[i]] = sorted[i];
    }
    return result;
  }
  
  return (
    <div className='subgrid'>
      <div className='center center-pos'>{centers}</div>
      {constructSubgrid().map((e,index) => 
        (<div key={loc + 'notes_subgrid' + index} className='note'>{e===0? "" : e}</div>))}
    </div>
  );
}

// const OLDNOTEGRID = (loc, notes) => ( 
//   <div className='corner-subgrid'>
//     {Array(9).fill(0).map((e,index) => 
//       (<div key={loc + 'corners_subgrid' + index} className='corner'>{index+1}</div>))}
//   </div>
// );

const Board = () => {
  //Stored info

  // get initial data (?) also set stuff up if it doesnt exist
  const [initialData, setInitialData] = useState(() => { //so that it runs once only!
    var data = {};
    databaseService.getAll().once("value").then(function(snapshot) {
      if (!snapshot.child("selected").exists()) {
        console.log("selected do/esnt exist, setting up");
        databaseService.add("selected",{"default":[0]});
        data["selected"] = {"default":[0]};
      } else {
        data["selected"] = snapshot.child("selected").val();
      }
      if (!snapshot.child("colors").exists()) {
        console.log("colors doesn't e/xist, setting up");
        databaseService.add("colors",{"default":"100 100 100"});
        data["colors"] = {"default":"100 100 100"};
      } else {
        // console.log("colors exists, setting colors to it");
        // console.log(snapshot.child("colors").val());
        data["colors"] = snapshot.child("colors").val();
      }
      if (!snapshot.child("board_vals").exists()) {
        databaseService.add("board_vals", new Array(81).fill(0));
        data["board_vals"] = new Array(81).fill(0);
      } else {
        data["board_vals"] = snapshot.child("board_vals").val();
      }
      if (!snapshot.child("board_notes").exists()) {
        databaseService.add("board_notes", new Array(81).fill(""));
        data["board_notes"] = new Array(81).fill("");
      } else {
        data["board_notes"] = snapshot.child("board_notes").val();
      }
      if (!snapshot.child("board_colors").exists()) {
        databaseService.add("board_colors", new Array(81).fill(0));
        data["board_colors"] = new Array(81).fill(0);
      } else {
        data["board_colors"] = snapshot.child("board_colors").val();
      }
      if (!snapshot.child("board_centers").exists()) {
        databaseService.add("board_centers", new Array(81).fill(""));
        data["board_centers"] = new Array(81).fill("");
      } else {
        data["board_centers"] = snapshot.child("board_centers").val();
      }
    });
    // console.log(data);
    return data;
  });

  const [selected, setSelected] = useState({"default":[0]}); 
  const [board_vals, setBoard_vals] = useState(new Array(81).fill(0));
  const [board_notes, setBoard_notes] = useState(new Array(81).fill(""));
  const [board_colors, setBoard_colors] = useState(new Array(81).fill(0));
  const [board_centers, setBoard_centers] = useState(new Array(81).fill(""));
  const [colors, setColors] = useState({"default":""});

  function colorToText(color) {
    if (typeof(color) === "undefined" ) return "";
    const temp = color.split(/ /);
    return ("rgba(" + temp[0] + "," + temp[1] + "," + temp[2] + ",0.7)")
  }

  // function getSnapshot() {
  // // check if things exist, if not instantiate them
  // databaseService.getAll().once("value").then(function(snapshot) {
  //   if (!snapshot.child("selected").exists()) {
  //     console.log("selected doesnt exist, setting up");
  //     databaseService.add("selected",{"default":[0]});
  //     setSelected({"default":[1]});
  //   } else {
  //     console.log("selected exists, setting selected to it");
  //     console.log(snapshot.child("selected").val());
  //     setSelected(snapshot.child("selected").val());
  //   }
  //   if (!snapshot.child("colors").exists()) {
  //     databaseService.add("colors",{"default":"100 100 100"});
  //     setColors({"default":"100 100 100"});
  //     console.log("colors doesn't exist, setting up");
  //   } else {
  //     console.log("colors exists, setting colors to it");
  //     console.log(snapshot.child("colors").val());
  //     setColors(snapshot.child("colors").val());
  //   }
  //   if (!snapshot.child("board_vals").exists()) {
  //     databaseService.add("board_vals", new Array(81).fill(0));
  //   } else {
  //     setBoard_vals(snapshot.child("board_vals").val());
  //   }
  //   if (!snapshot.child("board_notes").exists()) {
  //     databaseService.add("board_notes", new Array(81).fill(""));
  //   } else {
  //     setBoard_notes(snapshot.child("board_notes").val());
  //   }
  //   if (!snapshot.child("board_colors").exists()) {
  //     databaseService.add("board_colors", new Array(81).fill(0));
  //   } else {
  //     setBoard_colors(snapshot.child("board_colors"));
  //   }
  //   if (!snapshot.child("board_centers").exists()) {
  //     databaseService.add("board_centers", new Array(81).fill(""));
  //   } else {
  //     setBoard_centers(snapshot.child("board_centers").val());
  //   }
  // });
  // }

  //----------DATABASE STUFF START----------

  useEffect(()=>{

    function onDataChange(items) {
      // console.log("Discovered data: ", items.val());
      setSelected(items.val()["selected"]);
      setBoard_vals(items.val()["board_vals"]);
      setBoard_notes(items.val()["board_notes"]);
      setBoard_colors(items.val()["board_colors"]);
      setBoard_centers(items.val()["board_centers"]);
      setColors(items.val()["colors"]);
    }

    databaseService.getAll().on("value", onDataChange);
    return () => {
      databaseService.getAll().off("value", onDataChange);
    }
  }, []);

  //-----------DATABASE STUFF END-----------

  //Mode
  const [mode, setMode] = useState(0);
  // 0 => normal
  // 1 => notes/corner
  // 2 => center
  // 3 => color
  // 4 => given

  //Keyboard/mouse info
  const [mousedown, setMousedown] = useState(false);
  const [adding, setAdding] = useState(true);

  //Options + local info
  const [optionsMenu, setOptionsMenu] = useState(false); //display options menu or not
  const [highlightSoduko, setHighlightSoduko] = useState(false); //same row/col/box
  const [highlightMatching, setHighlightMatching] = useState(true); //same #
  const [showContradiction, setShowContradiction] = useState(true); //errors in red
  const [showButtons, setShowButtons] = useState(true); //show input buttons
  const [showPlayers, setShowPlayers] = useState(true); //show current players in their colors

  const [name, setName] = useState("");


  //trying to remove people's info when they leave
  useEffect(() => {
    var tempN = name==="" ? localStorage.name : name;

    function deleteRelevantData() { 
      databaseService.delete("selected",tempN);
      databaseService.delete("colors",tempN);
    }

    window.addEventListener("beforeunload", deleteRelevantData);

    // return () => {
    //   //window.removeEventListener("beforeunload",deleteRelevantData);
    // }
  }, [name])


  
  //Local info + state modifier functions
  function changeHighlightSoduko(to) {
    setHighlightSoduko(to);
    localStorage.highlightSoduko = to;
  }

  function changeHighlightMatching(to) {
    setHighlightMatching(to);
    localStorage.highlightMatching = to;
  }

  function changeShowContradiction(to) {
    setShowContradiction(to);
    localStorage.showContradiction = to;
  }

  function changeShowButtons(to) {
    setShowButtons(to);
    localStorage.showButtons = to;
  }

  function changeShowPlayers(to) {
    setShowPlayers(to);
    localStorage.showPlayers = to;
  }

  function changeName(input) {
    var tempN = "";
    var inputted = false;
    if (input!=="null"&&input!=="undefined"&&input!==null&&input!==undefined) tempN = input;
    else {
      inputted= true;
      while (tempN === "" || tempN === "undefined" || tempN === "null" || tempN === undefined || tempN === null) {
        tempN = prompt("Enter your name: ");
      }
    }
    
    const tempS = {...selected};
    // delete tempS[name];
    tempS[tempN] = selected[name]; 
    setSelected(tempS);

    const tempC = {...selected};
    // delete tempC[name];
    tempC[tempN] = selected[name]; 
    setColors(tempC);

    setName(tempN);  
    localStorage.name = tempN;

    if (inputted) {
      window.location.reload();
    }
  }

  function changeColor() {
    const temp = {...colors};
    temp[name] = "";
    while (!(/^\d{1,3} \d{1,3} \d{1,3}$/).test(temp[name])) {
      temp[name] = prompt("Enter your color (space separated rgb values): ");
    }
    setColors(temp);
    localStorage.color = temp[name];
    if (name !== "") databaseService.updateChild("colors",name,temp);
  }

  //Get local info if it exists
  useEffect(() => {
    if (localStorage.highlightSoduko) setHighlightSoduko(localStorage.highlightSoduko);
    else changeHighlightSoduko(false);
    if (localStorage.highlightMatching) setHighlightSoduko(localStorage.highlightMatching);
    else changeHighlightMatching(false);
    if (localStorage.showContradiction) setHighlightSoduko(localStorage.showContradiction);
    else changeShowContradiction(false);
    if (localStorage.showButtons) setHighlightSoduko(localStorage.showButtons);
    else changeShowButtons(true);
    if (localStorage.showPlayers) setHighlightSoduko(localStorage.showPlayers);
    else changeShowPlayers(true);

    var tempN = "";
    if (localStorage.name || localStorage.name === "") {
      tempN = localStorage.name;
      changeName(localStorage.name);
    }
    else changeName();

    tempN = (tempN==="" ? name : tempN)

    if (localStorage.color && localStorage.color !== "" && localStorage.color !== null && localStorage.color !== undefined) {
      const tempC = {...colors};
      // console.log(colors);
      tempC[tempN] = localStorage.color;
      setColors(tempC);
      // console.log(temp);
      if (tempC !== {"default":''}) {
        databaseService.updateChild("colors",tempN,tempC[tempN]);
      }
      // console.log(temp)
    } else changeColor();

    const tempS = {...selected};
    tempS[tempN] = new Array(1).fill(0);
    setSelected(tempS);
    databaseService.updateChild("selected",tempN,tempS[tempN]);
  },[]);

  function shouldHighlight(index, selected) {
    //Note: in this case, selected should be selected[name]

    // return true if any of the below:
    // const same_box = Math.ceil(index%9/3)==Math.ceil(selected%9/3) //same 3 cols
    //               && Math.ceil(index/27)==Math.ceil(selected/27); //same 3 rows
    // const same_row = Math.ceil(index/9)==Math.ceil(selected/9);
    // const same_col = selected%9==index%9;
    // console.log(selected);
    if (typeof(selected)==="undefined"||selected.length>1||selected[0]===index) return false; 
    //only run if defined //only highlight if one square selected //only highlight if NOT current square
    index++; selected=selected[0]+1; //essentially using IDs
    return (Math.floor((index-1)%9/3)===Math.floor((selected-1)%9/3) 
    && Math.ceil(index/27)===Math.ceil(selected/27))
    ||(Math.ceil(index/9)===Math.ceil(selected/9))
    ||(selected%9===index%9)
  }
  
  function getCellClass(selected, index, val, colorVal) {
    return "cell" 
    + (typeof(selected[name])!=="undefined"&&val>0&&(selected[name].length===1)&&board_vals[selected[name][0]]%10===val%10 ? 
    ((showContradiction&&shouldHighlight(index,selected[name]) ? " mistake" : "") + 
    (highlightMatching ? " equiv" : ""))
    : ((highlightSoduko ? shouldHighlight(index, selected[name]) : false) ? 
    " highlighted" : ""))
    + (val>10 ? " given" : "")
    + (" " + colorDict[colorVal]);
  }


  function changeBoard(val,indexes) {
    const temp = [...board_vals];
    indexes.forEach(index => {
      temp[index] = temp[index] === val ? 0 : val; //toggle if already
    });
    setBoard_vals(temp);
    databaseService.update("board_vals",temp);
  }

  function changeNotes(val,indexes) {
    const temp = [...board_notes];
    indexes.forEach(index => {
      if (val) {
        // val in current ? add val : remove val;
        const current = temp[index];
        temp[index] = arrHas(current,val) ? current.replace(val,'') : current+val;
      } else { //0 => clear
        temp[index] = "";
      }
    });
    setBoard_notes(temp);
    databaseService.update("board_notes",temp);
  }

  function changeCenters(val, indexes) {
    const temp = [...board_centers];
    indexes.forEach(index => {
      if (val) {
        // val in current ? add val : remove val;
        const current = temp[index];
        temp[index] = arrHas(current,val) ? current.replace(val,'') : current+val;
      } else { //0 => clear
        temp[index] = "";
      }
    });
    setBoard_centers(temp);
    databaseService.update("board_centers",temp);
  }

  function changeColors(val, indexes) {
    const temp = [...board_colors];
    indexes.forEach(index => {
      temp[index] = temp[index] === val ? 0 : val; //toggle if already
    });
    setBoard_colors(temp);
    databaseService.update("board_colors",temp);
  }

  function inputNumber(key) {
    if (mode === 1) changeNotes(key,selected[name]);
    else if (mode === 2) changeCenters(key,selected[name]);
    else if (mode === 3) changeColors(key,selected[name]);
    else if (mode === 4) changeBoard(key+10,selected[name]); //given
    else changeBoard(key,selected[name]);
  }

  function inputDelete() {
    //if any val nonempty, delete all. if empty, clear all notes.
    if (selected[name].some((val)=>board_vals[val])) changeBoard(0,selected[name]);
    else {
      changeNotes(0,selected[name]);
      changeCenters(0,selected[name]);
      changeColors(0,selected[name]);
    }
  }

  function toggleMode(to) {
    if (mode === to) setMode(0);
    else setMode(to);
  }

  useEffect(() => {

    function handleKeyPress(event) {
      // console.log(event.which);
      if (49 <= event.which && event.which <= 57 && selected[name].length>0) { //digit
        const key = event.which-48; //number
        inputNumber(key);
      }

      //backspace
      else if (event.which === 8 && selected[name].length>0) inputDelete();

      //capslock || home
      else if (event.which === 20 || event.which === 36) toggleMode(1);

      // + || pgup
      else if (event.which === 187 || event.which === 33) toggleMode(2);
      
      // - || pgdown
      else if (event.which === 189 || event.which === 34) toggleMode(3);

      //ctrl || end
      else if (event.which === 17 || event.which === 35) toggleMode(4);

      //ESC 
      else if (event.which === 27) setOptionsMenu(!optionsMenu);
    };  
    document.addEventListener('keydown', handleKeyPress);

    function tryClearSelected(event) { 
      // console.log("clicked, target = " + event.target.id);
      if (event.target !== document.getElementById("theHtml") 
      && event.target !== document.getElementById("buttons")
      && event.target !== document.getElementById("container")) return;
      const temp = {};
      Object.keys(selected).map((e)=>(temp[e]=[]));
      setSelected(temp);
    }

    function handleClick(event) {
      setMousedown(true);
      tryClearSelected(event);
    };
    document.addEventListener('mousedown', handleClick);

    function handleClickRelease(event) {
      setMousedown(false);
    };
    document.addEventListener('mouseup', handleClickRelease);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('mouseup', handleClickRelease);
    };
  }, [board_notes, board_vals, board_centers, board_colors, colors, selected, mode, optionsMenu]); 

  function clickToggleSelected(index,event) {
    // console.log(index + " :index|selected: " + selected);

    /// OLD SINGLE SELECT
    // setSelected(selected===index ? -2 : index);
    // databaseService.update("selected",selected===index ? -2 : index);

    // if not pressing shift, selected needs to be reset
    var temp = {...selected};
    if (!event.shiftKey) temp[name] = [];
    // otherwise, just toggle each new one
    if (arrHas(temp[name], index)) {
      setAdding(false);
      temp[name].splice(temp[name].indexOf(index), 1);
    }
    else {
      setAdding(true);
      temp[name].push(index);
    }
    setSelected(temp);
    databaseService.updateChild("selected",name,temp[name]);
  }

  function dragToggleSelected(index,event) {
    // console.log("called, mousedown: " + mousedown);
    if (mousedown) {
      const temp = {...selected};
      if (adding && !arrHas(temp[name], index)) temp[name].push(index);
      else if (!adding && arrHas(temp[name],index)) temp[name].splice(temp[name].indexOf(index), 1);;
      setSelected(temp);
      databaseService.updateChild("selected",name,temp[name]);
    }
  }

  function getCellColor(selected,index) {
    const keys = Object.keys(selected);
    if (arrHas(keys, "default")) keys.splice(keys.indexOf("default"), 1);
    for (var i = 0; i<keys.length; i++) {
      if (arrHas(selected[keys[i]],index)) {
        return colorToText(colors[keys[i]]);
      }
    }
    return "";
  }

  const Cells = board_vals.map((val,index) => (
    <div key={index.toString()} 
          id={index.toString()} 
          className={getCellClass(selected,index,val,board_colors[index])}
          onMouseDown={(event)=>clickToggleSelected(index, event)}
          onMouseEnter={(event)=>dragToggleSelected(index, event)}
          style={{backgroundColor: getCellColor(selected,index)}}>
      {val ? val%10 : NoteGrid(index, board_notes[index], board_centers[index])}
    </div>
    )
  );

  

  /////----------------BOARD ENDS------------------

  /////---------------BUTTONS START----------------
  function clearBoard() { //not working rn, not being called for some reason
    const temp = {};
    Object.keys(selected).forEach((e)=>temp[e]=[]);
    setSelected(temp);
    setBoard_vals(new Array(81).fill(0));
    databaseService.update("board_vals", new Array(81).fill(0));

    setBoard_colors(new Array(81).fill(0));
    databaseService.update("board_colors", new Array(81).fill(0));

    setBoard_notes(new Array(81).fill(""));
    databaseService.update("board_notes", new Array(81).fill(""));

    setBoard_centers(new Array(81).fill(""));
    databaseService.update("board_centers", new Array(81).fill(""));

    setMode(0);
  }

  function getButtonClass(val) {
    switch(mode) {
      case 1: return "note";
      case 2: return "center";
      case 3: return "color-mode " + colorDict[val];
      case 4: return "given";
      default: return "";
    }
  }

  const Buttons = () => (
    <div className="buttons" id="buttons">
      <div className="StateButtons">
        <div id="notes" className={"state-button" + (mode===1 ? " on" : "")} onMouseDown={() => toggleMode(1)}>Corner</div>
        <div id="centerer" className={"state-button" + (mode===2 ? " on" : "")} onMouseDown={() => toggleMode(2)}>Center</div>
        <div id="colors" className={"state-button" + (mode===3 ? " on" : "")} onMouseDown={() => toggleMode(3)}>Colors</div>
        <div id="given" className={"state-button" + (mode===4 ? " on" : "")} onMouseDown={() => toggleMode(4)}>Given</div>
        <div id="deleter" className="state-button" onMouseDown={inputDelete}>Delete</div>
      </div>
      <div className={"NumberButtons"}>
        {Array(9).fill(0).map((e,index) => 
          (<div key={"button" + index} className={"num-button " + getButtonClass(index+1)} onMouseDown={() => inputNumber(index+1)}>{index+1}</div>))}
      </div>
    </div>
  ); 


  //Options are:
  // highlightSoduko
  // highlightMatching
  // showContradiction
  // showButtons
  // showPlayers
  // changeName
  // changeColor
  // clearBoard

  const Options = () => {

    function getOptionClass(option) {
      return "options-menu-button" + (option ? " option-on" : "");
    }

    function clearDatabase() {
      databaseService.deleteAll();
      window.location.reload();
    }

    return (
      <>
        <div className="options-button" onMouseDown={openOptions}>⚙️</div>
        <div id="options-overlay" className="options-overlay" style={{height: (optionsMenu ? "100%":"0%")}}>
          <div className="hidden">GAP</div>
          <div className="options-menu-text">OPTIONS</div>
          <div className="hidden">GAP</div>
          <div id="highlightSoduko-button" className={getOptionClass(highlightSoduko)} onMouseDown={() => changeHighlightSoduko(!highlightSoduko)}>Highlight Soduko</div>
          <div id="highlightMatching-button" className={getOptionClass(highlightMatching)} onMouseDown={() => changeHighlightMatching(!highlightMatching)}>Highlight Matching</div>
          <div id="showContradiction-button" className={getOptionClass(showContradiction)} onMouseDown={() => changeShowContradiction(!showContradiction)}>Show Contradiction</div>
          <div id="showButtons-button" className={getOptionClass(showButtons)} onMouseDown={() => changeShowButtons(!showButtons)}>Show Buttons</div>
          <div id="showPlayers-button" className={getOptionClass(showPlayers)} onMouseDown={() => changeShowPlayers(!showPlayers)}>Show Players</div>
          <div className="hidden">GAP</div>
          <div id="changeNamer" className="options-menu-button" onMouseDown={() => changeName()}>Change Name</div>
          <div id="changeColorer" className="options-menu-button" onMouseDown={changeColor}>Change Color</div>
          <div className="hidden">GAP</div>
          <div id="clearer" className="options-menu-button" onMouseDown={clearBoard}>Clear Board</div>
          <div id="databaseClearer" className="options-menu-button" onMouseDown={clearDatabase}>Reset Database</div>
          <div className="options-close-button" onMouseDown={closeOptions}>X</div>
        </div>
      </>
    );

    function openOptions() {
      setOptionsMenu(true);
    }

    function closeOptions() {
      setOptionsMenu(false);
    }
  }

  const Players = () => {
    const keys = Object.keys(colors);
    if (arrHas(keys, "default")) keys.splice(keys.indexOf("default"), 1);
    
    return (
    <div className="players-container">
      {keys.map((e) => (
        <div className="player-name" id={"player" + e} key={"player" + e} style={{color: colorToText(colors[e])}}>{e}</div>
        )
      )}
    </div>
    );
  };

  return (
    <div className="board-container">
      <div className="cell-grid">
        {Cells}
      </div>
      {showButtons ? <Buttons/> : ""}
      {<Options/>}
      {showPlayers ? <Players/> : ""} 
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