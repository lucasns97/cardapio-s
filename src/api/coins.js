// Módulos principais
import firebase from 'firebase'

export async function getCoinData(coinKey) {
    
  // Inicializando instância do firestore
  let db = firebase.firestore();

  return new Promise(async function(resolve, reject) {
    let coinRef = db.collection('coins').doc(coinKey)
    const doc = await coinRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      reject()
    } else {
      resolve(doc.data())
    }
  })
}