import KanbanDB from 'kanbandb';

async function initialize() {
  /**
   * Use KanbanDB like so (but you might want to move it) - types are provided
   * by jsconfig.json, which will utilize d.ts files and give you autocompletion for
   * KanbanDB, in Visual Studio Code, if that is your preferred IDE.
   * 
   * This code (initialize function) is for demonstration only.
   */
  const instance = await KanbanDB.connect(null);
  instance.addCard({
    name: 'Test',
    description: 'Test',
    status: 'IN_PROGRESS'
  });
  instance.addCard({
    name: 'Bug',
    description: 'Bugging me',
    status: 'DONE'
  });
  instance.addCard({
    name: 'Refactor',
    description: 'Bugging me',
    status: 'TODO'
  });
  instance.addCard({
    name: 'Refactor Bug',
    description: 'Bugging me',
    status: 'TODO'
  });
  instance.getCards().then(console.log);
  instance.getCardsByStatusCodes(['DONE']).then(console.log);
    return instance;
}


export default initialize;