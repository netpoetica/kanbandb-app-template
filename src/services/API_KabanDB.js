// import initalize from '../KabanDB/index';
import KanbanDB from 'kanbandb';

async function KabanService () {
    
    const db = await KanbanDB.connect(null);
    



    db.addCard({
        name: 'Test',
        description: 'Test',
        status: 'IN_PROGRESS'
      });
      db.addCard({
        name: 'Bug',
        description: 'Bugging me',
        status: 'DONE'
      });
      db.addCard({
        name: 'Refactor',
        description: 'Bugging me',
        status: 'TODO'
      });
      db.addCard({
        name: 'Refactor Bug',
        description: 'Bugging me',
        status: 'TODO'
      });


    //  function getCardsByStatus(status){ 
    //   return  db.getCardsByStatusCodes([`${status}`]);
    // }


    // function getCardById(id){
    //    return db.getCardById(id);
    // }


  

    // return { getCardsByStatus , getCardById };
    return {db}
}

export default KabanService;
