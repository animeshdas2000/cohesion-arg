window.addEventListener ('load', event => {
  var DBOpenRequest = window.indexedDB.open ('firebaseLocalStorageDb', 1);
  DBOpenRequest.onsuccess = function (event) {
    db = DBOpenRequest.result;
    getData ();
  };
  function getData () {
    var transaction = db.transaction (['firebaseLocalStorage'], 'readonly');
    var objectStore = transaction.objectStore ('firebaseLocalStorage');
    var objectStoreRequest = objectStore.get (
      'firebase:authUser:AIzaSyCSCtlJQonBocdEtmQ_g5z0SQUI5VTk72o:[DEFAULT]'
    );
    objectStoreRequest.onsuccess = function (event) {
      var uid = objectStoreRequest.result.value.uid;
      document.cookie = 'uid=' + uid;
      if (uid != null) window.location = '/';
    };
  }
});
