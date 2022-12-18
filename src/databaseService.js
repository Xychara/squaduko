import firebase from "./firebase";

const db = firebase.ref();

class databaseService {
  getAll() {
    return db;
  }

  add(key,value) {
    return db.set({
      [key]: value,
    });
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

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new databaseService();