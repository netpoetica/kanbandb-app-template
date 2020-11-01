import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import KanbanDB from 'kanbandb/dist/KanbanDB';
function initialize() {
  KanbanDB.connect();
}



function App() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState(null)
  const modalRef = useRef(null)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    initialize()
    KanbanDB.getCards()
      .then((cards) => {
        setCards(cards)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  function renderTitle(title) {
    return (
      <div style={{ display: "flex", height: 100, justifyContent: "center", alignItems: "center", flex: 1 }}>
        <h4 style={{ color: "#0b008b" }}>{title}</h4>
      </div>
    )
  }

  const clearState = () => {
    setStatus("TODO")
    setTitle("")
    setDescription("")
    setCardId(null)
  }

  const toggleModal = (card) => {
    if(card && card.id){
      setEditMode(true)
      setDescription(card.description)
      setTitle(card.name)
      setCardId(card.id)
      setStatus(card.status)
    }

    if (modalRef.current.style.display != "block"){
      modalRef.current.style.display = "block"
    } else {
      modalRef.current.style.display = "none"
      clearState()
    }
  }

  function Card(card) {
    const statuses = [{ status: "TODO", label: "to do" }, { status: "DOING", label: "doing" }, { status: "DONE", label: "done" }]
    return (
      <div style={{
        flexDirection: "column", marginBottom: 14, backgroundColor: "grey", padding: 14, paddingBottom: 25, backgroundColor: "#ffffff", borderRadius: 7,
        boxShadow: "0px 6px 15px 0px #d6dfe9"
      }}>
        <div>
          <p style={{ color: "#334e67", margin: 0 }}>{card.name + ' : ' + card.description}</p>
        </div>
        {
          <div style={{ display: "flex", flexDirection: "row", height: 20, width: "100%", position: "relative", top: 15, justifyContent: "space-between" }}>
            <div>
              {
                statuses.filter(x => x.status != card.status).map(y => { return <small onClick={() => updateCard(card.id, { ...card, status: y.status })} style={{ marginRight: 8, fontWeight: "bold", color: "#c9d1da", cursor: "pointer" }}> {y.label}</small> })
              }
            </div>
            <div>
                <small onClick={()=> toggleModal(card)} style={{ alignSelf: "flex-end", color: "rgb(112 208 238 / 1)", fontWeight: "bold", cursor: "pointer" }}>edit</small>
                <small onClick={()=> deleteCard(card.id)} style={{ marginLeft:8, alignSelf: "flex-end", color: "#fb5c5c", fontWeight: "bold", cursor: "pointer" }}>delete</small>
            </div>
          </div>
        }
      </div>
    )
  }

  const addToBoard = () => {
    KanbanDB
      .addCard({ name: title, description: description, status: status })
      .then(cardId => KanbanDB.getCards()
        .then((cards) => {
          clearState()
          setCards(cards)
          toggleModal()
        })
      )
      .catch(err => console.log(err.message))
  }

  const updateCard = (id, data) => {
    if (editMode) {
      setEditMode(false)
      clearState()
      toggleModal()
    }

    KanbanDB
      .updateCardById(id, data)
      .then(() => KanbanDB.getCards()
        .then((cards) => {
          setCards(cards)
        })
      )
      .catch(err => console.log(err.message))
  }

  const deleteCard = (id) => {
    KanbanDB
      .deleteCardById(id)
      .then(() => KanbanDB.getCards()
        .then((cards) => {
          setCards(cards)
        })
      )
      .catch(err => setCards([]))
  }
  
  return (
    <div className="App" style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4f8" }}>
      <div style={{ flexDirection: "row", display: "flex", height: 700, width: 1000 }}>
        <div style={{
          display: "flex", flexDirection: "column",
          flex: 1, borderLeftWidth: 1, borderRightWidth: 1,
          marginBottom: 20
        }}>
          {renderTitle("To-do")}
          <div style={{
            display: "flex", overflowY:"scroll", flexDirection: "column", height: "90%", borderLeft: "solid 2px #d9e2ec",
            padding: 40, paddingTop: 0
          }}>
            {cards.filter(card => card.status == "TODO").map(card => { return Card(card, updateCard, deleteCard) })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, borderColor: "black" }}>
          {renderTitle("In Progress")}
          <div style={{
            display: "flex", overflowY:"scroll", flexDirection: "column", height: "90%", borderLeft: "solid 2px #d9e2ec",
            padding: 40, paddingTop: 0
          }}>
            {cards.filter(card => card.status == "DOING").map(card => { return Card(card, updateCard, deleteCard) })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {renderTitle("Done")}
          <div style={{
            display: "flex", overflowY:"scroll", flexDirection: "column", height: "90%", borderLeft: "solid 2px #d9e2ec", borderRight: "solid 2px #d9e2ec",
            padding: 40, paddingTop: 0
          }}>
            {cards.filter(card => card.status == "DONE").map(card => { return Card(card, updateCard, deleteCard) })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", backgroundColor: "white", height: 60, width: 700, bottom: 30, borderRadius: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <input type="text" placeholder="Enter Title" style={{ width: 450, height: 32, marginLeft: 10, border: "none", backgroundColor: "#f0f3f8", borderRadius: 3, color: "#9eb3c7", paddingLeft: 15 }} value={title} onChange={(event) => setTitle(event.target.value)} />
          <input disabled={title == ""} type="submit" style={{ width: 170, height: 35, marginRight: 10, border: "none", borderRadius: 3, backgroundColor: "#3ebd93", color: "white", fontWeight: "bold", fontSize: 15, opacity: title == "" ? .7 : 1 }} value="ADD NEW" onClick={toggleModal} />
        </div>
      </div>
      <div id="myModal" className="modal" ref={modalRef}>

        <div className="modal-content">
          <div style={{ display: "flex", flexDirection: "row", height: 30, justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "#808080" }}>{ editMode ? "Edit Card" : "Add To Board"}</h3>
            <h4 onClick={toggleModal} style={{ color: "#808080", cursor: "pointer" }}>Close</h4>
          </div>
          <div onSubmit={addToBoard} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", marginTop: 20 }}>
            <label style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
              Title
                <input type="text" style={{ width: 350, height: 32, border: "none", backgroundColor: "#f0f3f8", borderRadius: 3, color: "#9eb3c7", paddingLeft: 15 }} value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label style={{ display: "flex", justifyContent: 'space-between', marginTop: 30, alignItems: "center" }}>
              Description
                <input type="text" style={{ width: 350, height: 32, border: "none", backgroundColor: "#f0f3f8", borderRadius: 3, color: "#9eb3c7", paddingLeft: 15 }} value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>
            <label style={{ display: "flex", justifyContent: 'space-between', marginTop: 30, alignItems: "center" }}>
              Status
                  <select value={status} onChange={(event) => setStatus(event.target.value)} style={{ width: 367, height: 32, border: "none", backgroundColor: "#f0f3f8", borderRadius: 3, color: "#9eb3c7", paddingLeft: 15 }}>
                <option value="TODO" >To-do</option>
                <option value="DOING" >In Progress</option>
                <option value="DONE" >Done</option>
              </select>
            </label>

            <input type="submit" onClick={() => editMode ? updateCard(cardId, {name: title, description: description, status: status}) : addToBoard()} style={{ marginTop: 30, width: 170, height: 35, border: "none", borderRadius: 3, backgroundColor: "rgb(75 166 230 / 39)", color: "white", fontWeight: "bold", fontSize: 15 }} value={editMode ? "UPDATE":"POST"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
