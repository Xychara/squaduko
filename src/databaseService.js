import firebase from "./firebase";

const db = firebase.ref();

class databaseService {
  getAll() {
    return db;
  }

  // getSnapshot() {
  //   db.once("value").then(function(snapshot) {
  //     // var selected = snapshot.child("selected").val();
  //     return selected;
  //   })
  // }

  add(key,value) {
    return db.child(key).set(value);
    // .then(()=>console.log('Data added.'));
  }

  update(key, value) {
    var obj={};
    obj[key]=value;
    return db.update({
      [key]: value, 
    });
    // .then(()=>console.log('Data updated: ' + key));
  }

  // delete(key) {
  //   return db.child(key).remove();
  // }

  delete(key1, key2) {
    return db.child(key1).child(key2).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new databaseService();