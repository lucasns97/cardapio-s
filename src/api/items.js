// Módulos principais
import firebase from 'firebase'

export async function getTransferItems(itemClass) {
    
  // Inicializando instância do firestore
  let db = firebase.firestore();
  let items = []

  return new Promise(async function(resolve, reject) {

    // Create a reference to the items collection
    const itemsRef = db.collection('items');

    // Create a query against the collection
    const snapshot = await itemsRef.where('class', '==', itemClass).get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      resolve(items);
    }  
    
    snapshot.forEach(doc => {
      let itemData = doc.data()
      itemData.id    = doc.id
      itemData.label = itemData.name
      itemData.key   = doc.id

      items.push(itemData)
    });

    resolve(items)
  })
}

export async function updateTransferItems(items) {

  let itemClass = items[0].class
  let oldItems  = await getTransferItems(itemClass)
    
  // Inicializando instância do firestore
  let db        = firebase.firestore();

  return new Promise(async function(resolve, reject) {

    // Create a reference to the items collection
    const itemsRef = db.collection('items');

    // Percorre cada item e atualiza / cria
    items.forEach(async function(item) {
      // cria novo item
      if (!item.id) {
        let itemRef = itemsRef.doc()
        const res = await itemRef.set(item, { merge: true })
      }

      // atualiza item existente
      else {
        let itemRef = itemsRef.doc(item.id)
        const res = await itemRef.set(item, { merge: true })
      }
    })

    // Percorre itens antigos para deletar itens apagados
    oldItems.forEach(async function(oldItem) {
      let isNew = false
      items.forEach(async function(newItem) {
        if (oldItem.id == newItem.id) {
          isNew = true
        }
      })

      // deleta item
      if (!isNew) {
        let res = await itemsRef.doc(oldItem.id).delete()
      }
    })

    resolve()
  })
}