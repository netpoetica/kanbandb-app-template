import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import EasyEdit, { Types } from 'react-easy-edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import {
  MenuItem,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import InputBase from '@material-ui/core/InputBase';
import kanbanDB from './data';

let db;

(async () => {
  db = await kanbanDB.connect();
})();

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
    display: 'inline-grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const onDragEnd = async (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn];
    const destItems = [...destColumn];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: sourceItems.map((item) => ({
        ...item,
        status: source.droppableId,
      })),
      [destination.droppableId]: destItems.map((item) => ({
        ...item,
        status: destination.droppableId,
      })),
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: copiedItems,
    });
  }
};

const columnsFromBackend = {
  TODO: [],
  DOING: [],
  DONE: [],
};

const App = () => {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    (async () => {
      if (db) {
        const cards = await db.getCards();
        setCards(cards);
      }
    })();
  }, []);

  useEffect(() => {}, [cards]);

  const handleSave = async ({ value, columnId, item }) => {
    const { id, status } = item;
    await db.updateCardById(id, { description: value });
    console.log('handle SAve', value, columnId, item);
    setColumns((prevColumns) => {
      let newColumns = { ...prevColumns };
      let idx = newColumns[status].findIndex((x) => x.id === item.id);
      newColumns[status][idx] = {
        ...newColumns[status][idx],
        description: value,
      };
      return { ...newColumns };
    });
  };

  const cancel = () => {
    //do nothing
  };

  const [statusValue, setStatusValue] = React.useState('TODO');
  const handleChangeStatus = (event) => {
    setStatusValue(event.target.value);
  };

  const [descValue, setDescValue] = useState('');
  const [titleValue, setTitleValue] = useState('');

  const handleChangeDesc = (e) => {
    setDescValue(e.target.value);
  };

  const handleChangeTitle = (e) => {
    setTitleValue(e.target.value);
  };

  const handleClickRemove = async ({ columnId, item }) => {
    const { id, status } = item;
    await db.deleteCardById(id);

    setColumns((prevColumns) => {
      let newColumns = { ...prevColumns };
      const updatedItems = newColumns[status].filter(
        (obj) => obj.id !== item.id
      );
      newColumns[status] = updatedItems;
      return { ...newColumns };
    });
    try {
      const cards = await db.getCards();
      setCards(cards);
    } catch (err) {
      setCards([]);
    }
  };

  const handleSaveToBoard = ({ status, description, title }) => async () => {
    const cardId = await db.addCard({
      description,
      status,
      title,
    });

    const newCard = await db.getCardById(cardId);

    setColumns((prevColumns) => {
      let newColumns = { ...prevColumns };
      newColumns[status].push(newCard);
      return newColumns;
    });

    setCards((prevCards) => {
      let newCardsUpdated = [...prevCards, newCard];
      return newCardsUpdated;
    });
  };
  const classes = useStyles();

  return (
    <>
      <AppBar
        position="static"
        style={{ color: 'white', backgroundColor: '#378a7b' }}
      >
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            {'Kanban App'}
          </Typography>
        </Toolbar>
      </AppBar>
      {cards.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            height: '100%',
            width: '100%',
          }}
        >
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div
                  style={{
                    justifySelf: 'stretch',
                  }}
                  key={columnId}
                >
                  <h2>{columnId}</h2>
                  <div style={{ margin: 8 }}>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? 'lightblue'
                                : 'lightgrey',
                              padding: 4,
                              width: 250,
                              minHeight: 500,
                            }}
                          >
                            {column.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: 'none',
                                          padding: 16,
                                          margin: '0 0 8px 0',
                                          minHeight: '50px',
                                          backgroundColor: snapshot.isDragging
                                            ? '#263B4A'
                                            : '#456C86',
                                          color: 'white',
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <>
                                          <EasyEdit
                                            type={Types.TEXT}
                                            onSave={(value) =>
                                              handleSave({
                                                value,
                                                columnId,
                                                item,
                                              })
                                            }
                                            onCancel={cancel}
                                            saveButtonLabel={
                                              <FontAwesomeIcon icon={faCheck} />
                                            }
                                            cancelButtonLabel={
                                              <FontAwesomeIcon icon={faTimes} />
                                            }
                                            value={item.description}
                                            // instructions="Star this repo!"
                                          />

                                          <button
                                            color={'primary'}
                                            onClick={(e) =>
                                              handleClickRemove({
                                                columnId,
                                                item,
                                              })
                                            }
                                          >
                                            X
                                          </button>
                                        </>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      ) : (
        <Typography variant="h5">
          {
            'No Cards To display , start adding atleast one card to display board'
          }
        </Typography>
      )}

      <FormControl className={classes.margin}>
        <TextField
          id="standard-multiline-flexible"
          label="Title"
          value={titleValue}
          onChange={handleChangeTitle}
        />
        <TextField
          id="standard-multiline-flexible"
          label="Description"
          multiline
          rowsMax={2}
          value={descValue}
          onChange={handleChangeDesc}
        />

        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={statusValue}
          onChange={handleChangeStatus}
          input={<BootstrapInput />}
          defaultValue={'TODO'}
        >
          {Object.keys(columnsFromBackend).map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Button
          style={{ color: 'white', backgroundColor: '#378a7b' }}
          variant="contained"
          onClick={handleSaveToBoard({
            status: statusValue,
            description: descValue,
            title: titleValue,
          })}
        >
          {'ADD NEW'}
        </Button>
      </FormControl>
    </>
  );
};

export default App;
